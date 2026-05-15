import { test, expect } from './fixtures';

/**
 * What this spec demonstrates:
 *  - Custom fixture (`docsPage`) instead of constructing the POM inline
 *  - Role-based locators (`getByRole`) — survives copy changes, works for accessibility
 *  - Web-first assertions (`expect(locator).toBeVisible()`) — auto-retrying, no manual sleeps
 *  - Tagged tests (`@smoke`) so CI can filter quickly via `--grep @smoke`
 *
 * Target: https://playwright.dev — Playwright's own docs are a stable, public, well-known
 * site to demo against. If they change their hero copy I want to know about it; if Algolia
 * search changes, that's not my problem to assert on here.
 */

test.describe('Playwright docs site', () => {
  test('landing page renders the hero @smoke', async ({ docsPage }) => {
    await docsPage.goto();
    await expect(docsPage.heroHeading).toBeVisible();
    await expect(docsPage.getStartedLink).toBeVisible();
  });

  test('Get started navigates to the intro doc', async ({ docsPage, page }) => {
    await docsPage.goto();
    await docsPage.openGetStarted();

    // After landing on /docs/intro, the page should have the Installation heading.
    // We assert on role + name, not heading level — Docusaurus has shifted the
    // page's h1/h2 hierarchy before and will again.
    await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
  });

  test('docs page has navigable sidebar entries', async ({ docsPage, page }) => {
    await docsPage.goto();
    await docsPage.openGetStarted();

    // The left sidebar lists doc categories. We're not asserting the exact list —
    // that's brittle. We're asserting the *shape*: a sidebar exists, has links,
    // and at least one of the expected canonical entries is present. Role-based
    // because Docusaurus owns the markup and renames classes between versions.
    const sidebar = page.getByRole('navigation', { name: 'Docs sidebar' });
    await expect(sidebar).toBeVisible();

    const sidebarLinks = sidebar.getByRole('link');
    expect(await sidebarLinks.count()).toBeGreaterThan(5);

    await expect(sidebar.getByRole('link', { name: 'Writing tests' })).toBeVisible();
  });
});
