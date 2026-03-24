// File upload tests: happy path (.txt, .pdf, .png), filename display, and no-file validation.

const { test, expect } = require('@playwright/test');
const path = require('path');

const { FileUploadPage } = require('../../pages/FileUploadPage');

const FIXTURES_DIR  = path.resolve(__dirname, '../../fixtures');
const TXT_FILE_PATH = path.join(FIXTURES_DIR, 'sample-upload.txt');
const PDF_FILE_PATH = path.join(FIXTURES_DIR, 'sample-upload.pdf');
const PNG_FILE_PATH = path.join(FIXTURES_DIR, 'sample-upload.png');

test.describe('File Upload', () => {

  test('should display the file input on page load', async ({ page }) => {
    const uploadPage = new FileUploadPage(page);
    await uploadPage.goto();

    await expect(uploadPage.fileInput).toBeVisible();
    await expect(uploadPage.submitButton).toBeVisible();
  });

  test('happy path – should upload a .txt file successfully', async ({ page }) => {
    const uploadPage = new FileUploadPage(page);
    await uploadPage.goto();
    await uploadPage.uploadFile(TXT_FILE_PATH);
    expect(await uploadPage.isUploadSuccessful()).toBe(true);
  });

  test('should upload a .pdf file successfully', async ({ page }) => {
    const uploadPage = new FileUploadPage(page);
    await uploadPage.goto();
    await uploadPage.uploadFile(PDF_FILE_PATH);
    expect(await uploadPage.isUploadSuccessful()).toBe(true);
  });

  test('should upload a .png image file successfully', async ({ page }) => {
    const uploadPage = new FileUploadPage(page);
    await uploadPage.goto();
    await uploadPage.uploadFile(PNG_FILE_PATH);
    expect(await uploadPage.isUploadSuccessful()).toBe(true);
  });

  test('should show the uploaded filename after a successful upload', async ({ page }) => {
    const uploadPage = new FileUploadPage(page);
    await uploadPage.goto();
    await uploadPage.setFile(TXT_FILE_PATH);
    const inputValue = await uploadPage.fileInput.inputValue();
    expect(inputValue).toContain('sample-upload.txt');
  });

  test('submit without selecting a file – form should not upload', async ({ page }) => {
    const uploadPage = new FileUploadPage(page);
    await uploadPage.goto();
    await uploadPage.submit();
    // Page should remain on the upload form (no navigation away)
    await expect(uploadPage.fileInput).toBeVisible();
  });

});
