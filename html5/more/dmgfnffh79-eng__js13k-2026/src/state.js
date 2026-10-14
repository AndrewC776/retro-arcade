import { W, H } from "./core.js";

export const state = {
    input: { x: W/2, y: H/2, pressed:false },
    player: {
        x: W/2, y: H-150, vx:0, vy:0, radius:25,
        grounded:true, jumps:0, rotation:0, rotationSpeed:0,
        wing:0, squash:0, alive:true,
        rotating:false, rotationStart:0, rotationDuration:0.5, rotationTime:0,
        hasJumped:false
    },
    worldY:0,
    groundY:H-70,
    score:0,
    rainbowCount:0,
    rainbowProgress:0,
    gameState:"playing",
    time:0,
    melodyIndex:0,
    rainbowOffset:0,
    currentInstrument:"piano",
    noteHoldCounter:0,
    noteHoldDuration:1,
    rainbowAnimation:0,
    barrageActive:false,
    barrageX:W
};

export function setWorldY(v){ state.worldY=v; }
export function addWorldY(v){ state.worldY+=v; }
export function setScore(v){ state.score=v; }
export function addScore(v=1){ state.score+=v; }
export function setRainbowCount(v){ state.rainbowCount=v; }
export function addRainbowProgress(v=1){ state.rainbowProgress+=v; }
export function resetRainbowProgress(){ state.rainbowProgress=0; }
export function setRainbowOffset(v){ state.rainbowOffset=v; }
export function setCurrentInstrument(v){ state.currentInstrument=v; }
export function setMelodyIndex(v){ state.melodyIndex=v; }
export function advanceMelody(){ state.melodyIndex++; }
export function setNoteHoldCounter(v){ state.noteHoldCounter=v; }
export function addNoteHoldCounter(v=1){ state.noteHoldCounter+=v; }
export function setNoteHoldDuration(v){ state.noteHoldDuration=v; }
export function setGameState(v){ state.gameState=v; }
export function setRainbowAnimation(v){ state.rainbowAnimation=v; }
export function setBarrageActive(v){ state.barrageActive=v; }
export function setBarrageX(v){ state.barrageX=v; }
export function addTime(v){ state.time+=v; }

export function resetGameState(){
    state.score=0;
    state.rainbowCount=0;
    state.rainbowProgress=0;
    state.rainbowOffset=0;
    state.currentInstrument="piano";
    state.melodyIndex=0;
    state.noteHoldCounter=0;
    state.noteHoldDuration=1;
    state.worldY=0;
    state.gameState="playing";
    state.rainbowAnimation=0;
    state.barrageActive=false;
    state.barrageX=W;
    state.player.y=state.groundY-25;
    state.player.vy=0;
    state.player.grounded=true;
    state.player.jumps=0;
    state.player.hasJumped=false;
    state.player.rotating=false;
    state.player.rotation=0;
};
