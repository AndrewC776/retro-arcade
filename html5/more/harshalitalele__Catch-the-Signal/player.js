var initiatePlayer = (function() {
    var mario,
        allAntennas,
        gameboard,
        greyLine = document.getElementById("grey-line"),
        redLine = document.getElementById("red-line"),
        marioPosition = 0,
        checkProgress = null,
        score = 0;
    
    function stopCheckingProgress() {
        clearInterval(checkProgress);
    }
    
    function setProgressBar(inRange) {
        var greylineWidth = parseInt(greyLine.style.width),
            redlineWidth = parseInt(redLine.style.width);
        if(inRange) {
            if(!greyLine.style.width) {
                greyLine.style.width = "35px";
            }
            greyLine.style.width = greylineWidth + 10 + "px";
        } else {
            if(!redLine.style.width) {
                redLine.style.width = "0px";
            }
            redLine.style.width = redlineWidth + 2 + "px";
        }
        if(redlineWidth >= greylineWidth + 5) {
            alert("You lost! Refresh page to play again");
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
    
    function createMario() {
        var marioElement = document.createElement("canvas"),
            marioContext = marioElement.getContext("2d");
        marioElement.setAttribute("id", "mario");
        marioElement.width = 50;
        marioElement.height = 50;
        marioContext.arc(25, 25, 25, 2*Math.PI, 0);
        marioContext.stroke();
        mario = marioElement;
    }
    
    function showMario() {
        if(!mario) {
            createMario();
        }
        mario.style.position = "absolute";
        mario.style.top = "25px";
        mario.style.left = "500px";
        document.body.appendChild(mario);
    }
    var checkCnt = 0;
    function isMarioInRange() {
        var marioInRange = false,
            marioTopleft = marioPosition - 25 - gameboard.getClientRects()[0].x;
        for(var antennaIndex in allAntennas) {
            var antenna = allAntennas[antennaIndex];
            if(antenna.range.y2 >= 25 && antenna.range.y1 <= 75 && marioTopleft >= (antenna.range.x1 - 50) && marioTopleft <= antenna.range.x2) {
                marioInRange = true;
                score++;
                break;
            }
               
        }
        setProgressBar(marioInRange);
        document.title = marioInRange;
    }
    
    var marioRange = document.createElement("div");
    
    function attachMovements() {
        gameboard.addEventListener("mousemove", function(event) {
            mario.style.left = event.x - 25 + "px";
            marioPosition = event.x;
            marioRange.style.position = "absolute";
            marioRange.style.left = event.x - 25 + "px";
            marioRange.style.top = "25px";
            marioRange.style.border = "1px solid red";
            marioRange.style.width = "50px";
            marioRange.style.height = "50px";
            gameboard.appendChild(marioRange);
        });
    }
    
    return function(antennas, baseElement) {
        allAntennas = antennas;
        gameboard = baseElement;
        showMario();
        attachMovements();
        setProgressBar(true);
        checkProgress = setInterval(isMarioInRange, 100);
    };
}());