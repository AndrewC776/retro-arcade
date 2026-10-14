import { W,H,rand } from "../core.js";

export let weatherEnabled=true,weatherAnimationEnabled=true,snowEnabled=false;
export let weatherParticles=[];
export const RAIN_PARTICLE_COUNT=180,SNOW_PARTICLE_COUNT=80;
export function initWeatherParticles(){weatherParticles=[];const count=snowEnabled?SNOW_PARTICLE_COUNT:RAIN_PARTICLE_COUNT;for(let i=0;i<count;i++){const isSnow=snowEnabled;weatherParticles.push({x:Math.random()*W,y:Math.random()*H,speed:isSnow?rand(40,80):rand(800,1200),driftX:isSnow?rand(-20,20):rand(-80,-40),length:isSnow?rand(12,20):rand(20,40),type:isSnow?'snow':'rain'});}}
export function setWeatherEnabled(v){weatherEnabled=v;} export function setWeatherAnimationEnabled(v){weatherAnimationEnabled=v;} export function setSnowEnabled(v){snowEnabled=v;}
export function updateWeather(dt){if(!weatherEnabled||!weatherAnimationEnabled)return;for(const p of weatherParticles){p.y+=p.speed*dt;p.x+=p.driftX*dt;if(p.y>H||p.x<-50||p.x>W+50){p.y=-30;p.x=Math.random()*W+(p.x<-50?50:-50);}}}
