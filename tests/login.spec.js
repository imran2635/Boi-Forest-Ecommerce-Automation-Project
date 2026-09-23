const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { CredentialStore } = require('../utils/helpers');
const config = require('../config/config');

test.describe('Login Flow', () => {
  test('Positive: login with saved credentials from account create', async ({
    page,
    context,
  }) => {
    test.setTimeout(60000);

    const credentials = CredentialStore.load(config.credentialsPath);
    await context.clearCookies();

    const loginPage = new LoginPage(page);
    await loginPage.open();
    await expect(loginPage.identifierInput).toBeVisible();

    await loginPage.login(credentials.email, credentials.password);

    await expect
      .poll(async () => page.url(), { timeout: 30000 })
      .not.toContain('/auth');
  });

  test('Negative: login with empty fields', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.clickSignIn();

    await expect(page).toHaveURL(/\/auth/);
    await expect(loginPage.identifierInput).toBeVisible();
  });

  test('Negative: login with wrong password', async ({ page }) => {
    const credentials = CredentialStore.load(config.credentialsPath);
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await loginPage.login(credentials.email, 'WrongPass@12345');

    await expect(page).toHaveURL(/\/auth/);
    await expect(loginPage.identifierInput).toBeVisible();
  });
});
