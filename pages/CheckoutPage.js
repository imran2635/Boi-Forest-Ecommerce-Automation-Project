const { BasePage } = require('./BasePage');

class CheckoutPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.heading = page.getByRole('heading', {
      name: /নিরাপদ চেকআউট|Secure Checkout|Checkout/i,
    });
    this.cartItemsHeading = page.getByRole('heading', {
      name: /কার্ট আইটেম|Cart Item/i,
    });
    this.continueButton = page.getByRole('button', {
      name: /ঠিকানায় এগিয়ে যান|Continue|Address/i,
    });
    this.cartCountText = page.getByText(/আপনার কার্টে|in your cart|item/i);
  }

  async waitForPage() {
    await this.page.waitForURL(/\/checkout/, { timeout: 30000 });
    await this.waitForVisible(this.heading);
  }

  async isLoaded() {
    return this.isVisible(this.heading);
  }
}

module.exports = { CheckoutPage };
