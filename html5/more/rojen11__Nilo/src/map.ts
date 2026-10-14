import Engine from './engine';
import Tiles from './tiles';
import { Levels, Level } from './levels';
import Vector2 from './vector';
import { chapters } from './chapters';

export const maps = [
  '11',
  '12',
  '13',
  '14',
  '15',
  '21',
  '22',
  '23',
  '24',
  '25',
  '31',
  '32',
  '33',
  '34',
  '35',
];

export default class Map {
  private ctx: CanvasRenderingContext2D;
  public worldHeight: number;
  public worldWidth: number;
  public start: Vector2 = new Vector2(75, 75);
  public end: Vector2;

  public images: Array<HTMLImageElement> = [new Image(), new Image()];

  public noReloadImage: HTMLImageElement;

  public level: Level;

  public levelIndex: number;

  private urlbar = document.getElementById('urlbar');

  constructor(public engine: Engine) {
    this.ctx = this.engine.context;
  }

  loadLevel(level: string): boolean {
    if (this.urlbar !== null) {
      this.urlbar.innerText = 'https://nilo.com/404.html';
    }
    this.level = Levels[level];
    this.levelIndex = maps.indexOf(level);
    this.worldHeight = this.level.height;
    this.worldWidth = this.level.width;
    this.generateImage();
    if (this.engine.player !== undefined) {
      this.engine.player.pos = this.start;
      this.engine.player.pcolor = chapters[
        Math.floor(Number(maps[this.levelIndex]) / 10).toString()
      ].colors.player.toString();
    }
    this.engine.context.canvas.style.backgroundColor = chapters[
      Math.floor(Number(maps[this.levelIndex]) / 10).toString()
    ].colors.background.toString();
    return true;
  }

  generateImage(): void {
    for (let i = 0; i <= 1; i++) {
      let ictx = document.createElement('canvas').getContext('2d');
      if (ictx != null) {
        ictx.canvas.width = this.worldWidth * Tiles.TilesWidth;
        ictx.canvas.height = this.worldHeight * Tiles.TilesHeight;
        this.createMap(ictx, i);
        this.images[i].src = ictx.canvas.toDataURL('image/png');
      }
      ictx = null;
    }
  }

  // Draw tiles with camera offset. Might need to change this later
  createMap(ictx: CanvasRenderingContext2D, i: number): void {
    this.level.map.forEach((r, y) => {
      r.forEach((c, x) => {
        let b = false;
        if (c <= 5 && i === 0) {
          b = true;
          if (c === 4) {
            this.start = new Vector2(
              x * Tiles.TilesWidth,
              y * Tiles.TilesHeight,
            );
            b = false;
          }
        } else if (c > 5 && i === 1) {
          b = true;
        }
        if (c != 0 && b) {
          Tiles.getTile(c).draw(
            ictx,
            x,
            y,
            Tiles.TilesWidth,
            Tiles.TilesHeight,
            Math.floor(Number(maps[this.levelIndex]) / 10).toString(),
          );
        }
      });
    });
  }

  draw(): void {
    const sx = this.engine.camera.pos.x;
    const sy = this.engine.camera.pos.y;

    const sWidth = this.ctx.canvas.width;
    const sHeight = this.ctx.canvas.height;

    const dx = 0;
    const dy = 0;

    const dWidth = sWidth;
    const dHeight = sHeight;
    this.images.forEach((im, i) => {
      if (!Tiles.reload || i === 1) {
        this.ctx.drawImage(
          im,
          sx,
          sy,
          sWidth,
          sHeight,
          dx,
          dy,
          dWidth,
          dHeight,
        );
      }
    });
  }
}
