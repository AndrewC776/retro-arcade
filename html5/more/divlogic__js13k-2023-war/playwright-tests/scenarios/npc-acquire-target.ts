import kontra, {
  Sprite,
  init,
  GameLoop,
  initPointer,
  onKey,
  Pool,
} from 'kontra';
import SpriteState from '../../src/SpriteState';
import { Character } from '../../src/character';
import { detectCollisions, handleBounds } from '../../src/collisionDetection';
import { NPC } from '../../src/npc';
import firelance from '../../src/weapons/firelance';
declare global {
  interface Window {
    sprites: any;
    player: Character;
    enemy: NPC;
  }
}

export function npcAcquireTarget(): void {
  const { canvas } = init();

  kontra.initKeys();
  initPointer();

  const sprites = new SpriteState();

  const player = new Character({
    x: 1,
    y: 300,
    player: true,
    team: 'blue',
  });
  window.player = player;

  sprites.push(player);

  const enemy = new NPC({ x: 300, y: 300, moveSpeed: 3 });
  window.enemy = enemy;
  sprites.push(enemy);

  const weapon = firelance(sprites);
  enemy.addWeapon(weapon);

  const loop = GameLoop({
    fps: 30,
    update: function (this: GameLoop, dt) {
      sprites.refresh();
      sprites.forEach((sprite) => {
        handleBounds(sprite, canvas, dt);
      });

      detectCollisions(sprites);

      sprites.clearDead();
      sprites.update(dt * 100);
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
