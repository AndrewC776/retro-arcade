import type { Page } from '@playwright/test';

export async function getSprites(page: Page): Promise<unknown> {
  const spritesHandle = await page.evaluateHandle(() => {
    return window.sprites;
  });

  return await spritesHandle.jsonValue();
}

export async function getObject(page: Page, key: string): Promise<unknown> {
  const obj = await page.evaluate('window.' + key);

  return obj;
}
