/** Page object for the file upload page (/file-upload). */
class FileUploadPage {
  constructor(page) {
    this.page = page;

    this.fileInput = page.locator('input[type="file"]');
    this.submitButton = page.locator('button[type="submit"]');
    this.successMessage = page.locator('#file_upload_response');
  }

  async goto() {
    await this.page.goto('/file-upload');
  }

  /** @param {string} filePath */
  async setFile(filePath) {
    await this.fileInput.setInputFiles(filePath);
  }

  async submit() {
    await this.submitButton.click();
  }

  /** @param {string} filePath */
  async uploadFile(filePath) {
    await this.setFile(filePath);
    await this.submit();
  }

  /** Waits for the upload response element to appear; returns true on success. */
  async isUploadSuccessful() {
    try {
      await this.successMessage.waitFor({ state: 'visible', timeout: 8_000 });
      return true;
    } catch {
      return false;
    }
  }
}

module.exports = { FileUploadPage };
