import { state } from "../state.js";
import { rand } from "../core.js";
export const particles=[];
export function spawnCloudBreakParticles(c){const sx=c.x,sy=c.y+state.worldY,count=12+Math.floor(c.width/12);for(let i=0;i<count;i++){const a=rand(0,Math.PI*2),s=rand(60,200);particles.push({x:sx+rand(-c.width*.4,c.width*.4),y:sy+rand(-c.height*.4,c.height*.4),vx:Math.cos(a)*s,vy:Math.sin(a)*s-50,life:rand(.4,.9),maxLife:.9,size:rand(3,8),rotation:rand(0,Math.PI*2),vrot:rand(-2,2)});}}
export function updateParticles(dt){for(let i=particles.length-1;i>=0;i--){const p=particles[i];p.life-=dt;if(p.life<=0){particles.splice(i,1);continue;}p.vy+=300*dt;p.x+=p.vx*dt;p.y+=p.vy*dt;p.rotation+=p.vrot*dt;}}
