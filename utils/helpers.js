const fs = require('fs');
const path = require('path');

class TempMailHelper {
  constructor() {
    this.baseUrl = 'https://api.mail.tm';
    this.token = null;
    this.accountId = null;
    this.address = null;
    this.password = null;
  }

  async #request(method, endpoint, body) {
    const headers = { 'Content-Type': 'application/json' };
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`TempMail ${method} ${endpoint} failed (${response.status}): ${text}`);
    }

    if (response.status === 204) {
      return null;
    }

    return response.json();
  }

  async #getDomain() {
    const data = await this.#request('GET', '/domains?page=1');
    const domain = data['hydra:member']?.[0]?.domain;
    if (!domain) {
      throw new Error('No temp mail domain available');
    }
    return domain;
  }

  #randomLocalPart() {
    return `boiforest${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }

  async createInbox() {
    const domain = await this.#getDomain();
    this.address = `${this.#randomLocalPart()}@${domain}`;
    this.password = `TmpPass@${Date.now()}`;

    const account = await this.#request('POST', '/accounts', {
      address: this.address,
      password: this.password,
    });
    this.accountId = account.id;

    const tokenData = await this.#request('POST', '/token', {
      address: this.address,
      password: this.password,
    });
    this.token = tokenData.token;

    return {
      email: this.address,
      password: this.password,
      accountId: this.accountId,
    };
  }

  async getMessages() {
    if (!this.token) {
      throw new Error('Temp mail inbox not created. Call createInbox() first.');
    }
    const data = await this.#request('GET', '/messages');
    return data['hydra:member'] || [];
  }

  async waitForMessage({ timeoutMs = 60000, pollMs = 3000 } = {}) {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const messages = await this.getMessages();
      if (messages.length > 0) {
        return messages[0];
      }
      await new Promise((resolve) => setTimeout(resolve, pollMs));
    }
    throw new Error(`No email received within ${timeoutMs}ms`);
  }

  async getMessageById(id) {
    return this.#request('GET', `/messages/${id}`);
  }
}

class CredentialStore {
  static resolvePath(filePath) {
    return path.resolve(process.cwd(), filePath);
  }

  static save(filePath, data) {
    const fullPath = this.resolvePath(filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), 'utf-8');
  }

  static load(filePath) {
    const fullPath = this.resolvePath(filePath);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Credentials not found at ${fullPath}. Run Account Create flow first.`);
    }
    return JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
  }
}

class TestDataHelper {
  static randomBdPhone() {
    const prefixes = ['017', '018', '019', '016', '015', '013'];
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const rest = String(Math.floor(10000000 + Math.random() * 89999999));
    return `${prefix}${rest}`;
  }

  static randomName(prefix = 'User') {
    return `${prefix}${Math.floor(Math.random() * 10000)}`;
  }

  static strongPassword() {
    return `Boi@${Date.now().toString().slice(-6)}Aa1`;
  }
}

module.exports = { TempMailHelper, CredentialStore, TestDataHelper };
