
// Game initial 
const initial = _ =>{
    const curH = halfH/size/2
    const curW = halfW/size/2
    Camera.pos = initialXY
    ExplainBoard.showTime.set(0,3,.01)
    Pause= showTurialView = 0  
    gameObject = [Camera]
    mapLayer = []
    notesObject = []
    level = 1
    // map layer
    for(var j =0;j<=curH+2;j++){
        const temp = []
        for(var i =0;i<=curW+2;i++){

            const pos = reXY(i*size,j*size)

            const tMap = generateTilemap(pos)

            temp.push(tMap)
        }
        mapLayer.push(temp) 
    }
    // const temp = clone(Line)
    // temp.pos = set({x:128,y:128})
    //generatePath(gameObject,temp,128,64,2)
    const StartPlacement = generatePlacement(reXY(128,quH))
    Player.lives = 5
    Player.pos = reXY(128,quH)
    
    Player.lines = [findNodes(StartPlacement)]
    appendItem(gameObject,Player)
    appendItem(gameObject,StartPlacement)
    
    nextLevel(level)
}

// next level create notes 
const nextLevel = level =>{
    
    //console.log("Next level",level)
    
    barWidthSizeCount = 8 *level

    for(var i=0;i<8*level;i++){

        const notes = clone(Note)
        notes.frameIndex = randIntBetween(0,1)
        notes.AnimationTime.set(0,i*100,randIntBetween(2,4))
        notes.score = floor(100/(8*level))
        notes.level = min(level*.8,2)
        
        notesObject.push(notes)

    }
    gameObject.sort((a, b) => {
        return a.type.localeCompare(b.type)
    });
}

// camera position and player 
let centerPos = clone(Basic)
let previousPlayerPos

const render = s =>{
    mapRate = [max(.5,.6-level*.01),.2,min(.1,.03*level),min(level*.03,.2)]
    enemyRate = [
        max(.05,.4-level*.5),
        max(.2,.4-level*.1),
        min(.4,.2+level*.1),
        min(.3,.1+level*.05),
        min(.2,0+level*.05),
    ]
    // set camera move
    if(previousPlayerPos&&Camera){
        
        centerPos.pos = reXY(halfW/8,halfH/7)
        centerPos.pos = substract(centerPos.pos,Camera.pos)

        Camera.vpos = set(previousPlayerPos.pos)
        ctx.translate(centerPos.pos.x|0, centerPos.pos.y|0);
    }

    // map genrate
    mapLayer.forEach(e=>{
        
        // Y++
        if(substract(Camera.pos,e[0].pos).y>halfH/4.4 && movementIndex){
            const temp =[]

            e.forEach(k=>{
                const lastX = mapLayer.length-1

                const tMap = generateTilemap(reXY(k.pos.x,mapLayer[lastX][0].pos.y+32),mapRate)

                temp.push(tMap)
            })
            mapLayer.shift()
            mapLayer.push(temp)
        }
        // Y--
        if(substract(e[mapLayer.length-1].pos,Camera.pos).y>halfH/2.5 && movementIndex){
            const temp =[]

            e.forEach(k=>{
                
                const tMap = generateTilemap(reXY(k.pos.x,mapLayer[0][0].pos.y-32),mapRate)

                temp.push(tMap)
            })
            mapLayer.splice(-1)
            mapLayer.unshift(temp)
        }
        // draw 
        e.forEach((k,j)=>{

            k.render()

            if(substract(Camera.pos,k.pos).x > halfW/5){
                
                const lastX = e.length-1
                const tMap = generateTilemap(reXY(e[lastX].pos.x+32,k.pos.y),mapRate)

                e.push(tMap)
                e.splice(j,1)
            }
        })
    })

    gameObject.forEach(e=>{
        if(e.mainFrame==playerPng){
            
            if(movementIndex && addScore){
                e.score += max(score,0)
                
                if(score>=70){
                    e.lives = min(e.lives+1,12)
                }
                addScore=0
            }

            previousPlayerPos = clone(e)

            if(movementIndex){
                
                //console.log("Player score",previousPlayerPos.score)
                gameObject.forEach(j=>{
                    if(j.pos.x<=e.pos.x+5&&j.pos.x>=e.pos.x-5
                        &&j.pos.y<=e.pos.y+5&&j.pos.y>=e.pos.y-5
                        &&j.type=='Node'){
                        
                        const checkOnePoint = findNodes(j)
                        
                        if(checkOnePoint){
                            j.remove()
                            e.lines=[checkOnePoint]
                            movementIndex = 0
                            addScore=1
                            score = 0
                            level+=0.5
                            nextLevel(level)
                        }else{
                            e.lines= j.lines
                        }
                    }
                    if(j.pos.x<=e.pos.x+20&&j.pos.x>=e.pos.x-20
                        &&j.pos.y<=e.pos.y+10&&j.pos.y>=e.pos.y-10
                        &&j.type=='Znemy'){
                        
                        e.lives = min(e.lives+j.ack,12)
                        
                        if(e.lives<=0){

                            previousPlayerPos = clone(e)
                            e.remove()
                        }else{

                            j.remove()

                        }

                    }
                })
            }
        }
        if(substract(Camera.pos,e.pos).x > quW){
            e.remove()
        }
        e.update(s)
        e.render()
    })
    
}
const touch = rORl =>{
    if(!showTurialView)return;
    if(!notesObject.length)return;

    let findLastNotes = 0
    let minValue = 99999
    notesObject.forEach((e,index)=>{
        const dist = distance(Aim.pos,e.pos)
        if(dist<minValue&&!e.disable){
            minValue=dist
            findLastNotes = index
        }
    })
    Aim.initial()
    Aim.nameIndex = 1
    const notesIndex = notesObject[findLastNotes]
    if(!notesIndex.disable){
        if(collisionRect(Aim.pos,Aim.wh,notesIndex.pos,notesIndex.wh)&&notesIndex.frameIndex==rORl){

            score += notesIndex.score
            Aim.nameIndex = 0

        }
        score = max(score,0)
    }
    notesIndex.disable = 1

}
const notesrender = s => {
    //console.log("note move",notesObject)

    notesObject.forEach(e=>{

        e.update(s)
        
        if(substract(Aim.pos,e.pos).x>50){
            
            // score -= e.disable?0:e.score
            // previousPlayerPos.score -= e.disable?0:e.score
            e.disable = 1 
        }
        if(e.pos.y>halfH/2&&e.pos.x<=40){
            e.remove()
        }
        e.render()
    })
}

mouseCanvas = canvas.getBoundingClientRect();
// start game
const loop = _ =>{
    
    //game timer
    const now = timer.now();
    const deltaMs = now - second;
    const delta = deltaMs / 1000;
    second = now;

    // resize window 
    canvas.width = 1024
    canvas.height = 800
    
    ctx.clearRect(0,0,halfW,halfH)

    const hw = halfW/2
    
    // game start view
    // start View INKEYIN = 1  > start when click anywhere
    if(!INKEYIN){

        StartClick.render(delta)

    }else{
        // main game loop
        if(!Pause){
            canvasSave()
            canvasScale(2)
            render(delta)
            canvasRestore()
            if(previousPlayerPos.lives<=0){
                EndView.render(delta)
            }

            if(!showTurialView){

                ExplainBoard.render(delta)

            }else{
                canvasScale(2)

                if(!movementIndex){

                    // UI and Note View 
                    //stopChord()
                    canvasSave()
                    
                    canvasFillStyle("#92535e")

                    // upper bar
                    const notesCurrentIsEnable = max(0,barWidthSizeCount - (notesObject.filter(e =>e.disable==0).length))
                    const normWidth = barWidthSizeCount?hw/barWidthSizeCount:0

                    ctx.fillRect(0,0,hw-(notesCurrentIsEnable*normWidth),5)
                    
                    const centerW = quW
                    const centerH = halfH/2
                    const radiusY = 120

                    canvasAlpha(.5)
                    
                    ctx.fillRect(0,centerH-radiusY-20,halfW,radiusY+20)
                    
                    canvasAlpha(1)

                    ctx.setLineDash([9])
                    ctx.beginPath()
                    ctx.ellipse(centerW, centerH, centerW, radiusY, 0, PI, 2 * PI);
                    ctx.stroke()
                    ctx.closePath()
                    ctx.beginPath()
                    ctx.ellipse(centerW, centerH, centerW-55, radiusY-40, 0,PI, 2 * PI);
                    ctx.stroke()
                    ctx.closePath()

                    notesrender(delta)
                    //ctx.beginPath()
                    //canvasstrokeStyle("#FFF")
                    //ctx.strokeRect(centerW-25,centerH-radiusY-5,50,50)
                    //canvasStroke()
                    Aim.render()
                    Turtle.update(delta)
                    Turtle.render()
                }

                // UI Board  "SCOPE",
                const board = ["POUTE"]
                
                for(var i=0;i<12;i++){
                    const pos = reXY(i*size,8)
                    const wh = reXY(size,size)
                    if(previousPlayerPos.lives>i){
                        canvasDraw(heartsPng[0],pos,wh)
                    }else{
                        canvasDraw(heartsBlackPng[0],pos,wh)
                    }
                }
                //DrawText(board,A2ZTile[3],A2ZTile[4],initialXY,reXY(12),5)
                board.forEach((e,j)=>{
                    for(var i=0;i<e.length;i++){
                        let pos = reXY(5+i*16-2,60+40*j-2)
                        const wh = reXY(12,12)
                        const asciiCode = e[i].charCodeAt(0)-65
                        canvasDraw(A2ZTile[3][asciiCode],pos,wh)
                        pos = reXY(5+i*16,60+40*j)
                        canvasDraw(A2ZTile[4][asciiCode],pos,wh)
                    }
                })

                // let text =  Pad(IntToString(floor(max(previousPlayerPos.score,0))))
                // let wh = reXY(12,12)
                // for(var l=0;l<text.length;l++){
                //     let pos = reXY(10+l*upTileGap,56)
                //     canvasDraw(numberTile[3][text[l].charCodeAt(0)-48],pos,wh)
                //     pos = reXY(10+l*upTileGap-2,56-2)
                //     canvasDraw(numberTile[0][text[l].charCodeAt(0)-48],pos,wh)
                // }

                let text =  Pad(IntToString(floor(max(score,0))))
                let wh = reXY(12,12)
                for(var l=0;l<text.length;l++){
                    let pos = reXY(upTileGap+l*upTileGap,80)
                    canvasDraw(numberTile[3][text[l].charCodeAt(0)-48],pos,wh)
                    pos = reXY(upTileGap+l*upTileGap-2,80-2)
                    canvasDraw(numberTile[0][text[l].charCodeAt(0)-48],pos,wh)
                }

                canvasRestore()
                // Player start to move
                if(!notesObject.length){
                    movementIndex=1
                }
            }
        }else{
            PauseView.render(delta)
        }
    }
    // --------

    requestAnimationFrame(loop)
}


initial()

loop()