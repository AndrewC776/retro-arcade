function createCharacter() {
    var charElem = document.createElement("canvas"),
        charContext = charElem.getContext("2d"),
        charStyle = charElem.style;
    
    //Styling character element below
    charElem.width = characterSize;
    charElem.height = characterSize;
    charStyle.width = characterSize + "px";
    charStyle.height = characterSize + "px";
    charStyle.position = "absolute";    
    charStyle.top = "25px";
    charStyle.left = "10px";
    charStyle.zIndex = "99";
    //charStyle.backgroundColor = "pink";
    currentCharacterPosition.x = 10;
    currentCharacterPosition.y = 25;
    
    //Character canvas sketch below
    var headRadius = characterSize*5/24,
        headX = headRadius,
        headY = headRadius,
        headElongation = characterSize*2/24,
        dressX = characterSize*2/3,
        dressY = dressX,
        dressBottomSlope = (dressY-2*headY)/(dressX-headX),
        dressTopSlope = (2*headY-dressY+headElongation)/(headX-headElongation-dressX),
        legLength = characterSize/5,
        handLength = characterSize/5,
        eyeLocationX = 15,
        eyeRadius = 2;
        /*braidRadius = characterSize/25,
        braidStartX = 2*headX+headElongation-braidRadius,
        braidStartY = headY;*/
    
    charContext.beginPath();
    charContext.arc(headX,headY,headRadius,Math.PI/2,Math.PI*3/2);
    charContext.lineTo(headX+headElongation, 0);
    charContext.arc(headX+headElongation,headY,headRadius,Math.PI*3/2,Math.PI/2);
    charContext.lineTo(headX, 2*headY);
    charContext.fillStyle = "yellow";
    
    //dress
    charContext.lineTo(dressX, dressY);
    charContext.lineTo(dressX+2*headElongation, dressY-headElongation);
    charContext.lineTo(headX+headElongation,2*headY);
    charContext.moveTo(dressX, dressY);
    
    charContext.fill();
    
    //legs
    charContext.lineTo(dressX + legLength, legLength * dressBottomSlope + dressY);    
    charContext.moveTo(dressX+2*headElongation, dressY-headElongation);
    charContext.lineTo(dressX+2*headElongation+legLength-10, (legLength-10) * dressTopSlope + dressY - headElongation);
    charContext.moveTo(headX, 2*headY);
    
    //hands
    charContext.lineTo(headX-handLength, 2*headY);
    charContext.moveTo(headX+headElongation, 2*headY);
    charContext.lineTo(headX+2*handLength, 2*headY+5);
    
    //braid
    /*charContext.moveTo(braidStartX, braidStartY);
    charContext.arc(braidStartX+braidRadius, headY,braidRadius,Math.PI,Math.PI*2);
    charContext.arc(braidStartX+3*braidRadius, headY,braidRadius,Math.PI,0, true);
    
    charContext.moveTo(braidStartX, braidStartY);
    charContext.arc(braidStartX+braidRadius, headY,braidRadius,Math.PI,Math.PI*2);
    charContext.arc(braidStartX+3*braidRadius, headY+5,braidRadius,Math.PI,0, true);
    
    charContext.moveTo(braidStartX, braidStartY);
    charContext.arc(braidStartX+braidRadius, headY,braidRadius,Math.PI,Math.PI*2);
    charContext.arc(braidStartX+3*braidRadius, headY+10,braidRadius,Math.PI,0, true);*/
    
    //eyes
    charContext.moveTo(headX-eyeLocationX+eyeRadius, headY);
    charContext.arc(headX-eyeLocationX,headY,eyeRadius,0,Math.PI*2);
    
    charContext.stroke();
    
    return charElem;
}

