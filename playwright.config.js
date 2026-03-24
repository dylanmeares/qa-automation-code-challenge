// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  // Directory where tests are located
  testDir: './tests',

  // Run tests in parallel
  fullyParallel: true,

  // Fail the build on CI if tests are accidentally skipped
  forbidOnly: !!process.env.CI,

  // Retry failed tests once on CI
  retries: process.env.CI ? 1 : 0,

  // Number of workers (parallel execution)
  workers: process.env.CI ? 2 : undefined,

  // Reporter: HTML report + console output
  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    // Base URL for the application under test
    baseURL: 'https://qa-practice.netlify.app',

    // Capture screenshot only on failure
    screenshot: 'only-on-failure',

    // Record video only on retry
    video: 'on-first-retry',

    // Record trace on retry for debugging
    trace: 'on-first-retry',

    // Global timeout for each action
    actionTimeout: 10_000,

    // Headless by default; set to false for headed mode
    headless: true,

    // Slow down actions when SLOW_MO env var is set
    launchOptions: {
      slowMo: process.env.SLOW_MO ? parseInt(process.env.SLOW_MO) : 0,
    },
  },

  // Global test timeout
  timeout: 30_000,

  // Expect assertion timeout
  expect: {
    timeout: 8_000,
  },

  // Define browser projects to run
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
