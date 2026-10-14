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

export function playerAttacks(): void {
  const { canvas } = init();
  // This is taken from the example, might be a bug in their type file
  // @ts-expect-error This seems like the type file is off
  const pool = Pool({ create: Sprite });

  kontra.initKeys();
  initPointer();
  const sprites = new SpriteState();
  const player = new Character({
    type: 'player',
    x: 400,
    y: 400,
    player: true,
    team: 'blue',
  });
  window.player = player;
  sprites.push(player);

  const enemy = new NPC({ x: 300, y: 300, moveSpeed: 3, team: 'purple' });
  window.enemy = enemy;
  const enemyWeapon = firelance(sprites);
  sprites.push(enemy);
  enemy.addWeapon(enemyWeapon);

  const weapon = firelance(sprites);
  player.addWeapon(weapon);

  const loop = GameLoop({
    update: function (this: GameLoop, dt: number) {
      sprites.refresh();
      sprites.forEach((sprite) => {
        handleBounds(sprite, canvas);
      });

      // collision detection
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
