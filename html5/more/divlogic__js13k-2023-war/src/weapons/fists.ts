import type { Pool, Sprite } from 'kontra';
import { Weapon } from '../weapon';
import type SpriteState from '../SpriteState';

export default function fists(pool: Pool, sprites: SpriteState): Weapon {
  return new Weapon({
    pool,
    sprites,
    projectileWeapon: false,
    type: 'fists',
    x: 5,
    y: 5,
    render(this: Sprite) {
      if (this.context != null) {
        const context = this.context;
        context.fillStyle = 'grey';
        context.beginPath();
        context.arc(0, 0, 3, 0, 2 * Math.PI);
        context.stroke();
        context.fill();

        context.fillStyle = 'grey';
        context.beginPath();
        context.arc(2, -10, 3, 0, 2 * Math.PI);
        context.stroke();
        context.fill();
      }
    },
  });
}
