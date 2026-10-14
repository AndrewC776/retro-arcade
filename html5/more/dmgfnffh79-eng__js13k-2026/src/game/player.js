import { state } from "../state.js";
import { W,H,clamp,lerp } from "../core.js";
import { playJumpSound,playDoubleJumpSound } from "../audio/effects.js";
import { stopSadLoop } from "../audio/sad.js";
import { checkCloudCollision } from "./collision.js";
import { updateCamera } from "./camera.js";

export function startDoubleJumpRotation(){
    state.player.rotating=true;
    state.player.rotationStart=state.player.rotation;
    state.player.targetRotation=state.player.rotationStart+Math.PI*2;
    state.player.rotationDuration=.5;
    state.player.rotationTime=0;
}
export function updateRotation(dt){
    if(state.player.rotating){
        state.player.rotationTime+=dt;
        const t=clamp(state.player.rotationTime/state.player.rotationDuration,0,1);
        state.player.rotation=lerp(state.player.rotationStart,state.player.targetRotation,t);
        if(t>=1){state.player.rotation=state.player.rotationStart;state.player.rotating=false;state.player.rotationSpeed=0;}
    }
}
export function jump(){
    if(state.gameState!=="playing")return;
    stopSadLoop();
    if(state.player.grounded){
        state.player.vy=-720;state.player.grounded=false;state.player.jumps=1;state.player.squash=.2;state.player.hasJumped=true;playJumpSound();
    }else if(state.player.jumps===1){
        state.player.vy=-680;state.player.jumps=2;state.player.squash=.2;startDoubleJumpRotation();playDoubleJumpSound();
    }
}
export function updatePlayer(dt,gameOver){
    if(state.gameState!=="playing")return;
    const dx=state.input.x-state.player.x;
    state.player.vx=lerp(state.player.vx,dx*7,.12);
    state.player.x+=state.player.vx*dt;
    state.player.x=clamp(state.player.x,30,W-30);
    state.player.vy+=1450*dt;
    state.player.y+=state.player.vy*dt;
    state.player.wing+=dt*12;
    state.player.squash=lerp(state.player.squash,0,.1);
    updateRotation(dt);
    checkCloudCollision();
    const groundScreen=state.groundY+state.worldY;
    if(state.player.y+state.player.radius>groundScreen){
        state.player.y=groundScreen-state.player.radius;
        if(state.player.hasJumped&&state.player.vy>250)gameOver();
        else{state.player.vy=0;state.player.grounded=true;state.player.jumps=0;}
    }
    updateCamera();
}
