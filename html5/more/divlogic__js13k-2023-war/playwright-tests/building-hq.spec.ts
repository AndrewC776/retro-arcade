import { expect, test } from './my-test';
import { getObject } from './utils';
import type SpriteState from '../src/SpriteState';
import type { Building } from '../src/sprites/building';
import type { Sprite, Vector } from 'kontra';

type Private<Type> = {
  [Property in keyof Type as `_${Property}`]: Type[Property];
};
type TestSprite = Sprite &
  Private<Sprite> & {
    position: Private<Vector>;
  };

test.describe('Given that an HQ building exists', async () => {
  test('If it has a team, it should spawn units', async ({ page }) => {
    await page.goto('localhost:5173?scenario=buildingHq', {
      waitUntil: 'load',
    });

    const startSprites = (await getObject(page, 'sprites')) as SpriteState;
    expect(startSprites.scene._o.length).toBe(1);

    await expect
      .poll(async () => {
        return await getObject(page, 'hq');
      })
      .toBeDefined();

    const hq = (await getObject(page, 'hq')) as Building;

    // Arbitrary team color
    expect(hq.team).toBe('green');

    await page.waitForTimeout(3000);

    await expect
      .poll(
        async () => {
          const length = await page.evaluate(
            'window.sprites.scene.objects.length'
          );

          return length;
        },
        {
          message: 'There should be more sprites after some time',
          timeout: 5000,
        }
      )
      .toBeGreaterThan(1);

    const endSprites = await page.evaluate('window.sprites.scene.objects');
    endSprites.forEach((element) => {
      // Sprites should be the same team as their HQ's
      expect(element.team).toBe('green');
    });
  });
});
