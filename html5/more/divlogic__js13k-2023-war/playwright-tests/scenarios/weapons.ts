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
import fists from '../../src/weapons/fists';
declare global {
  interface Window {
    sprites: any;
    player: Character;
    enemy: NPC;
  }
}

export function weapons() {
  const { canvas } = init();

  kontra.initKeys();
  initPointer();

  const sprites = new SpriteState();

  const player = new Character({
    x: 100,
    y: 300,
    player: true,
    team: 'blue',
  });
  window.player = player;

  sprites.push(player);

  const enemy = new NPC({ x: 300, y: 300, moveSpeed: 3 });
  window.enemy = enemy;
  sprites.push(enemy);

  // This is taken from the example, might be a bug in their type file
  // @ts-expect-error This seems like the type file is off
  const pool = Pool({ create: Sprite });

  const weapon = fists(pool, sprites);
  player.addChild(weapon);

  const loop = GameLoop({
    // fps: 1,
    update: function (this: GameLoop) {
      sprites.refresh();
      sprites.forEach((sprite) => {
        handleBounds(sprite, canvas);
      });

      // collision detection
      detectCollisions(sprites);

      sprites.filter((sprite) => sprite.isAlive());
    },
    render: function () {
      sprites.forEach((sprite) => {
        sprite.render();
      });
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
