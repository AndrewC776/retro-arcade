import type { Sprite } from 'kontra';
import type SpriteState from './SpriteState';

export function detectCollisions(sprites: SpriteState): void {
  sprites.forEach((sprite) => {
    const nearBySprites = sprites.quadTree.get(sprite) as Sprite[];

    if (sprite.mode === 'seekAndDestroy') {
      if (sprite?.parent?.id === 'SpriteState') {
        const spawners = sprite.parent.objects.filter((sprite) => {
          return sprite.type === 'spawner';
        });
        if (spawners.length > 0) {
          sprite.addTarget(spawners[0]);
        }
      }
    }

    nearBySprites.forEach((neighbor) => {
      if (
        sprite.type === 'character' &&
        neighbor.type === 'character' &&
        neighbor.team !== sprite.team
      ) {
        const dx = neighbor.x - sprite.x;
        const dy = neighbor.y - sprite.y;
        const hyp = Math.hypot(dx, dy);
        if (hyp < 100 && !neighbor.player) {
          if (neighbor?.addTarget !== null) {
            if (
              neighbor.target === undefined ||
              neighbor.target === null ||
              neighbor.target.type === 'spawner'
            )
              neighbor.addTarget(sprite);
          }
        }
      } else if (
        sprite.type === 'character' &&
        neighbor.type === 'bullet' &&
        neighbor.team !== sprite.team
      ) {
        const dx = neighbor.x - sprite.x;
        const dy = neighbor.y - sprite.y;
        const hyp = Math.hypot(dx, dy);
        if (hyp < sprite.radius + neighbor.radius) {
          neighbor.ttl = 0;
          sprite.ttl = 0;
        }
      }
    });
  });
}

export function handleBounds(
  sprite: Sprite,
  canvas: HTMLCanvasElement,
  dt: number
): void {
  // sprite is beyond the left edge
  sprite.position.clamp(
    0,
    0,
    canvas.width - sprite.width,
    canvas.height - sprite.height
  );
  const radius: number = sprite.radius;
  if (sprite.x < -radius) {
    sprite.x = canvas.width + radius;
  } else if (sprite.x > canvas.width + radius) {
    // sprite is beyond the right edge
    // sprite.x = 0 - radius
  }
  // sprite is beyond the top edge
  if (sprite.y < -radius) {
    sprite.y = canvas.height + radius;
  } else if (sprite.y > canvas.height + radius) {
    // sprite is beyond the bottom edge
    sprite.y = -radius;
  }
}
