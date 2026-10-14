import game from "./game";

export let canvas: HTMLCanvasElement;
export let ctx: Ctx;
export let SCALE: number;
export let TILE_SIZE: number;
export let MAP_SIZE: number;

export function createCanvas() {
  if (canvas) return { canvas, ctx };

  canvas = document.createElement("canvas");
  ctx = canvas.getContext("2d");

  SCALE = canvas.width / 512;

  document.body.appendChild(canvas);

  return { canvas, ctx };
}

export function onResize() {
  MAP_SIZE = Math.min(innerWidth, innerHeight);
  MAP_SIZE -= MAP_SIZE % 32;

  canvas.height = canvas.width = MAP_SIZE;

  let oldScale = SCALE;
  SCALE = MAP_SIZE / 512;
  TILE_SIZE = MAP_SIZE / 16;

  game.resize(SCALE / oldScale);
}
