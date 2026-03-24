/** Page object for the product listing and cart on /auth_ecommerce. */
class ShopPage {
  constructor(page) {
    this.page = page;

    this.addToCartButtons = page.locator('button', { hasText: 'ADD TO CART' }); // one per product card
    this.cartTotal = page.locator('.cart-total');
    this.proceedToCheckout = page.locator('button', { hasText: 'PROCEED TO CHECKOUT' });
    this.cartItems = page.locator('.cart-row');
  }

  /** @param {number} index - 0-based */
  async addToCartByIndex(index) {
    await this.addToCartButtons.nth(index).click();
  }

  /** @param {string} productName */
  async addToCartByName(productName) {
    const productCard = this.page.locator('.shop-item').filter({ hasText: productName }).first();
    await productCard.locator('button', { hasText: 'ADD TO CART' }).click();
  }

  /** @param {string[]} productNames */
  async addMultipleProductsByName(productNames) {
    for (const name of productNames) {
      await this.addToCartByName(name);
    }
  }

  async proceedToCheckoutForm() {
    await this.proceedToCheckout.click();
  }

  /** Returns true if the cart total is greater than $0. */
  async cartHasItems() {
    const totalText = await this.cartTotal.textContent();
    return totalText !== null && !totalText.includes('$0');
  }
}

module.exports = { ShopPage };
