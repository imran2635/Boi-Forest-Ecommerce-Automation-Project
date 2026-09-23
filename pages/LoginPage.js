const { BasePage } = require('./BasePage');
const config = require('../config/config');

class LoginPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.identifierInput = page.locator('#identifier');
    this.passwordInput = page.locator('#password');
    this.rememberCheckbox = page.locator('#remember');
    this.signInButton = page.getByRole('button', { name: /সাইন ইন|Sign In/i });
    this.createAccountButton = page.locator('button', {
      hasText: /অ্যাকাউন্ট তৈরি করুন|Create account/i,
    });
    this.forgotPasswordButton = page.getByRole('button', {
      name: /পাসওয়ার্ড ভুলে গেছেন|Forgot password/i,
    });
    this.backButton = page.getByRole('button', { name: /পেছনে|Back/i });
    this.loginHeading = page.getByRole('heading', {
      name: /কাস্টমার লগইন|Customer Login/i,
    });
  }

  async open() {
    await this.navigate(config.authURL);
    await this.page.waitForLoadState('networkidle');
    await this.waitForVisible(this.identifierInput);
    await this.waitForVisible(this.createAccountButton);
  }

  async enterIdentifier(identifier) {
    await this.fill(this.identifierInput, identifier);
  }

  async enterPassword(password) {
    await this.fill(this.passwordInput, password);
  }

  async clickSignIn() {
    await this.click(this.signInButton);
  }

  async clickCreateAccount() {
    await this.createAccountButton.scrollIntoViewIfNeeded();
    await this.createAccountButton.click();
  }

  async clickForgotPassword() {
    await this.click(this.forgotPasswordButton);
  }

  async login(identifier, password) {
    await this.enterIdentifier(identifier);
    await this.enterPassword(password);
    await this.clickSignIn();
  }

  async isLoginFormVisible() {
    return this.isVisible(this.identifierInput);
  }
}

module.exports = { LoginPage };
