const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { HomePage } = require('../pages/HomePage');
const { CheckoutPage } = require('../pages/CheckoutPage');
const config = require('../config/config');

async function loginAsBuyUser(page) {
  const loginPage = new LoginPage(page);
  const { email, password } = config.buyFlowUser;

  await loginPage.open();
  await loginPage.login(email, password);
  await page.waitForURL((url) => !url.pathname.includes('/auth'), {
    timeout: 30000,
  });
}

test.describe('Product Buy Flow', () => {
  test('Positive: login and add product from product card', async ({ page }) => {
    test.setTimeout(90000);

    const homePage = new HomePage(page);

    await loginAsBuyUser(page);
    await homePage.open();
    await homePage.addFirstProductToCart();

    await expect(homePage.cartButton).toBeVisible();
    await expect
      .poll(async () => {
        const text = await homePage.cartButton.innerText();
        return text.replace(/\D/g, '');
      }, { timeout: 15000 })
      .not.toBe('');
  });

  test('Positive: login and buy product from product card', async ({ page }) => {
    test.setTimeout(90000);

    const homePage = new HomePage(page);
    const checkoutPage = new CheckoutPage(page);

    await loginAsBuyUser(page);
    await homePage.open();
    await homePage.buyFirstProduct();

    await checkoutPage.waitForPage();
    await expect(checkoutPage.heading).toBeVisible();
    await expect(page).toHaveURL(/\/checkout/);
  });
});
