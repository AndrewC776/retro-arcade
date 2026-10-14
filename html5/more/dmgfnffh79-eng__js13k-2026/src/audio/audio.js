let audioCtx=null;
export let musicEnabled=true;
export function initAudio(){
    if(audioCtx) return;
    audioCtx=new (window.AudioContext||window.webkitAudioContext)();
    const bufferSize=audioCtx.sampleRate*2;
    const buffer=audioCtx.createBuffer(1,bufferSize,audioCtx.sampleRate);
    const data=buffer.getChannelData(0);
    for(let i=0;i<bufferSize;i++) data[i]=Math.random()*2-1;
    const noise=audioCtx.createBufferSource(); noise.buffer=buffer; noise.loop=true;
    const filter=audioCtx.createBiquadFilter(); filter.type='lowpass'; filter.frequency.value=1000;
    const gain=audioCtx.createGain(); gain.gain.value=.03;
    noise.connect(filter).connect(gain).connect(audioCtx.destination); noise.start();
}
export function getAudioContext(){ return audioCtx; }
export function setMusicEnabled(v){ musicEnabled=v; }
