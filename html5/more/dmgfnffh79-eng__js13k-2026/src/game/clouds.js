import { state } from "../state.js";
import { W,H } from "../core.js";
import { rand,clamp } from "../core.js";
import { CLOUD_MAX_COUNT,CLOUD_SINK_SPEED_MIN,CLOUD_SINK_SPEED_MAX,CLOUD_SPACING_Y } from "../config.js";
export const clouds=[];
let lastSpawnWorldY=0;
function getCloudXRange(){const isMobile=W<600,margin=isMobile?30:60,maxOffset=isMobile?100:150;return{min:margin,max:W-margin,offsetRange:maxOffset};}
export function createCloud(initialY){
    if(initialY===undefined){const screenY=state.player.y-rand(200,380);initialY=screenY-state.worldY;}
    const{min,max,offsetRange}=getCloudXRange(),previous=clouds.length?clouds[clouds.length-1]:null;
    let x;if(previous){x=Math.random()<.2?rand(min,max):clamp(previous.x+rand(-offsetRange,offsetRange),min,max);}else x=rand(min,max);
    const c={x,y:initialY,width:rand(100,170),height:rand(28,48),rotation:rand(-.05,.05),bob:rand(0,Math.PI*2),vy:rand(CLOUD_SINK_SPEED_MIN,CLOUD_SINK_SPEED_MAX),alpha:1,broken:false,brokenTimer:0};
    clouds.push(c);return c;
}
export function initClouds(){clouds.length=0;let baseY=state.player.y-state.worldY-200;for(let i=0;i<6;i++)createCloud(baseY-i*CLOUD_SPACING_Y);if(clouds.length)lastSpawnWorldY=clouds[clouds.length-1].y;}
export function updateCloudLifecycle(dt){
    for(let i=clouds.length-1;i>=0;i--){
        const c=clouds[i];
        if(c.broken){c.brokenTimer+=dt;if(c.brokenTimer>.8){clouds.splice(i,1);continue;}c.alpha=1-c.brokenTimer/.8;continue;}
        c.y+=c.vy*dt;c.bob+=dt*2;
        const sy=c.y+state.worldY;
        if(sy>H+50)c.alpha=clamp(1-(sy-(H+50))/100,0,1);else if(sy>H-50)c.alpha=clamp(1-(sy-(H-50))/100,0,1);else c.alpha=1;
        if(sy>H+150||sy<-200){clouds.splice(i,1);continue;}
    }
    if(state.gameState==="playing"&&clouds.length<CLOUD_MAX_COUNT){
        let minWorldY=Infinity;for(const c of clouds)if(!c.broken&&c.y<minWorldY)minWorldY=c.y;
        if(minWorldY===Infinity)minWorldY=lastSpawnWorldY;
        const sy=minWorldY-CLOUD_SPACING_Y;createCloud(sy);lastSpawnWorldY=sy;
    }
    if(clouds.length)lastSpawnWorldY=Math.min(lastSpawnWorldY,...clouds.map(c=>c.y));
}
