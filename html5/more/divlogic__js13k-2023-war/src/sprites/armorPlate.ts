import { SpriteClass } from 'kontra';
import type { Character, SpriteProps } from '../character';

export function addArmorPlates(character: Character): void {
  let radius = 0;
  if (character.armor.length > 0) {
    radius = character.armor.slice(-1)[0].radius + 1;
  } else {
    radius = character.radius / 2;
  }
  const armorPlate = createArmorPlate(radius);
  character.addChild(armorPlate);
  character.armor.push(armorPlate);
}

export function createArmorPlate(radius: number): ArmorPlate {
  return new ArmorPlate({ radius });
}

type ArmorProperties = SpriteProps & {
  radius: number;
};

export class ArmorPlate extends SpriteClass {
  radius: number;

  constructor(properties: ArmorProperties) {
    super(properties);
    this.radius = properties.radius ?? 2;
  }

  draw(): void {
    this.drawBezier('right');
    this.drawBezier('left');
  }

  drawBezier(side: string): void {
    let yModifier = 0;
    // let xModifier;
    if (side === 'right') {
      yModifier = 1;
    } else if (side === 'left') {
      yModifier = -1;
    }

    if (this.context != null) {
      const context = this.context;
      context.moveTo(0, 0);
      context.beginPath();
      context.strokeStyle = 'grey';
      context.arc(0, 0, 2, 0, 2 * Math.PI);
      context.stroke();
      context.strokeStyle = 'black';
      context.beginPath();

      const x = -1 * this.radius;
      const y = 2 * yModifier * this.radius;
      const x2 = this.radius;
      const y2 = 2 * yModifier * this.radius;

      context.beginPath();

      context.strokeStyle = 'black';

      context.moveTo(x, y);
      context.bezierCurveTo(
        x,
        y + yModifier * this.radius,
        x2,
        y2 + yModifier * this.radius,
        x2,
        y2
      );

      const yOffset = 0.8 * this.radius * yModifier;
      context.lineTo(x2, y2 + yOffset);
      context.bezierCurveTo(
        x2,
        y2 + yOffset + 0.5 * yModifier * this.radius,
        x,
        y + yOffset + 0.5 * yModifier * this.radius,
        x,
        y + yOffset
      );
      context.closePath();

      context.stroke();
    }
  }
}
