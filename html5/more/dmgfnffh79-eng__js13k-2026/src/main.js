import {ctx,W,H,resize} from "./core.js";
import {state,addTime,setRainbowAnimation,setBarrageX,setBarrageActive,resetGameState} from "./state.js";
import {initAudio} from "./audio/audio.js";
import {initInput} from "./input/input.js";
import {initDebug} from "./ui/debug.js";
import {initClouds,updateCloudLifecycle,clouds} from "./game/clouds.js";
import {updateParticles} from "./game/particles.js";
import {updateLightning} from "./game/lightning.js";
import {updatePlayer} from "./game/player.js";
import {updateWeather,initWeatherParticles} from "./game/weather.js";
import {draw,updateDarkClouds} from "./render.js";
import {stopAllSounds} from "./main-audio.js";
import {startSadLoop,stopSadLoop} from "./audio/sad.js";
import {resetCollisionMusicState} from "./game/collision.js";

addEventListener("resize",()=>{state.groundY=H-70;state.player.x=Math.min(Math.max(state.player.x,30),W-30);});

function gameOver(){
    stopAllSounds();
    startSadLoop();
    resetGameState();
    clouds.length=0;
    initClouds();
    resetCollisionMusicState();
    document.getElementById("score").textContent="云朵：0";
    document.querySelectorAll(".color").forEach(d=>d.classList.remove("active"));
}
function startGame(){
    const ss=document.getElementById("startScreen");
    if(state.started)return;
    state.started=true;
    ss.style.display="none";
    stopSadLoop();
    initAudio();
    initClouds();
    initWeatherParticles();
    initInput();
    initDebug();
    last=performance.now();
    requestAnimationFrame(loop);
}

document.getElementById("startButton").addEventListener("click",startGame);
document.getElementById("startScreen").addEventListener("click",startGame);
let last=performance.now();
function loop(now){
    const dt=Math.min(.033,(now-last)/1000);last=now;
    addTime(dt);
    updateDarkClouds(dt);
    updateLightning(dt);
    updatePlayer(dt,gameOver);
    updateCloudLifecycle(dt);
    updateParticles(dt);
    updateWeather(dt);
    if(state.gameState==="success"){
        setRainbowAnimation(Math.min(1,state.rainbowAnimation+.008));
        setBarrageX(state.barrageX-3);
        if(state.barrageX<-400)setBarrageActive(false);
    }
    draw();
    requestAnimationFrame(loop);
}
