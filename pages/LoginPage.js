/** Page object for /auth_ecommerce — login and logout. */
class LoginPage {
  constructor(page) {
    this.page = page;

    this.emailInput = page.locator('input[type="email"]');
    this.passwordInput = page.locator('input[type="password"]');
    this.submitButton = page.locator('button[type="submit"]').first();
    this.logoutButton = page.locator('#logout');
    this.errorMessage = page.locator('.alert-danger');
  }

  async goto() {
    await this.page.goto('/auth_ecommerce');
  }

  /**
   * @param {string} email
   * @param {string} password
   */
  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async logout() {
    await this.logoutButton.click();
  }
}

module.exports = { LoginPage };
