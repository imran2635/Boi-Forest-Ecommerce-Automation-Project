const { BasePage } = require('./BasePage');

class RegisterPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.firstNameInput = page.locator('#firstName');
    this.lastNameInput = page.locator('#lastName');
    this.emailInput = page.locator('#email');
    this.phoneInput = page.locator('#phoneNo');
    this.passwordInput = page.locator('#password');
    this.submitButton = page.getByRole('button', {
      name: /রেজিস্ট্রেশন সম্পন্ন করুন|Complete Registration/i,
    });
    this.backButton = page.getByRole('button', { name: /পেছনে|Back/i });
    this.signInLink = page.getByRole('button', { name: /সাইন ইন|Sign In/i });
    this.registerHeading = page.getByRole('heading', {
      name: /অ্যাকাউন্ট তৈরি করুন|Create Account/i,
    });
    this.successDialog = page.getByRole('dialog');
    this.successMessage = page.getByText(/রেজিস্ট্রেশন সফলভাবে সম্পন্ন|Registration completed/i);
    this.startShoppingButton = page.getByRole('button', {
      name: /কেনাকাটা শুরু করুন|Start shopping/i,
    });
    this.dashboardButton = page.getByRole('button', {
      name: /আমার ড্যাশবোর্ড|My Dashboard/i,
    });
  }

  async waitForForm() {
    await this.waitForVisible(this.firstNameInput);
  }

  async enterFirstName(firstName) {
    await this.fill(this.firstNameInput, firstName);
  }

  async enterLastName(lastName) {
    await this.fill(this.lastNameInput, lastName);
  }

  async enterEmail(email) {
    await this.fill(this.emailInput, email);
  }

  async enterPhone(phone) {
    await this.fill(this.phoneInput, phone);
  }

  async enterPassword(password) {
    await this.fill(this.passwordInput, password);
  }

  async clickSubmit() {
    await this.click(this.submitButton);
  }

  async register({ firstName, lastName, email, phone, password }) {
    await this.enterFirstName(firstName);
    await this.enterLastName(lastName);
    await this.enterEmail(email);
    await this.enterPhone(phone);
    await this.enterPassword(password);
    await this.clickSubmit();
  }

  async isRegisterFormVisible() {
    return this.isVisible(this.firstNameInput);
  }

  async waitForSuccess() {
    await this.waitForVisible(this.successDialog);
    await this.waitForVisible(this.successMessage);
  }

  async clickStartShopping() {
    await this.click(this.startShoppingButton);
  }
}

module.exports = { RegisterPage };
