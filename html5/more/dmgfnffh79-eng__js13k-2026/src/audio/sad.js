import { sadMelody } from "../config.js";
import { getAudioContext, musicEnabled } from "./audio.js";
let sadLoopTimer=null,sadLoopActive=false,sadNoteIndex=0;
function playSadNote(freq){if(!getAudioContext()||!musicEnabled||!freq)return;const a=getAudioContext(),now=a.currentTime,ps=[{freq,gain:.25},{freq:freq*2,gain:.1},{freq:freq*3,gain:.05}],mg=a.createGain();mg.gain.setValueAtTime(0,now);mg.gain.linearRampToValueAtTime(.3,now+.03);mg.gain.exponentialRampToValueAtTime(.001,now+.6);mg.connect(a.destination);ps.forEach(p=>{const o=a.createOscillator(),g=a.createGain();o.type='sine';o.frequency.value=p.freq;g.gain.setValueAtTime(p.gain,now);g.gain.exponentialRampToValueAtTime(.001,now+.6);o.connect(g).connect(mg);o.start(now);o.stop(now+.6);});}
function scheduleSadLoop(){if(!sadLoopActive||!getAudioContext()||!musicEnabled)return;const f=sadMelody[sadNoteIndex%sadMelody.length];playSadNote(f);sadNoteIndex++;sadLoopTimer=setTimeout(scheduleSadLoop,f===null?500:350);}
export function startSadLoop(){if(sadLoopActive||!musicEnabled)return;sadLoopActive=true;sadNoteIndex=0;scheduleSadLoop();}
export function stopSadLoop(){sadLoopActive=false;if(sadLoopTimer){clearTimeout(sadLoopTimer);sadLoopTimer=null;}}
