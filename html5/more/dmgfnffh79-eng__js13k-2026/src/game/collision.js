import { state,addScore,addRainbowProgress,setRainbowCount,setRainbowOffset,setCurrentInstrument,setNoteHoldCounter,setNoteHoldDuration,advanceMelody } from "../state.js";
import { clouds } from "./clouds.js";
import { spawnCloudBreakParticles } from "./particles.js";
import { playSmoothNote } from "../audio/music.js";
import { rand } from "../core.js";
import { updateUI,updateRainbow } from "../ui/ui.js";
import { activateRainbow } from "./success.js";

export function checkCloudCollision(){
    for(let i=clouds.length-1;i>=0;i--){
        const c=clouds[i];
        if(c.broken)continue;
        const cy=c.y+state.worldY;
        const left=c.x-c.width*.55,right=c.x+c.width*.55,top=cy-c.height*.5;
        if(state.player.vy>0&&state.player.x>left-state.player.radius&&state.player.x<right+state.player.radius&&state.player.y+state.player.radius>top&&state.player.y+state.player.radius<top+35){
            state.player.y=top-state.player.radius;
            state.player.vy=-700;
            state.player.grounded=false;
            if(!c.passed){
                c.passed=true;
                addScore();
                addRainbowProgress();
                updateUI();
                if(state.rainbowProgress>=13){
                    state.rainbowProgress=0;
                    setRainbowCount(state.rainbowCount+1);
                    let instrument=state.currentInstrument;
                    if(instrument==="piano")instrument="violin";
                    else if(instrument==="violin")instrument="bass";
                    else instrument="piano";
                    setCurrentInstrument(instrument);
                    setRainbowOffset(state.rainbowOffset+(Math.random()<.5?1:-1));
                    updateRainbow();
                    state.player.jumps=1;
                    if(state.rainbowCount>=7)activateRainbow();
                }
            }
            spawnCloudBreakParticles(c);
            state.noteHoldCounter++;
            let advance=false;
            if(state.noteHoldCounter>=state.noteHoldDuration){
                advance=true;
                setNoteHoldCounter(0);
                setNoteHoldDuration(Math.floor(Math.random()*3)+1);
            }
            const baseNote=[12,10,8,10,12,10,8,7,12,11,9,10][state.melodyIndex%12];
            const shifted=((baseNote+state.rainbowOffset)%13+13)%13;
            playSmoothNote(shifted,state.currentInstrument);
            if(advance)advanceMelody();
            c.broken=true;
            c.brokenTimer=0;
            return;
        }
    }
}
export function resetCollisionMusicState(){
    state.rainbowProgress=0;state.rainbowCount=0;state.rainbowOffset=0;state.currentInstrument="piano";
    state.noteHoldCounter=0;state.noteHoldDuration=1;state.melodyIndex=0;
}
