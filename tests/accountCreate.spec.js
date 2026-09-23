const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../pages/LoginPage');
const { RegisterPage } = require('../pages/RegisterPage');
const {
  TempMailHelper,
  CredentialStore,
  TestDataHelper,
} = require('../utils/helpers');
const config = require('../config/config');

test.describe('Account Create Flow', () => {
  test('Positive: create account using temp mail and save credentials', async ({
    page,
  }) => {
    test.setTimeout(90000);

    const loginPage = new LoginPage(page);
    const registerPage = new RegisterPage(page);
    const tempMail = new TempMailHelper();

    const inbox = await tempMail.createInbox();
    const user = {
      firstName: TestDataHelper.randomName('First'),
      lastName: TestDataHelper.randomName('Last'),
      email: inbox.email,
      phone: TestDataHelper.randomBdPhone(),
      password: TestDataHelper.strongPassword(),
    };

    await loginPage.open();
    await loginPage.clickCreateAccount();
    await registerPage.waitForForm();
    await expect(registerPage.firstNameInput).toBeVisible();

    await registerPage.register(user);
    await registerPage.waitForSuccess();
    await expect(registerPage.successMessage).toBeVisible();

    CredentialStore.save(config.credentialsPath, {
      email: user.email,
      phone: user.phone,
      password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: new Date().toISOString(),
    });
  });

  test('Negative: submit empty registration form', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const registerPage = new RegisterPage(page);

    await loginPage.open();
    await loginPage.clickCreateAccount();
    await registerPage.waitForForm();
    await registerPage.clickSubmit();

    await expect(page).toHaveURL(/\/auth/);
    await expect(registerPage.firstNameInput).toBeVisible();
  });

  test('Negative: invalid email format', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const registerPage = new RegisterPage(page);

    await loginPage.open();
    await loginPage.clickCreateAccount();
    await registerPage.waitForForm();

    await registerPage.register({
      firstName: 'Test',
      lastName: 'User',
      email: 'invalid-email',
      phone: TestDataHelper.randomBdPhone(),
      password: TestDataHelper.strongPassword(),
    });

    await expect(page).toHaveURL(/\/auth/);
    await expect(registerPage.emailInput).toBeVisible();
  });
});
