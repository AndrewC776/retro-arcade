import { setGameState,setRainbowAnimation,setBarrageActive,setBarrageX } from "../state.js";
import { W } from "../core.js";
import { stopAllSounds } from "../main-audio.js";
import { playVictorySound } from "../audio/victory.js";
export function activateRainbow(){setGameState("success");setRainbowAnimation(0);setBarrageActive(true);setBarrageX(W);stopAllSounds();playVictorySound();}
