
InitailLoopDict=(k,initialValue)=>{
    for (const i in k)k[i]=initialValue
    return k
}

WaitClickPlayMusic=_=>{
    if(!INKEYIN){
        playChord()
        INKEYIN=1
    }
}

ClickWindowToKeyIn=x=>{
    if(movementIndex)return
    if(x>halfW/2){
        touch(0)
        play(0)
    }else{
        play(1)
        touch(1)
    }
}

onblur=e=>{
    Pause = 1
    stopChord()
}
onfocus=e=>{
    Pause = 0
    keepPlayChord()
}

onmousedown=e=>{

    if(!e.button){
        // let x= e.clientX - mouseCanvas.left
        // ClickWindowToKeyIn(x)
        // console.log(x)
        if(previousPlayerPos!=null&&previousPlayerPos.lives<=0&&INKEYIN){
            initial()
            INKEYIN = 0
        }
    }
}

onmouseup=e=>{
    !e.button?key=InitailLoopDict(key,0):0
}

ontouchstart=e=>{

    var x = e.changedTouches[0].pageX;

    ClickWindowToKeyIn(x)

    if(previousPlayerPos!=null&&previousPlayerPos.lives<=0&&INKEYIN){
        INKEYIN = 0
        initial()
    }

}

ontouchend=e=>{
}

// p:pause , R:restart 
onkeydown=e=>{
    let i = e.key

    if(i=='a'||i=='z'){
        play(1)
        touch(1)
    }else if(i=='s'||i=='x'){
        touch(0)
        play(0)
    }

    if(i=='r'){
        INKEYIN = 0
        initial()
    }

    if(i=='p'&& INKEYIN){
        if(Pause){
            Pause = 0
            keepPlayChord()
        }else{
            Pause = 1
            stopChord()
        }
    }
}
onkeyup=e=>{

}

canvas.addEventListener('click',WaitClickPlayMusic)