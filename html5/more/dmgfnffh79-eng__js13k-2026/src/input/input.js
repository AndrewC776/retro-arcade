import { canvas,W,H,clamp } from "../core.js";
import { state } from "../state.js";
import { initAudio } from "../audio/audio.js";
import { jump } from "../game/player.js";
let initialized=false;
export function initInput(){if(initialized)return;initialized=true;const update=(x,y)=>{state.input.x=clamp(x,20,W-20);state.input.y=clamp(y,20,H-20);};canvas.addEventListener("mousemove",e=>update(e.clientX,e.clientY));canvas.addEventListener("mousedown",e=>{initAudio();update(e.clientX,e.clientY);state.input.pressed=true;});canvas.addEventListener("mouseup",()=>state.input.pressed=false);canvas.addEventListener("touchstart",e=>{initAudio();const t=e.touches[0];update(t.clientX,t.clientY);state.input.pressed=true;jump();e.preventDefault();},{passive:false});canvas.addEventListener("touchmove",e=>{const t=e.touches[0];update(t.clientX,t.clientY);e.preventDefault();},{passive:false});canvas.addEventListener("touchend",()=>state.input.pressed=false);canvas.addEventListener("click",e=>{if(e.pointerType==="mouse"||e.pointerType===undefined)jump();});}
