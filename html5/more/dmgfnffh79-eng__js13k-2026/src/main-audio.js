import { continuousEngine } from "./audio/music.js";
import { stopSadLoop } from "./audio/sad.js";
export function stopAllSounds(){continuousEngine.stop();stopSadLoop();}
