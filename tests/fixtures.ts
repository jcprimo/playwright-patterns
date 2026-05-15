import { test as base, expect } from '@playwright/test';
import { DocsPage } from './pages/docs.page';

/**
 * Custom fixture: extends Playwright's `test` with a pre-built `docsPage`.
 *
 * Why a fixture instead of `new DocsPage(page)` at the top of every spec?
 *  - Fixtures are lazily instantiated — only specs that ask for `docsPage` pay the cost.
 *  - Setup/teardown for a fixture lives in one place. A spec stays focused on intent.
 *  - Playwright runs fixtures with full parallelism awareness; manual setup doesn't get that.
 */
type Fixtures = {
  docsPage: DocsPage;
};

export const test = base.extend<Fixtures>({
  docsPage: async ({ page }, use) => {
    const docsPage = new DocsPage(page);
    await use(docsPage);
  },
});

export { expect };
