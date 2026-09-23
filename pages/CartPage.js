const { BasePage } = require('./BasePage');

class CartPage extends BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    super(page);
    this.cartDrawer = page.locator('[class*="cart"], [role="dialog"], aside').filter({
      hasText: /Total|সাবটোটাল|Subtotal|Secure Checkout|নেট|কার্ট/i,
    }).first();
    this.secureCheckoutButton = page.getByRole('button', {
      name: /Secure Checkout|নিরাপদ চেকআউট|চেকআউট/i,
    });
    this.cartItemCount = page.getByText(/Total:\s*\d+\s*item|মোট|আইটেম/i);
    this.subtotal = page.getByText(/Subtotal|সাবটোটাল/i);
  }

  async waitForCartDrawer() {
    await this.waitForVisible(this.secureCheckoutButton);
  }

  async isCheckoutVisible() {
    return this.isVisible(this.secureCheckoutButton);
  }

  async clickSecureCheckout() {
    await this.click(this.secureCheckoutButton);
  }
}

module.exports = { CartPage };
