import { test, expect } from '@playwright/test';

/**
 * What this spec demonstrates:
 *  - Data-driven tests: one test body, many cases
 *  - `test.describe.parallel` so cases inside the suite run concurrently in the same file
 *  - Soft assertions with `expect.soft` so a single broken page doesn't abort the rest
 *  - Network response assertion (`response.status()`) alongside DOM assertion
 *
 * Each entry is a public docs page on playwright.dev. The test verifies the page
 * returns 200 and renders the expected H1. This is the kind of cheap, broad smoke
 * sweep that's useful as a CI quality gate.
 */

const pages = [
  { path: '/docs/intro', heading: 'Installation' },
  { path: '/docs/writing-tests', heading: 'Writing tests' },
  { path: '/docs/running-tests', heading: 'Running and debugging tests' },
  { path: '/docs/locators', heading: 'Locators' },
];

test.describe.parallel('docs pages — smoke sweep', () => {
  for (const { path, heading } of pages) {
    test(`${path} loads and renders "${heading}"`, async ({ page }) => {
      const response = await page.goto(path);
      expect.soft(response?.status(), `${path} HTTP status`).toBe(200);

      await expect.soft(
        page.getByRole('heading', { name: heading, level: 1 }),
      ).toBeVisible();
    });
  }
});
