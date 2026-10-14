import { init, GameLoop, initPointer, onKey, initKeys } from 'kontra';
import SpriteState from '../../src/SpriteState';
import { detectCollisions, handleBounds } from '../../src/collisionDetection';
import { Building } from '../../src/sprites/building';
declare global {
  interface Window {
    sprites: SpriteState;
    hq: Building;
  }
}

export function buildingHq(): void {
  const { canvas } = init();
  initKeys();
  initPointer();
  const sprites = new SpriteState();
  window.sprites = sprites;
  const hq = new Building({
    team: 'green',
    x: 200,
    y: 200,
    type: 'spawner',
    spriteState: sprites,
  });
  window.hq = hq;
  sprites.push(hq);

  const loop = GameLoop({
    update: function (this: GameLoop, dt: number) {
      sprites.refresh();
      sprites.forEach((sprite) => {
        handleBounds(sprite, canvas, dt);
      });

      detectCollisions(sprites);

      sprites.clearDead();
      sprites.scene.update(dt);
    },
    render: function () {
      sprites.scene.render();
    },
  });
  onKey('esc', () => {
    if (loop.isStopped) {
      loop.start();
    } else {
      loop.stop();
    }
  });
  loop.start();
}
