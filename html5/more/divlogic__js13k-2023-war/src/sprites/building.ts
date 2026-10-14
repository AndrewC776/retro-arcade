import { type Sprite, SpriteClass, type SpriteConstructor } from 'kontra';
import type SpriteState from '../SpriteState';
import { NPC } from '../npc';

export type SpriteProps = ConstructorParameters<SpriteConstructor>['0'];

type BuildingProperties = SpriteProps & {
  team?: string;
  moveSpeed?: number;
  player?: boolean;
  radius?: number;
  spriteState?: SpriteState;
};

export class Building extends SpriteClass {
  team: string;
  radius: number;
  spriteState?: SpriteState;
  updateCount = 0;

  constructor(properties: BuildingProperties) {
    super(properties);
    this.team = properties.team ?? 'red';
    this.radius = properties.radius ?? 10;

    if (this.type === undefined || this.type === null) {
      this.type = properties.type ?? 'building';
    }
    this.spriteState = properties.spriteState;
  }

  draw(this: Sprite): void {
    if (this.context != null) {
      // Color can be changed later
      this.context.strokeStyle = this.team;
      this.context.beginPath();
      this.context.moveTo(0, 0);
      this.context.arc(0, 0, this.radius, 0, 2 * Math.PI);
      this.context.stroke();
      this.context.fillStyle = this.team;
      this.context.fill();
    }
  }

  update(dt: number): void {
    super.update(dt);

    if (this.type === 'spawner') {
      this.updateCount += dt;
      if (this.updateCount > 1) {
        this.updateCount = 0;
        const npc = new NPC({
          team: this.team,
          x: this.x + 20,
          y: this.y + 20,
          radius: 10,
        });
        this.spriteState?.push(npc);
      }
    }
  }
}
