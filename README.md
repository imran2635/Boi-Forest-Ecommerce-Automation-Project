# Boi Forest — Ecommerce Automation Project

Playwright (JavaScript) end-to-end automation for [boiforest.com](https://boiforest.com/).

Built with **Page Object Model (POM)**, reusable utilities, and **temp mail** for registration so credentials can be reused in later tests.

---

## Test Execution Summary

| Metric | Count |
| --- | ---: |
| **Total Test Cases** | **11** |
| **Passed** | **11** |
| **Failed** | **0** |
| **Skipped** | **0** |
| **Pass Rate** | **100%** |
| **Browser** | Chromium |
| **Last Verified** | 23 Sep 2026 |

### Status Badge

![Passed](https://img.shields.io/badge/tests-11%20passed-brightgreen)
![Failed](https://img.shields.io/badge/failed-0-lightgrey)
![Framework](https://img.shields.io/badge/Playwright-JavaScript-45ba4b)
![Pattern](https://img.shields.io/badge/Pattern-POM-blue)

> When you run tests in the terminal, the list reporter prints a clear summary: `X passed` / `Y failed`.

---

## Covered Flows

| # | Flow | Spec File | Positive | Negative | Total | Status |
| ---: | --- | --- | ---: | ---: | ---: | :---: |
| 1 | **Account Create** | `tests/accountCreate.spec.js` | 1 | 2 | 3 | ✅ Pass |
| 2 | **Login** | `tests/login.spec.js` | 1 | 2 | 3 | ✅ Pass |
| 3 | **Forgot Password** | `tests/forgotPassword.spec.js` | 1 | 2 | 3 | ✅ Pass |
| 4 | **Product Buy** | `tests/productBuy.spec.js` | 2 | 0 | 2 | ✅ Pass |

---

## Test Case Details

### 1. Account Create Flow

| ID | Type | Test Case | Result |
| --- | --- | --- | :---: |
| AC-01 | Positive | Create account using **temp mail**, verify success dialog, save credentials | ✅ Pass |
| AC-02 | Negative | Submit empty registration form — remain on auth / form visible | ✅ Pass |
| AC-03 | Negative | Submit invalid email format — remain on auth / form visible | ✅ Pass |

**Flow steps (Positive):**
1. Open `https://boiforest.com/auth`
2. Click **Create account**
3. Generate a disposable email via [mail.tm](https://api.mail.tm)
4. Fill First Name, Last Name, Email, Phone, Password
5. Click **Complete Registration**
6. Assert the success dialog is shown
7. Save credentials to `test-data/credentials.json`

---

### 2. Login Flow

| ID | Type | Test Case | Result |
| --- | --- | --- | :---: |
| LG-01 | Positive | Login with saved credentials from Account Create | ✅ Pass |
| LG-02 | Negative | Login with empty fields — remain on auth | ✅ Pass |
| LG-03 | Negative | Login with wrong password — remain on auth | ✅ Pass |

**Flow steps (Positive):**
1. Load credentials from `test-data/credentials.json`
2. Open the auth page (cookies cleared)
3. Enter email + password → click **Sign In**
4. Assert the URL leaves `/auth`

---

### 3. Forgot Password Flow

| ID | Type | Test Case | Result |
| --- | --- | --- | :---: |
| FP-01 | Positive | Request reset using a registered email | ✅ Pass |
| FP-02 | Negative | Submit empty email — remain on form | ✅ Pass |
| FP-03 | Negative | Submit invalid email format — remain on form | ✅ Pass |

**Flow steps (Positive):**
1. Open the auth page
2. Click **Forgot password?**
3. Enter the registered email
4. Click **Send reset instructions**
5. Assert success / confirmation state

---

### 4. Product Buy Flow

| ID | Type | Test Case | Result |
| --- | --- | --- | :---: |
| PB-01 | Positive | Login → product card **Add** → cart badge updates | ✅ Pass |
| PB-02 | Positive | Login → product card **Buy** → checkout page | ✅ Pass |

**Login credentials (buy flow):**
- Email: `imranoffice661@gmail.com`
- Password: `12345678`  
  (stored in `config/config.js` → `buyFlowUser`)

**Flow steps (PB-01 — Add):**
1. Login at `/auth`
2. Open the home page
3. Click **Add** on the first product card
4. Assert the cart badge shows an item count

**Flow steps (PB-02 — Buy):**
1. Login at `/auth`
2. Open the home page
3. Click **Buy** on the first product card
4. Assert navigation to `/checkout` and checkout heading is visible

---

## Tech Stack

| Item | Detail |
| --- | --- |
| Language | JavaScript (CommonJS) |
| Framework | Playwright Test |
| Design | Page Object Model + BasePage inheritance |
| Temp Mail | mail.tm API |
| Target Site | [boiforest.com](https://boiforest.com/) |

---

## Project Structure

```text
Boi Forest-Ecommerce-Automation-Project/
├── config/
│   └── config.js                 # Base URL, buyFlowUser, paths
├── pages/
│   ├── BasePage.js
│   ├── HomePage.js               # Product card Add / Buy
│   ├── LoginPage.js
│   ├── RegisterPage.js
│   ├── ForgotPasswordPage.js
│   ├── CartPage.js
│   └── CheckoutPage.js
├── tests/
│   ├── accountCreate.spec.js
│   ├── login.spec.js
│   ├── forgotPassword.spec.js
│   └── productBuy.spec.js
├── utils/
│   └── helpers.js
├── test-data/
│   └── credentials.json          # gitignored (from Account Create)
├── playwright.config.js
├── package.json
└── README.md
```

---

## Prerequisites

- Node.js 18+
- npm

---

## How to Run (Commands)

### 1. Setup (one-time)

```bash
npm install
npx playwright install chromium
```

### 2. Run all tests

```bash
npm test
```

Example terminal output (pass):

```text
  ok 1  ... Account Create ...
  ok 2  ...
  ...
  11 passed (Xm)
```

Example terminal output (fail):

```text
  x  3  ... test name ...
  1 failed
  10 passed
```

### 3. Run by flow

| Flow | Command |
| --- | --- |
| **All tests** | `npm test` |
| **Account Create** | `npm run test:create` |
| **Login** | `npm run test:login` |
| **Forgot Password** | `npm run test:forgot` |
| **Product Buy** | `npm run test:buy` |
| **Headed mode** | `npm run test:headed` |
| **HTML report** | `npm run report` |

```bash
# Account Create
npm run test:create

# Login
npm run test:login

# Forgot Password
npm run test:forgot

# Product Buy (login + add / buy)
npm run test:buy

# Run all tests with browser visible
npm run test:headed

# Open HTML report
npm run report
```

### 4. Recommended run order

1. Run `npm run test:create` first so `test-data/credentials.json` is created
2. Then run `npm run test:login` or `npm run test:forgot`
3. Product Buy uses separate credentials — you can run `npm run test:buy` directly

---

## Architecture Notes

- Locators live **only** inside Page classes
- Shared actions (`click`, `fill`, `waitForVisible`) live in `BasePage`
- No hardcoded sleeps — Playwright auto-waiting only
- `--reporter=list` shows clear pass / fail results in the terminal
- Temp mail credentials are reused for Login / Forgot Password
- Product Buy uses the fixed user from `config.buyFlowUser`

---

## Application Under Test

| Page | URL |
| --- | --- |
| Home | https://boiforest.com/ |
| Auth | https://boiforest.com/auth |
| Checkout | https://boiforest.com/checkout |

---

## Maintainer Checklist

- [x] Account Create flow
- [x] Login flow
- [x] Forgot Password flow
- [x] Product Buy flow (Add + Buy)
- [x] Temp mail integration
- [x] Positive / Negative auth cases
- [x] POM + reusable helpers
- [x] Terminal list reporter (pass/fail)
- [x] Run commands in documentation

---

*Generated for the Boi Forest Ecommerce Automation Project — Playwright JS.*
