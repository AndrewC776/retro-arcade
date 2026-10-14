import { angleToTarget } from 'kontra';
import { Character, type CharacterProperties } from './character';

interface NPCProperties extends CharacterProperties {}

export class NPC extends Character {
  timePassed = 0;
  target?: Character;
  mode?: string = 'seekAndDestroy';

  addTarget(character: Character): void {
    this.target = character;
  }

  moveToCoords(x: number, y: number): void {
    const xDifference = this.x - x;
    const yDifference = this.y - y;
    if (xDifference > 0) {
      this.moveLeft();
    } else if (xDifference < 0) {
      this.moveRight();
    }
    if (yDifference > 0) {
      this.moveUp();
    } else if (yDifference < 0) {
      this.moveDown();
    }
  }

  update(dt?: number | undefined): void {
    this.timePassed += dt;
    // beginning  of rate limiting functionality
    if (this.timePassed >= 1) {
      this.timePassed = 0;
    }
    if (this.target != null) {
      const angle = angleToTarget(this, this.target);
      this.rotation = angle;
      this.moveToCoords(this.target.x, this.target.y);
      this.attack();
      // TODO: something to detect range
      // TODO: something to attack when in range
      // Maybe slow movespeed down a bit while attacking?
    }
    super.update(dt);
  }

  attack(): void {
    if (this.weapon != null) {
      this.weapon.attack();
    }
  }
}
