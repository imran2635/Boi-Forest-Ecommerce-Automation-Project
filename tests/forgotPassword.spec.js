const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { ForgotPasswordPage } = require('../pages/ForgotPasswordPage');
const { CredentialStore } = require('../utils/helpers');
const config = require('../config/config');

test.describe('Forgot Password Flow', () => {
  test('Positive: request password reset with registered email', async ({
    page,
  }) => {
    test.setTimeout(60000);

    const credentials = CredentialStore.load(config.credentialsPath);
    const loginPage = new LoginPage(page);
    const forgotPasswordPage = new ForgotPasswordPage(page);

    await loginPage.open();
    await loginPage.clickForgotPassword();
    await forgotPasswordPage.waitForForm();
    await expect(forgotPasswordPage.emailInput).toBeVisible();

    await forgotPasswordPage.submitResetRequest(credentials.email);

    await expect(forgotPasswordPage.successMessage.or(forgotPasswordPage.heading))
      .toBeVisible({ timeout: 20000 });
  });

  test('Negative: submit empty email on forgot password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const forgotPasswordPage = new ForgotPasswordPage(page);

    await loginPage.open();
    await loginPage.clickForgotPassword();
    await forgotPasswordPage.waitForForm();
    await forgotPasswordPage.clickSubmit();

    await expect(page).toHaveURL(/\/auth/);
    await expect(forgotPasswordPage.emailInput).toBeVisible();
  });

  test('Negative: submit invalid email format', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const forgotPasswordPage = new ForgotPasswordPage(page);

    await loginPage.open();
    await loginPage.clickForgotPassword();
    await forgotPasswordPage.waitForForm();
    await forgotPasswordPage.submitResetRequest('invalid-email');

    await expect(page).toHaveURL(/\/auth/);
    await expect(forgotPasswordPage.emailInput).toBeVisible();
  });
});
