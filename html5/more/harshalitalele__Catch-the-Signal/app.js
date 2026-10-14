var gamebordDim = {
        width: 600,
        height: 600
    },
    playerDim = {
        height: 50,
        width: 50
    },
    antennaDim = {
        width: 10,
        height: 40
    },
    ymotion = gamebordDim.height - playerDim.height,
    x = 0,
    motionCenter = {
        y: gamebordDim.height,
        x: gamebordDim.width
    },
    radius = motionCenter.x - x,
    noOfAntennas = 6,
    characterSize = 100,
    characterObject,
    currentCharacterPosition = {},
    characterSwingLimit = 15,
    characterDirection = 1,
    checkProgress,
    allAntennas,
    greyLine = document.getElementById("grey-line"),
    redLine = document.getElementById("red-line"),
    score = 0,
    gameStarted = false;

function stopCheckingProgress() {
    clearInterval(checkProgress);
}

function initializeSizes() {
    var gameboard = document.getElementById("gameboard");
    gameboard.style.width = gamebordDim.width + "px";
    gameboard.style.height = gamebordDim.height + "px";
    gameboard.style.margin = "auto";
    
    var player = document.getElementById("player");
    player.style.width = playerDim.width + "px";
    player.style.height = playerDim.height + "px";
    characterObject = createCharacter();
    player.appendChild(characterObject);
    function keepCharacterInMotion() {
        var currentShift = currentCharacterPosition.y - parseFloat(characterObject.style.top);
        if(Math.abs(currentShift) > characterSwingLimit) {
            characterDirection *= -1;
        }
        characterObject.style.top = parseFloat(characterObject.style.top) - characterDirection + "px";
    }
    setInterval(keepCharacterInMotion, 20);
}

function shiftPlayer(x, y) {
    var player = document.getElementById("player");
    player.style.left = x + "px";
    player.style.top = y + "px";
}

function getRandomPosition(range) {
    return Math.random()*range;
}

function getCircularMotion(x) {
    var graphX = gamebordDim.width - x;
    return gamebordDim.height - Math.sqrt(radius * radius - graphX * graphX);
}

function movePlayer() {
    var player = document.getElementById("player");
    if(x < 5 || gamebordDim.width - x > radius) {
        x = gamebordDim.width - playerDim.width;
    }
    x = (x - 5) % gamebordDim.width;
    shiftPlayer(x, getCircularMotion(x));
}

function isPlayerInRange() {
    var playerInRange = false,
        playerRect = player.getClientRects()[0],
        antennaRect = {
            x: 0,
            y: 0,
            width: 0,
            height: 0
        };
    for(var antennaIndex in allAntennas) {
        var antenna = allAntennas[antennaIndex];
        antennaRect = antenna.antennaWrapper.getClientRects()[0];
        var xCoverage = playerRect.x > (antennaRect.x - playerRect.width) && playerRect.x < (antennaRect.x + antennaRect.width),
            yConverage = playerRect.y > (antennaRect.y - playerRect.height) && playerRect.y < (antennaRect.y + antennaRect.height);
        
        if(xCoverage && yConverage) {
            playerInRange = true;
            break;
        }
    }
    setProgressBar(playerInRange);
}

function setProgressBar(inRange) {
    var greylineWidth = parseInt(greyLine.style.width),
        redlineWidth = parseInt(redLine.style.width);
    if(inRange) {
        if(!greyLine.style.width) {
            greyLine.style.width = "85px";
        }
        greyLine.style.width = greylineWidth + 10 + "px";
        score++;
    } else {
        if(!redLine.style.width) {
            redLine.style.width = "0px";
        }
        redLine.style.width = redlineWidth + 4 + "px";
    }
    if(redlineWidth >= greylineWidth + 5) {
        var instruction = document.getElementById("instructions-board");
        instruction.innerHTML = "You lost! Refresh page to play again";
        instruction.style.display = "block";
        stopCheckingProgress();
    }
    if(redlineWidth/gameboard.getClientRects()[0].width > 0.75 || greylineWidth/gameboard.getClientRects()[0].width > 0.75) {
        redLine.style.width = redlineWidth/2 + "px";
        greyLine.style.width = greylineWidth/2 + "px";
        //stepup the level
        levelUp(1);
        score += 100;
    }
    document.getElementById("scoreboard").innerHTML = score;
}

initializeSizes();

function startGame(){
    if(!gameStarted) {
        var instructions = document.getElementById("instructions-board");
        instructions.style.display = "none";
        allAntennas = initializeBackground(noOfAntennas, gamebordDim.width, gamebordDim.height, antennaDim);
        setProgressBar(true);
        checkProgress = setInterval(isPlayerInRange, 100);
        gameStarted = true;
    }
}

function grabSignal(ev) {
    var relativePosition = ev.x - gameboard.getClientRects()[0].left;
    x = relativePosition;
    movePlayer();
}
