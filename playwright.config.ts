import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright config.
 *
 * Choices worth noting:
 *  - fullyParallel: every test file runs in parallel, every test inside runs in parallel.
 *  - forbidOnly on CI: a stray `test.only` should break the build, not silently shrink it.
 *  - retries on CI only: local runs should expose flakiness immediately.
 *  - trace on first retry: cheap signal; full traces only when something actually failed.
 *  - screenshot/video on failure: gives a reviewer something to look at in the CI artifact.
 *  - baseURL: tests use relative paths so the target site can be swapped via PLAYWRIGHT_BASE_URL.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['github']] : 'html',

  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'https://playwright.dev',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

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
