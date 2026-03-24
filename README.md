# QA Automation Challenge – Playwright (JavaScript)

End-to-end automation suite for the [QA Practice](https://qa-practice.netlify.app) demo site, built with **Playwright** using the **Page Object Model (POM)** pattern.

---

## Prerequisites

| Tool | Minimum Version |
|------|----------------|
| [Node.js](https://nodejs.org/) | 18.x or higher |
| npm | 9.x or higher |

---

## Setup

### 1. Clone the repository

```bash
git clone https://github.com/dylanmeares/playwright-qa-challenge.git
cd playwright-qa-challenge
```

### 2. Install dependencies

```bash
npm install
```

### 3. Install Playwright browsers

```bash
npx playwright install
```

> This downloads Chromium, Firefox, and WebKit. To install only one browser, e.g.:
> ```bash
> npx playwright install chromium
> ```

---

## Running Tests

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests (headless, all browsers) |
| `npm run test:headed` | Run all tests with the browser visible |
| `npm run test:slow-mo` | Run all tests headed with 500ms delay between actions |
| `SLOW_MO=1000 npm run test:slow-mo` | Run with a custom delay (ms) between actions |
| `npm run test:ui` | Open Playwright's interactive UI mode |
| `npm run test:ecommerce` | Run e-commerce tests only |
| `npm run test:file-upload` | Run file upload tests only |
| `npm run test:report` | Open the last HTML report |

### Run tests against a single browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run a single spec file

```bash
npx playwright test tests/ecommerce/auth-order-flow.spec.js
```

### Run tests matching a title

```bash
npx playwright test --grep "happy path"
```

---

## Project Structure

```
playwright-qa-challenge/
│
├── fixtures/                    # Shared test data and sample files
│   ├── testData.js              # Credentials, product names, shipping details
│   ├── sample-upload.txt        # Sample text file for upload tests
│   ├── sample-upload.pdf        # Sample PDF for upload tests
│   └── sample-upload.png        # Sample image for upload tests
│
├── pages/                       # Page Object Models
│   ├── LoginPage.js             # Login form interactions & assertions
│   ├── ShopPage.js              # Product listing & shopping cart
│   ├── CheckoutPage.js          # Shipping form & order submission
│   └── FileUploadPage.js        # File upload interactions & assertions
│
├── tests/
│   ├── ecommerce/
│   │   └── auth-order-flow.spec.js   # All e-commerce scenarios
│   └── file-upload/
│       └── file-upload.spec.js        # All file upload scenarios
│
├── playwright.config.js         # Global Playwright configuration
├── package.json
└── README.md
```

---

## Test Coverage

### E-Commerce (`tests/ecommerce/auth-order-flow.spec.js`)

#### Authentication
| # | Scenario | Type |
|---|----------|------|
| 1 | Login form is visible on page load | Smoke |
| 2 | Valid credentials → user is logged in | Happy path |
| 3 | Wrong password → user stays on login form | Edge case |
| 4 | Wrong email → user stays on login form | Edge case |
| 5 | Empty credentials → form does not submit | Edge case |
| 6 | Invalid email format → form does not submit | Edge case |

#### Shopping Cart
| # | Scenario | Type |
|---|----------|------|
| 7 | Add a single product to the cart | Happy path |
| 8 | Add multiple products to the cart | Happy path |
| 9 | Cart total is > $0 after adding a product | Assertion |
| 10 | All five products have an ADD TO CART button | Smoke |

#### Order Submission
| # | Scenario | Type |
|---|----------|------|
| 11 | Add item → fill shipping → submit order → confirmation shown | Happy path |
| 12 | Multiple products → checkout → confirmation shown | Happy path |

#### Logout
| # | Scenario | Type |
|---|----------|------|
| 13 | Logout → login form reappears, logout button hidden | Happy path |

#### Full E2E
| # | Scenario | Type |
|---|----------|------|
| 14 | Login → add to cart → submit order → logout | Full flow |

---

### File Upload (`tests/file-upload/file-upload.spec.js`)

| # | Scenario | Type |
|---|----------|------|
| 1 | File input and Submit button visible on load | Smoke |
| 2 | Upload a `.txt` file → success message shown | Happy path |
| 3 | Upload a `.pdf` file → success message shown | Happy path |
| 4 | Upload a `.png` image → success message shown | Happy path |
| 5 | Filename reflected in the file input after selection | Assertion |
| 6 | Submit with no file selected → stays on upload page | Edge case |

---

## Framework & Configuration

- **Framework:** [Playwright](https://playwright.dev/) v1.50+
- **Language:** JavaScript (CommonJS)
- **Pattern:** Page Object Model (POM)
- **Browsers:** Chromium, Firefox, WebKit (configured in `playwright.config.js`)
- **Parallelism:** Enabled by default; 2 workers on CI
- **Retries:** 1 retry on CI, 0 locally
- **Artifacts on failure:** Screenshots + traces saved automatically

### Key config options (`playwright.config.js`)

```js
baseURL:       'https://qa-practice.netlify.app'
timeout:       30_000ms  (per test)
actionTimeout: 10_000ms  (per action)
expect.timeout: 8_000ms  (per assertion)
```

---

## CI / GitHub Actions (optional)

Add `.github/workflows/playwright.yml` to run on every push:

```yaml
name: Playwright Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm test
      - uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: playwright-report/
```

---

## Automation Best Practices Applied

- **Page Object Model** – UI interactions are encapsulated in page classes, keeping specs clean and maintainable.
- **Centralised test data** – Credentials, product names, and form values live in `fixtures/testData.js`.
- **Descriptive test names** – Each test clearly states what it does and what outcome is expected.
- **Explicit assertions** – Every test verifies observable outcomes (visibility, text, state).
- **Edge case coverage** – Invalid login attempts, empty fields, and no-file submission are all covered.
- **`beforeEach` hooks** – Shared setup (e.g., logging in) is extracted to avoid repetition.
- **Parameterised tests** – Invalid login scenarios are driven by a data array for easy extension.
- **No hard-coded waits** – Only Playwright's built-in auto-waiting and `waitFor` are used.
- **Robust locators** – Text-based and role-based locators are preferred over brittle CSS class names.
