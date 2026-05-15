# playwright-patterns

A small Playwright sandbox I use to keep my E2E patterns sharp. Not a product suite — a portfolio repo. It's deliberately compact: enough surface area to show how I structure tests, fixtures, and CI gates, without pretending to cover a real application.

## What this demonstrates

| Pattern | Where to look |
|---|---|
| Page Object Model | `tests/pages/docs.page.ts` |
| Custom test fixtures | `tests/fixtures.ts` |
| Role-based locators + web-first assertions | `tests/docs-navigation.spec.ts` |
| Data-driven tests + parallel describe | `tests/docs-pages.spec.ts` |
| Soft assertions for broad smoke sweeps | `tests/docs-pages.spec.ts` |
| CI quality gate (GitHub Actions) | `.github/workflows/playwright.yml` |
| Multi-browser projects (Chromium / Firefox / WebKit) | `playwright.config.ts` |
| Trace / screenshot / video on failure only | `playwright.config.ts` |
| Tagged tests (`@smoke`) for CI filtering | `tests/docs-navigation.spec.ts` |

## Why these choices

- **`playwright.dev` as the target.** I want stable, public, no-auth pages. Pointing tests at a real product would leak something. Pointing at a junk demo would feel like I didn't care. Playwright's own docs are the right middle ground — they're maintained, they change occasionally (which is fine; the assertions are role-based, not pixel-based), and any reviewer will recognise the site.
- **Web-first assertions only.** No `waitForTimeout`, no manual polling. `expect(locator).toBeVisible()` auto-retries until the condition holds or the timeout expires.
- **Role-based locators.** `getByRole('heading', { name: 'Installation' })` survives a class rename and tells a reviewer that I care about accessibility-shaped selectors.
- **Trace on first retry, not always.** Tracing is expensive. Cheap signal on green runs, full forensic capture the moment something fails.
- **CI runs all three browsers; local defaults to Chromium.** Fast feedback locally, broad coverage in CI.

## Running

```bash
npm install
npm run install:browsers   # one-time: downloads Chromium, Firefox, WebKit
npm test                   # all projects
npm run test:headed        # watch it run
npm run test:ui            # Playwright UI mode — best for authoring
npm run test:report        # open the last HTML report
```

Override the target site:

```bash
PLAYWRIGHT_BASE_URL=https://staging.example.com npm test
```

Run only the smoke-tagged tests:

```bash
npx playwright test --grep @smoke
```

## CI

`.github/workflows/playwright.yml` runs on every push and pull request to `main` / `master`. It installs dependencies, downloads browser binaries with `--with-deps`, runs the full suite, and uploads the HTML report as an artifact regardless of pass/fail. The artifact is retained for 30 days.

## What's intentionally not here

- No application code. This repo doesn't ship a product; it ships test patterns.
- No visual regression / screenshot diffing. Powerful, but environment-sensitive — I'd add it once there's a single trusted runner producing the baselines.
- No API mocking. The point of this suite is to demonstrate browser-driven behaviour against a real site. Network mocking lives in a different exercise.
- No AI-assisted test generation. Useful, but I'd rather link a tight suite I wrote than a noisy one I prompted.

## Stack

- Playwright `^1.55.0`
- Node.js (any LTS)
- TypeScript via Playwright's bundled config (no separate `tsconfig.json` needed)
