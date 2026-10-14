import { init, GameLoop, initPointer, onKey, initKeys, Scene } from 'kontra';
import SpriteState from '../../src/SpriteState';
import { detectCollisions, handleBounds } from '../../src/collisionDetection';
import { Building } from '../../src/sprites/building';
import { NPC } from '../../src/npc';
import { Character } from '../../src/character';
import firelance from '../../src/weapons/firelance';
declare global {
  interface Window {
    sprites: SpriteState;
    hq: Building;
    blueSprite: NPC;
  }
}

export function npcSeekAndDestroy(): void {
  const { canvas, context } = init();
  initKeys();
  initPointer();
  const sadScene = Scene({
    id: 'sadScene',
    cullObjects: true,
    context,
  });
  const sprites = new SpriteState();
  window.sprites = sprites;
  const hq = new Building({
    team: 'green',
    x: 500,
    y: 1,
    type: 'spawner',
    spriteState: sprites,
  });
  sprites.push(hq);

  const blueSprite = new NPC({ team: 'blue', x: 1, y: 500 });
  sprites.push(blueSprite);
  window.blueSprite = blueSprite;

  const player = new Character({ color: 'red', player: true, x: 100, y: 10 });
  player.addWeapon(firelance(sprites));
  sprites.push(player);

  const loop = GameLoop({
    update: function (this: GameLoop, dt: number) {
      sprites.refresh();
      sprites.forEach((sprite) => {
        handleBounds(sprite, canvas, dt);
      });

      detectCollisions(sprites);

      sprites.scene.update(dt);

      sprites.update(dt);
      sprites.clearDead();
    },
    render: function () {
      sprites.render();
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
