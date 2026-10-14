import { SpriteClass, degToRad, movePoint, randInt } from 'kontra';
import type { SpriteProps } from '../character';

interface accessories {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  cp1x: number;
  cp1y: number;
  cp2x: number;
  cp2y: number;
}

type HelmetProperties = SpriteProps & {
  radius: number;
  accessories?: accessories[];
};

export class Helmet extends SpriteClass {
  radius: number;
  accessories?: accessories[];

  constructor(properties: HelmetProperties) {
    super(properties);
    this.radius = properties.radius ?? 2;
    this.team = properties.team ?? 'red';
    // This whole accessories thing is intended to be a plume
    const accessories = [];
    for (let i = 0; i < randInt(23, 25); i++) {
      const startX = 0;
      const startY = 0;
      const endX = randInt(-30, -15);
      const endY = randInt(-10, 10);
      const cp1x = -2;
      const cp1y = 0;
      const cp2x = endX;
      const cp2y = 0;
      accessories.push({
        startX,
        startY,
        endX,
        endY,
        cp1x,
        cp1y,
        cp2x,
        cp2y,
      });
    }
    this.accessories = accessories;
  }

  draw(): void {
    super.draw();

    this.drawHelmet();
    this.drawAccessories();
  }

  drawHelmet(): void {
    if (this.context != null) {
      const context = this.context;
      const start = degToRad(40);
      const end = degToRad(320);
      const radius = this.radius;

      context.strokeStyle = 'grey';
      context.beginPath();
      const startPoint = movePoint({ x: 0, y: 0 }, start, 5);
      const endPoint = movePoint({ x: 0, y: 0 }, end, 5);

      context.moveTo(startPoint.x, startPoint.y);
      context.arc(0, 0, radius, start, end);
      context.lineTo(endPoint.x, endPoint.y);
      context.lineTo(startPoint.x, startPoint.y);
      context.stroke();
      context.fillStyle = 'grey';
      context.fill();

      context.beginPath();
      context.strokeStyle = 'black';
      context.arc(0, 0, this.radius / 3, 0, 2 * Math.PI);
      context.stroke();
    }
  }

  drawAccessories(): void {
    if (this.context != null) {
      const context = this.context;
      const team = this.team;
      this.accessories?.forEach((accessory) => {
        // debug circle
        // context.moveTo(startX, startY);
        // context.beginPath();
        // context.strokeStyle = 'orange';
        // context.arc(cp1x, cp1y, 1, 0, 2 * Math.PI);
        // context.stroke();
        // context.fill();

        context.strokeStyle = team;
        context.moveTo(accessory.startX, accessory.startY);
        context.beginPath();
        context.bezierCurveTo(
          accessory.cp1x,
          accessory.cp1y,
          accessory.cp2x,
          accessory.cp2y,
          accessory.endX,
          accessory.endY
        );
        context.stroke();
      });
    }
  }
}
