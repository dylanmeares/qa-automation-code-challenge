/** Page object for the shipping/checkout form on /auth_ecommerce. */
class CheckoutPage {
  constructor(page) {
    this.page = page;

    this.phoneInput = page.locator('input[name="phone"]');
    this.streetInput = page.locator('input[name="street"]');
    this.cityInput = page.locator('input[name="city"]');
    this.countrySelect = page.locator('select').first();
    this.submitOrderBtn = page.locator('button', { hasText: 'Submit Order' });
    this.orderConfirmation = page.locator('#message');
  }

  /**
   * @param {{ phone: string, street: string, city: string, country: string }} details
   */
  async fillShippingDetails({ phone, street, city, country }) {
    await this.phoneInput.fill(phone);
    await this.streetInput.fill(street);
    await this.cityInput.fill(city);
    await this.countrySelect.selectOption({ label: country });
  }

  async submitOrder() {
    await this.submitOrderBtn.click();
  }

  /** @param {{ phone: string, street: string, city: string, country: string }} details */
  async fillAndSubmitOrder(details) {
    await this.fillShippingDetails(details);
    await this.submitOrder();
  }

  /** Returns true when the order confirmation message appears. */
  async isOrderConfirmed() {
    try {
      await this.orderConfirmation.waitFor({ state: 'visible', timeout: 8_000 });
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = { CheckoutPage };
