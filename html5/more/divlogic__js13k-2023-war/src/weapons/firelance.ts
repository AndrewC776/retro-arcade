import type { Sprite } from 'kontra';
import { Weapon } from '../weapon';
import type SpriteState from '../SpriteState';

export default function firelance(sprites: SpriteState): Weapon {
  return new Weapon({
    sprites,
    projectileWeapon: true,
    type: 'firelance',
    x: 5,
    y: 5,
    render(this: Sprite) {
      if (this.context != null) {
        this.context.fillStyle = 'brown';
        this.context.beginPath();
        this.context.fillRect(0, 0, 15, 2);
        this.context.fillStyle = 'green';
        this.context.fillRect(15, 0, 8, 4);
        this.context.stroke();
      }
    },
  });
}
