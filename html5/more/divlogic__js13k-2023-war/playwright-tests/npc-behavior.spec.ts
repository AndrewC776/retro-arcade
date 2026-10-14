import { test, expect } from './my-test';
import { getObject } from './utils';
import PlayerController from './reals/PlayerController';

test('NPC can move to a target', async ({ page }) => {
  await page.goto('localhost:5173?scenario=npcBehavior');
  /**
   * The ways to test this, off the top of my head:
   * 1. Just keep checking the values over time and making sure
   * the enemy sprite just gets closer.
   * 2.Grab the values over and over until
   * some condition (timeout with distance === 0 maybe)
   * and then when that condition is met, confirm that it
   * happens reasonably enough
   *
   * Maybe there can be multiple scenarios, like obstacles vs no obstacles
   *
   */

  // Given that the enemy has the player as the target
  // The enemy should move towards that target
  const player = await getObject(page, 'player');
  const enemy = await getObject(page, 'enemy');

  // Given that the enemy sprite has a target
  expect(enemy.target).toBeDefined();
  expect(enemy.target.position._x).toBe(player.position._x);
  expect(enemy.target.position._y).toBe(player.position._y);
  // And that target is in a different position
  expect(enemy.position._x).not.toBe(player.position._x);
  expect(enemy.position._y).not.toBe(player.position._y);

  // Over time, the enemy sprite should move closer to the target's position

  await expect
    .poll(
      async () => {
        const enemy = await page.evaluate('window.enemy');
        const xIsClose =
          player.position._x - 5 < enemy.position._x &&
          enemy.position._x < player.position._x + 5;
        const yIsClose =
          player.position._y - 5 < enemy.position._y &&
          enemy.position._y < player.position._y + 5;

        return xIsClose && yIsClose;
      },
      {
        message: 'The enemy sprite should move to the target location',
        intervals: [1000, 2000, 3000, 4000, 5000],
        timeout: 6000,
      }
    )
    .toBeTruthy();
});

test('NPC can acquire a target', async ({ page }) => {
  await page.goto('localhost:5173?scenario=npcAcquireTarget');
  const player = await getObject(page, 'player');
  const enemy = await getObject(page, 'enemy');

  // Given that the enemy sprite doesn't have a target
  expect(enemy.target).toBeUndefined();
  // And that the player is not where the enemy is
  expect(enemy.position._x).not.toBe(player.position._x);
  expect(enemy.position._y).toBe(player.position._y);
  const difference = enemy.position._x - player.position._x;
  expect(difference).toBe(299);

  // If the player gets close enough to the enemy,
  // the enemy will target the player

  const playerController = new PlayerController(page);
  await playerController.moveRight(3000);

  await expect
    .poll(
      async () => {
        const enemy = await getObject(page, 'enemy');
        return enemy.target;
      },
      {
        message:
          'The enemy sprite should acquire a target when the player is near',
        timeout: 3000,
      }
    )
    .toBeDefined();
});

test('NPC attacks target', async ({ page }) => {
  await page.goto('localhost:5173?scenario=npcAcquireTarget');
  const player = await getObject(page, 'player');
  const enemy = await getObject(page, 'enemy');

  // Given that the enemy sprite doesn't have a target
  expect(enemy.target).toBeUndefined();
  // And that the player is not where the enemy is
  expect(enemy.position._x).not.toBe(player.position._x);
  expect(enemy.position._y).toBe(player.position._y);
  const difference = enemy.position._x - player.position._x;
  expect(difference).toBe(299);

  // If the player gets close enough to the enemy,
  // the enemy will target the player

  const playerController = new PlayerController(page);
  await playerController.moveRight(2000);

  await expect
    .poll(
      async () => {
        const player = await getObject(page, 'player');
        return player.ttl;
      },
      {
        message: 'The enemy sprite should attack its target',
        timeout: 5000,
      }
    )
    .toBe(0);
});
