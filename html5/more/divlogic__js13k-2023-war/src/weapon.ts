import { type Pool, type Sprite, SpriteClass, pointerPressed } from 'kontra';
import type SpriteState from './SpriteState';

export class Weapon extends SpriteClass {
  projectileWeapon?: boolean = false;
  pool: Pool;
  sprites: SpriteState;

  constructor(properties: any) {
    super(properties);
    this.pool = properties.pool;
    this.sprites = properties.sprites;
    this.projectileWeapon = properties.projectileWeapon;
    this.radius = properties?.radius ?? 2;
  }

  attack(this: Weapon) {
    if (this.projectileWeapon) {
      const cos = Math.cos(this.world.rotation);
      const sin = Math.sin(this.world.rotation);
      const bullet = this.sprites.pool.get({
        team: this.parent?.team,
        type: 'bullet',
        color: 'black',
        x: this.world.x + cos * 12,
        y: this.world.y + sin * 12,
        dx: this.dx + cos * 1000,
        dy: this.dy + sin * 1000,
        ttl: 10,
        radius: this.radius,
        width: 2,
        height: 2,
      });

      this.sprites.push(bullet as Sprite);
    } else {
      const cos = Math.cos(this.world.rotation);
      const sin = Math.sin(this.world.rotation);
      const bullet = this.sprites.pool.get({
        team: this.parent?.team,
        type: 'bullet',
        color: 'white',
        x: this.world.x + cos * 12,
        y: this.world.y + sin * 12,
        dx: this.dx + cos * 5,
        dy: this.dy + sin * 5,
        ttl: 2,
        radius: 2,
        render(this: Sprite) {
          if (this.context != null) {
            const coin = Math.random();
            const context = this.context;
            // left fist
            if (coin > 0.5) {
              context.fillStyle = 'grey';
              context.beginPath();
              context.arc(2, -10, 5, 0, 2 * Math.PI);
              context.stroke();
              context.fill();
            } else {
              // right fist
              context.fillStyle = 'grey';
              context.beginPath();
              context.arc(0, 0, 5, 0, 2 * Math.PI);
              context.stroke();
              context.fill();
            }
          }
        },
      });
      this.sprites.push(bullet as Sprite);
    }
  }

  update(dt?: number | undefined): void {
    super.update(dt);
    if (this?.parent?.player && pointerPressed('left')) {
      this.attack();
    }
  }
}
