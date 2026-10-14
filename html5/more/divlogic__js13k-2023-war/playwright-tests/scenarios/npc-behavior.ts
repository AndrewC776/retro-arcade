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
    player: Character;
    enemy: NPC;
  }
}

export function npcBehavior(): void {
  const { canvas } = init();

  kontra.initKeys();
  initPointer();

  const sprites = new SpriteState();

  const player = new Character({
    x: 300,
    y: 300,
    player: true,
    team: 'blue',
    radius: 10,
  });
  window.player = player;

  sprites.push(player);

  const enemy = new NPC({ x: 1, y: 1, moveSpeed: 3, radius: 10 });
  window.enemy = enemy;
  sprites.push(enemy);

  enemy.addTarget(player);

  const weapon = firelance(sprites);
  player.addWeapon(weapon);

  enemy.addWeapon(firelance(sprites));

  const loop = GameLoop({
    update: function (this: GameLoop, dt: number) {
      sprites.refresh();
      sprites.forEach((sprite) => {
        handleBounds(sprite, canvas, dt);
      });

      detectCollisions(sprites);

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
