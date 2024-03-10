// https://playwright.dev/docs/chrome-extensions

/* eslint-disable no-empty-pattern, unicorn/prefer-module */

import { test as baseTest, chromium, type BrowserContext } from '@playwright/test';
import path from 'node:path';

export const test = baseTest.extend<{
  context: BrowserContext;
  extensionId: string;
}>({
  // biome-ignore lint/correctness/noEmptyPattern: empty initial context
  async context({}, use) {
    const extensionPath = path.join(__dirname, '../../dist');
    const context = await chromium.launchPersistentContext('', {
      args: [
        '--headless=new', // chromium 112+
        // '--virtual-time-budget=5000', // chromium 112+, fast-forward timers
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
      ],
      acceptDownloads: false,
      strictSelectors: true,
      offline: true, // the extension must work 100% offline
    });
    await use(context);
    await context.close();
  },
  async extensionId({ context }, use) {
    let [background] = context.serviceWorkers();
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    background ??= await context.waitForEvent('serviceworker');

    const extensionId = background.url().split('/')[2];
    await use(extensionId);
  },
});

export const { expect } = test;
