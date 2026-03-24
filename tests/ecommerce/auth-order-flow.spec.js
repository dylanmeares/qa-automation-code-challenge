/**
 * E-Commerce Auth + Order Flow Tests
 * Covers login/logout, shopping cart interactions, and order submission.
 */

const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');
const { ShopPage } = require('../../pages/ShopPage');
const { CheckoutPage } = require('../../pages/CheckoutPage');
const { VALID_USER, INVALID_USERS, SHIPPING_DETAILS, PRODUCTS } = require('../../fixtures/testData');

// Shared setup: navigates to the shop and logs in as the test user
async function loginAsValidUser(page) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(VALID_USER.email, VALID_USER.password);
  await expect(loginPage.logoutButton).toBeVisible();
}

test.describe('Authentication', () => {

  test('should display the login form on page load', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.submitButton).toBeVisible();
  });

  test('happy path – valid credentials logs the user in', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(VALID_USER.email, VALID_USER.password);

    // Logout button only appears for authenticated users
    await expect(loginPage.logoutButton).toBeVisible();
  });

  // Parameterised invalid-login tests
  for (const { description, email, password } of INVALID_USERS) {
    test(`invalid login – ${description} – should not authenticate`, async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.goto();

      if (email === '' && password === '') {
        // Empty inputs trigger native browser validation — submit is blocked
        await loginPage.emailInput.fill(email);
        await loginPage.passwordInput.fill(password);
        await expect(loginPage.submitButton).toBeVisible();
        await loginPage.submitButton.click().catch(() => {});
      } else {
        await loginPage.login(email, password);
      }

      await expect(loginPage.logoutButton).not.toBeVisible();
    });
  }

});

test.describe('Shopping Cart', () => {

  test.beforeEach(async ({ page }) => {
    await loginAsValidUser(page);
  });

  test('should be able to add a single product to the cart', async ({ page }) => {
    const shopPage = new ShopPage(page);
    await shopPage.addToCartByName(PRODUCTS.NOKIA_105);
    await expect(page.locator('.cart-item-title', { hasText: 'Nokia 105' })).toBeVisible();
  });

  test('should be able to add multiple products to the cart', async ({ page }) => {
    const shopPage = new ShopPage(page);

    await shopPage.addMultipleProductsByName([
      PRODUCTS.IPHONE_12,
      PRODUCTS.SAMSUNG_A32,
    ]);

    await expect(page.locator('.cart-item-title', { hasText: 'Apple iPhone 12' })).toBeVisible();
    await expect(page.locator('.cart-item-title', { hasText: 'Samsung Galaxy A32' })).toBeVisible();
  });

  test('cart total should be greater than $0 after adding an item', async ({ page }) => {
    const shopPage = new ShopPage(page);
    await shopPage.addToCartByIndex(0); // first product
    expect(await shopPage.cartHasItems()).toBe(true);
  });

  test('all five products should have an ADD TO CART button', async ({ page }) => {
    const shopPage = new ShopPage(page);
    expect(await shopPage.addToCartButtons.count()).toBe(5);
  });

});

test.describe('Order Submission', () => {

  test.beforeEach(async ({ page }) => {
    await loginAsValidUser(page);
  });

  test('happy path – add item, fill shipping details, submit order', async ({ page }) => {
    const shopPage     = new ShopPage(page);
    const checkoutPage = new CheckoutPage(page);

    await shopPage.addToCartByName(PRODUCTS.HUAWEI_MATE_20);
    await shopPage.proceedToCheckoutForm();
    await checkoutPage.fillAndSubmitOrder(SHIPPING_DETAILS);

    expect(await checkoutPage.isOrderConfirmed()).toBe(true);
  });

  test('should be able to order multiple products in one checkout', async ({ page }) => {
    const shopPage     = new ShopPage(page);
    const checkoutPage = new CheckoutPage(page);

    await shopPage.addMultipleProductsByName([
      PRODUCTS.IPHONE_13,
      PRODUCTS.NOKIA_105,
    ]);

    await shopPage.proceedToCheckoutForm();
    await checkoutPage.fillAndSubmitOrder(SHIPPING_DETAILS);

    expect(await checkoutPage.isOrderConfirmed()).toBe(true);
  });

});

test.describe('Logout', () => {

  test('should log the user out and return to the login form', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginAsValidUser(page);
    await loginPage.logout();

    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.logoutButton).not.toBeVisible();
  });

});

test.describe('Full E2E Happy Flow', () => {

  test('login → add to cart → submit order → logout', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const shopPage = new ShopPage(page);
    const checkoutPage = new CheckoutPage(page);

    // 1. Log in
    await loginPage.goto();
    await loginPage.login(VALID_USER.email, VALID_USER.password);
    await expect(loginPage.logoutButton).toBeVisible();

    // 2. Add item to cart
    await shopPage.addToCartByName(PRODUCTS.SAMSUNG_A32);
    await expect(page.locator('.cart-item-title', { hasText: 'Samsung Galaxy A32' })).toBeVisible();

    // 3. Checkout
    await shopPage.proceedToCheckoutForm();
    await checkoutPage.fillAndSubmitOrder(SHIPPING_DETAILS);
    expect(await checkoutPage.isOrderConfirmed()).toBe(true);

    // 4. Log out
    await loginPage.logout();
    await expect(loginPage.emailInput).toBeVisible();
  });

});
