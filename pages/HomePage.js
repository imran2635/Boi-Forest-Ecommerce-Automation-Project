const { BasePage } = require('./BasePage');
const config = require('../config/config');

class HomePage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.loginLink = page.getByRole('link', { name: /লগইন|Login/i }).first();
    this.logo = page.getByRole('img', { name: /বই ফরেস্ট|Boi Forest/i }).first();
    this.cartButton = page.getByRole('button', { name: /কার্ট|Cart/i }).first();
    this.productRegion = page.getByRole('region', {
      name: /সম্প্রতি বিক্রি|Recently Sold|RECENTLY/i,
    }).first();
    this.addButtons = page.getByRole('button', { name: /যোগ|Add/i });
    this.buyButtons = page.getByRole('button', { name: /কিনুন|Buy/i });
  }

  async open() {
    await this.navigate(config.baseURL);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async goToLogin() {
    await this.click(this.loginLink);
  }

  async scrollToProducts() {
    if (await this.productRegion.count()) {
      await this.productRegion.scrollIntoViewIfNeeded();
    } else {
      await this.page.evaluate(() => window.scrollBy(0, 900));
    }
  }

  async waitForProducts() {
    await this.scrollToProducts();
    await this.buyButtons.first().waitFor({ state: 'visible', timeout: 30000 });
  }

  async addFirstProductToCart() {
    await this.waitForProducts();
    const addBtn = this.addButtons.first();
    await addBtn.waitFor({ state: 'visible', timeout: 15000 });
    await addBtn.click();
  }

  async buyFirstProduct() {
    await this.waitForProducts();
    const buyBtn = this.buyButtons.first();
    await buyBtn.waitFor({ state: 'visible', timeout: 15000 });
    await Promise.all([
      this.page.waitForURL(/\/checkout/, { timeout: 30000 }),
      buyBtn.click(),
    ]);
  }

  async openCart() {
    await this.click(this.cartButton);
  }
}

module.exports = { HomePage };
