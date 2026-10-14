import { chapters } from './chapters';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const zzfx: any;

export default abstract class Tiles {
  public static tiles: Tiles[] = new Array<Tiles>();

  public static TilesWidth = 32;
  public static TilesHeight = 32;
  public static reload = false;
  public solid = false;

  constructor(public id: number) {
    Tiles.tiles[id] = this;
  }

  abstract draw(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    ch: string,
  ): void;

  public static getTile(id: number): Tiles {
    return Tiles.tiles[id] || Tiles.tiles[1];
  }

  public setSolid(b: boolean): void {
    this.solid = b;
  }
}
export class Platform extends Tiles {
  public solid = true;

  constructor(id: number) {
    super(id);
  }

  draw(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    ch: string,
  ): void {
    ctx.save();
    ctx.fillStyle = chapters[ch].colors.platform.toString();
    ctx.fillRect(x * Tiles.TilesWidth, y * Tiles.TilesHeight, w, h);
    ctx.restore();
  }
}

export class Spike extends Tiles {
  public solid = true;
  constructor(id: number) {
    super(id);
  }

  draw(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    ch: string,
  ): void {
    const tx = x * Tiles.TilesWidth;
    const ty = y * Tiles.TilesHeight;
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = chapters[ch].colors.spike.toString();
    ctx.fillRect(tx, ty + h / 2, w, h / 2);
    ctx.moveTo(tx, ty + h / 2);
    ctx.lineTo(tx + w / 4 / 2, ty);
    ctx.lineTo(tx + w / 4, ty + h / 2);
    ctx.lineTo(tx + w / 4 + w / 4 / 2, ty);
    ctx.lineTo(tx + (w / 4) * 2, ty + h / 2);
    ctx.lineTo(tx + (w / 4) * 2 + w / 4 / 2, ty);
    ctx.lineTo(tx + (w / 4) * 3, ty + h / 2);
    ctx.lineTo(tx + (w / 4) * 3 + w / 4 / 2, ty);
    ctx.lineTo(tx + (w / 4) * 4, ty + h / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

export class JumpPad extends Tiles {
  public solid = true;

  constructor(id: number) {
    super(id);
  }

  draw(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    ch: string,
  ): void {
    const tx = x * Tiles.TilesWidth;
    const ty = y * Tiles.TilesHeight;
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = chapters[ch].colors.jumppad.toString();
    ctx.fillRect(tx, ty, w, h / 4);
    ctx.fillRect(tx, ty + h / 2, w, h / 2);
    ctx.moveTo(tx + w / 2 - 3, ty + h / 4);
    ctx.fillRect(tx + w / 2 - 2, ty + h / 4, 6, h / 4);
    ctx.closePath();
    ctx.restore();
  }
}

class Spawn extends Tiles {
  public solid = false;
  constructor(id: number) {
    super(id);
  }

  draw(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
  ): void {
    ctx.save();
    ctx.clearRect(x * Tiles.TilesWidth, y * Tiles.TilesHeight, w, h);
    ctx.restore();
  }
}

class End extends Tiles {
  public solid = true;
  constructor(id: number) {
    super(id);
  }

  draw(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    ch: string,
  ): void {
    ctx.save();
    const tx = x * Tiles.TilesWidth;
    const ty = y * Tiles.TilesHeight;
    ctx.fillStyle = chapters[ch].colors.end.toString();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.translate(tx, ty);
    ctx.scale(1.4, 1.4);
    const p = new Path2D(
      'M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z',
    );
    ctx.stroke(p);
    ctx.fill(p);
    ctx.restore();
  }
}

export class nonPlatform extends Tiles {
  public solid = true;

  constructor(id: number) {
    super(id);
  }

  draw(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    ch: string,
  ): void {
    ctx.save();
    ctx.fillStyle = chapters[ch].colors.nonplatform.toString();
    ctx.fillRect(x * Tiles.TilesWidth, y * Tiles.TilesHeight, w, h);
    ctx.restore();
  }
}

export class nonSpike extends Tiles {
  public solid = true;
  constructor(id: number) {
    super(id);
  }

  draw(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    ch: string,
  ): void {
    const tx = x * Tiles.TilesWidth;
    const ty = y * Tiles.TilesHeight;
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = chapters[ch].colors.nonspike.toString();
    ctx.fillRect(tx, ty + h / 2, w, h / 2);
    ctx.moveTo(tx, ty + h / 2);
    ctx.lineTo(tx + w / 4 / 2, ty);
    ctx.lineTo(tx + w / 4, ty + h / 2);
    ctx.lineTo(tx + w / 4 + w / 4 / 2, ty);
    ctx.lineTo(tx + (w / 4) * 2, ty + h / 2);
    ctx.lineTo(tx + (w / 4) * 2 + w / 4 / 2, ty);
    ctx.lineTo(tx + (w / 4) * 3, ty + h / 2);
    ctx.lineTo(tx + (w / 4) * 3 + w / 4 / 2, ty);
    ctx.lineTo(tx + (w / 4) * 4, ty + h / 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

(function () {
  new Platform(1);
  new Spike(2);
  new JumpPad(3);
  new Spawn(4);
  new End(5);
  new nonPlatform(6);
  new nonSpike(7);
})();
