import { test, expect, Page } from '@playwright/test';

test('Can click to attack', async ({ page }) => {
  await page.goto('localhost:5173?scenario=playerAttacks');

  const enemy = await (await page.evaluateHandle('window.enemy')).jsonValue();
  expect(enemy).toBeDefined();
  expect(enemy?.ttl).toBe(Infinity);

  await page.mouse.click(enemy.position?._x, enemy.position?._y, {
    delay: 1000,
  });

  const updatedEnemy = await (
    await page.evaluateHandle('window.enemy')
  ).jsonValue();
  expect(updatedEnemy?.ttl).toBeLessThan(0);
});
