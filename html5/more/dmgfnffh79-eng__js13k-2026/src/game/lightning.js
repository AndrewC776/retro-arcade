import { state } from "../state.js";
import { rand } from "../core.js";
import { playThunderSound } from "../audio/effects.js";
export const lightning={active:false,warning:false,timer:0,x:0,flash:0};
export function startLightning(){if(state.gameState!=="playing"||lightning.active||lightning.warning)return;lightning.warning=true;lightning.timer=0;lightning.x=state.player.x+rand(-10,10);}
export function updateLightning(dt){if(!lightning.active&&!lightning.warning&&Math.random()<dt*.035)startLightning();if(lightning.warning){lightning.timer+=dt;if(lightning.timer>2.2){lightning.warning=false;lightning.active=true;lightning.timer=0;if(Math.abs(state.player.x-lightning.x)<55){state.player.vy=350;state.player.jumps=2;state.player.rotationSpeed=Math.PI*2*3;playThunderSound();}else playThunderSound();}}else if(lightning.active){lightning.timer+=dt;lightning.flash=1-lightning.timer/.35;if(lightning.timer>.35){lightning.active=false;lightning.flash=0;}}}
