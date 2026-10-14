import { state } from "../state.js";

export function updateUI(){
    document.getElementById("score").textContent="云朵："+state.score;
}
export function updateRainbow(){
    const count=state.rainbowCount;
    document.querySelectorAll(".color").forEach((d,i)=>d.classList.toggle("active",i<count));
}
