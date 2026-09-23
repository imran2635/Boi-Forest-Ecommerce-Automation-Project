const { BasePage } = require('./BasePage');

class ForgotPasswordPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.emailInput = page.locator('#email');
    this.submitButton = page.getByRole('button', {
      name: /রিসেট নির্দেশনা পাঠান|Send reset|Reset/i,
    });
    this.backButton = page.getByRole('button', { name: /পেছনে|Back/i });
    this.signInButton = page.getByRole('button', { name: /সাইন ইন|Sign In/i });
    this.heading = page.getByRole('heading', {
      name: /পাসওয়ার্ড ভুলে গেছেন|Forgot password/i,
    });
    this.successMessage = page.getByText(
      /ইমেইল পাঠানো|reset|চেক করুন|sent|সফল|instruction/i
    );
  }

  async waitForForm() {
    await this.waitForVisible(this.emailInput);
  }

  async enterEmail(email) {
    await this.fill(this.emailInput, email);
  }

  async clickSubmit() {
    await this.click(this.submitButton);
  }

  async submitResetRequest(email) {
    await this.enterEmail(email);
    await this.clickSubmit();
  }

  async isFormVisible() {
    return this.isVisible(this.emailInput);
  }
}

module.exports = { ForgotPasswordPage };
