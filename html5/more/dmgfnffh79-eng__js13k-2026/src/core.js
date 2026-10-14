import { TAU } from "./config.js";

export const canvas = document.getElementById("game");
export const ctx = canvas.getContext("2d");
export let W = innerWidth, H = innerHeight;

export function resize(){
    W = innerWidth; H = innerHeight;
    canvas.width = W * devicePixelRatio;
    canvas.height = H * devicePixelRatio;
    ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
}
addEventListener("resize",resize); resize();

export function clamp(v,a,b){ return Math.max(a,Math.min(b,v)); }
export function lerp(a,b,t){ return a+(b-a)*t; }
export function rand(a,b){ return Math.random()*(b-a)+a; }
export { TAU };
