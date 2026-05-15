import { type Page, type Locator, expect } from '@playwright/test';

/**
 * Page Object for the Playwright docs site (playwright.dev).
 *
 * A POM is overkill for two tests, but it's the right shape once a suite grows.
 * The point here is to show how I'd structure it:
 *  - locators live as readonly getters, defined in the constructor
 *  - actions are verbs ("goto", "search", "openSidebarLink")
 *  - assertions stay in the spec, not the POM, so the spec reads as intent
 */
export class DocsPage {
  readonly page: Page;
  readonly heroHeading: Locator;
  readonly getStartedLink: Locator;
  readonly searchButton: Locator;
  readonly searchInput: Locator;
  readonly searchResults: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heroHeading = page.getByRole('heading', { name: /Playwright enables reliable/i });
    this.getStartedLink = page.getByRole('link', { name: 'Get started' }).first();
    this.searchButton = page.getByRole('button', { name: /search/i }).first();
    this.searchInput = page.getByPlaceholder('Search docs');
    this.searchResults = page.locator('.DocSearch-Hit');
  }

  async goto() {
    await this.page.goto('/');
    await expect(this.heroHeading).toBeVisible();
  }

  async openGetStarted() {
    await this.getStartedLink.click();
    await expect(this.page).toHaveURL(/\/docs\/intro/);
  }

  async search(term: string) {
    await this.searchButton.click();
    await this.searchInput.fill(term);
    // DocSearch debounces — wait for at least one hit before returning control.
    await expect(this.searchResults.first()).toBeVisible();
  }
}
