import { init, GameLoop, initPointer, onKey, initKeys } from 'kontra';
import SpriteState from '../SpriteState';
import { Character } from '../character';
import { detectCollisions, handleBounds } from '../collisionDetection';
import { NPC } from '../npc';
import firelance from '../weapons/firelance';
import { addArmorPlates } from '../sprites/armorPlate';
declare global {
  interface Window {
    sprites: SpriteState;
    enemy: NPC;
  }
}

export function createScenario(): void {
  const { canvas } = init();

  initKeys();
  initPointer();

  const sprites = new SpriteState();

  const ship = new Character({
    type: 'player',
    x: 300,
    y: 300,
    player: true,
    team: 'blue',
    radius: 10,
  });
  window.ship = ship;

  sprites.push(ship);

  addArmorPlates(ship);
  addArmorPlates(ship);
  addArmorPlates(ship);

  const enemy = new NPC({
    x: 400,
    y: 200,
    moveSpeed: 1,
    radius: 10,
    team: 'red',
  });
  window.enemy = enemy;
  sprites.push(enemy);

  enemy.addWeapon(firelance(sprites));

  const playerWeapon = firelance(sprites);
  // This handles the positioning and visual aspect,
  // but it doesn't seem to address other relational aspects.
  ship.addChild(playerWeapon);

  const loop = GameLoop({
    update: function (this: GameLoop, dt) {
      sprites.refresh();
      sprites.forEach((sprite) => {
        handleBounds(sprite, canvas, dt);
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
