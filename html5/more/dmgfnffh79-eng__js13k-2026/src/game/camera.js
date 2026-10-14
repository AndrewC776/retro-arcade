import { state, addWorldY, setWorldY } from "../state.js";
import { H, lerp } from "../core.js";

export function updateCamera(){
    const target=H*.43;
    if(state.player.y<target){
        const diff=target-state.player.y;
        state.player.y=target;
        addWorldY(diff);
    }
    if(state.player.vy>0&&state.player.y>H*.55){
        setWorldY(lerp(state.worldY,0,.025));
    }
}
