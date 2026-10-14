import { test as base, expect } from '@playwright/test';

/**
 * Is void | never actually correct?
 * This is kind of some weird advanced generic stuff going on
 * without never, I get a lint error, but nothing seems to break
 */
export const test = base.extend<{ failOnErrors: void | never }>({
  failOnErrors: [
    async ({ page }, use) => {
      page.on('pageerror', (data) => {
        console.log('error type is: ', data instanceof Error);
        console.error(data);
        expect(data, 'There should be no errors').toBeUndefined();
      });

      await use();
    },
    { auto: true },
  ],
});

export { expect } from '@playwright/test';
