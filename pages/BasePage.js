class BasePage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
  }

  async navigate(url) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
  }

  async click(locator) {
    await locator.waitFor({ state: 'visible' });
    await locator.click();
  }

  async fill(locator, value) {
    await locator.waitFor({ state: 'visible' });
    await locator.fill(value);
  }

  async getText(locator) {
    await locator.waitFor({ state: 'visible' });
    return (await locator.textContent())?.trim() ?? '';
  }

  async isVisible(locator) {
    return locator.isVisible();
  }

  async waitForVisible(locator) {
    await locator.waitFor({ state: 'visible' });
  }

  async waitForHidden(locator) {
    await locator.waitFor({ state: 'hidden' });
  }
}

module.exports = { BasePage };
