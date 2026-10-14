
//Variable
var mapWidth = 30;
var mapHeight = 30;
var tileWidth = 32;
var tileHeight = 32;
var gameState = 0;

//Resource---------------------------------------
var font = new Image();
var fontLoaded = false;

font.onload = function () {
	fontLoaded = true;
};

var asset = new Image();
var assetLoaded = false;

asset.onload = function () {
	assetLoaded = true;
};

font.src = 'asset/font.png';
asset.src = 'asset/games.png';

//Canvas----------------------------------------- 
var canvas;
var ctx;

function start()
{
	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");

	ctx.scale(2,2);
	
	render();
}

//Game Logic-------------------------------------
function render() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	// drawing code
	if(assetLoaded && fontLoaded)
	{
		if(gameState == 0)
		{
			drawTitle();
		}
		else if(gameState == 1)
		{
			drawPrologue();
		}
		else if(gameState == 2)
		{
			drawMap();
			drawPlayer();
			
			drawShadow();
			drawText();
		}
		else if(gameState == 3)
		{
			drawGameOver();
		}
	}
	
	requestAnimationFrame(render);
}

//-----------------------------------------------
function drawMap()
{
	//Adjust camera position
	var reduceX = Player.posX*tileWidth - 160;
	var reduceY = Player.posY*tileHeight - 160;
	
	for(var i=0;i<map.length;i++)
	{
		var id = Player.tempMap[i] - 1;
		
		if(id >= 0)
		{
			var posX = (i%mapWidth) * tileWidth - reduceX;
			var posY = Math.floor(i/mapHeight) * tileHeight - reduceY;
			
			var assetX = (id%4)*tileWidth;
			var assetY = Math.floor(id/4)*tileHeight;
			
			ctx.drawImage(asset,assetX,assetY,tileWidth,tileHeight,posX,posY,tileWidth,tileHeight);
		}
	}
	
	for(var i=0;i<item.length;i++)
	{
		var id = Player.tempItem[i] - 1;
		
		if(id >= 0)
		{
			var posX = (i%mapWidth) * tileWidth - reduceX;
			var posY = Math.floor(i/mapHeight) * tileHeight - reduceY;
			
			var assetX = (id%4)*tileWidth;
			var assetY = Math.floor(id/4)*tileHeight;
			
			ctx.drawImage(asset,assetX,assetY,tileWidth,tileHeight,posX,posY,tileWidth,tileHeight);
		}
	}
}

function drawPlayer()
{
	//Adjust camera position
	var reduceX = Player.posX*tileWidth - 160;
	var reduceY = Player.posY*tileHeight - 160;
	
	var posX = Player.posX*tileWidth - reduceX;
	var posY = Player.posY*tileHeight - reduceY;
	
	ctx.drawImage(asset, 0, 0, tileWidth, tileHeight, posX, posY, tileWidth, tileHeight);
}

function drawText()
{
	ctx.drawImage(asset, 3*tileWidth, 1*tileHeight, tileWidth, tileHeight, 9*tileWidth, 0, tileWidth, tileHeight);
	ctx.drawImage(asset, 3*tileWidth, 2*tileHeight, tileWidth, tileHeight, 7*tileWidth, 0, tileWidth, tileHeight);
	ctx.drawImage(asset, 0*tileWidth, 2*tileHeight, tileWidth, tileHeight, 0, 0*tileHeight, tileWidth, tileHeight);
	
	Font.drawText(""+Player.mainKey, 10*tileWidth, 0*tileHeight+8);
	Font.drawText(""+Player.key, 8*tileWidth, 0*tileHeight+8);
	Font.drawText(""+Player.life, 1*tileWidth, 0*tileHeight+8);
}

function drawShadow()
{
	ctx.globalAlpha = 1;
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, 352, 32);
	ctx.fillRect(0, 320, 352, 32);
	ctx.fillRect(0, 0, 32, 352);
	ctx.fillRect(320, 0, 32, 352);
	
	ctx.globalAlpha = 0.75;
	ctx.fillRect(32, 32, 288, 32);
	ctx.fillRect(32, 288, 288, 32);
	ctx.fillRect(32, 32, 32, 288);
	ctx.fillRect(288, 32, 32, 288);
	
	ctx.globalAlpha = 0.5;
	ctx.fillRect(64, 64, 224, 32);
	ctx.fillRect(64, 256, 224, 32);
	ctx.fillRect(64, 64, 32, 224);
	ctx.fillRect(256, 64, 32, 224);
	
	ctx.globalAlpha = 0.25;
	ctx.fillRect(96, 96, 160, 32);
	ctx.fillRect(96, 224, 160, 32);
	ctx.fillRect(96, 96, 32, 160);
	ctx.fillRect(224, 96, 32, 160);
	
	ctx.globalAlpha = 1;
}

function checkCollision(posX, posY, dirX, dirY)
{
	var isCollide = true;
	
	var idx = (posX + dirX) + (posY*30 + (dirY*30));
	
	if(Player.tempMap[idx] == 2) isCollide = false;
	
	if(Player.tempItem[idx] == 12) //Key
	{
		keySfx.play();
		
		Player.key++;
		Player.tempItem[idx] = 0;
	}
	else if(Player.tempItem[idx] == 8) //Mainkey
	{
		keySfx.play();
		
		Player.mainKey++;
		Player.tempItem[idx] = 0;
	}
	else if(Player.tempItem[idx] == 10) //Door
	{
		if(Player.key > 0)
		{
			doorSfx.play();
		
			Player.key--;
			Player.tempItem[idx] = 0;
		}
		else 
		{
			lockedSfx.play();
		
			isCollide = false;
		}
	}	
	else if(Player.tempItem[idx] == 6) //Main Door Locked
	{
		if(Player.mainKey > 0)
		{
			doorSfx.play();
		
			Player.mainKey--;
			Player.tempItem[idx] = 7;
		
			isCollide = false;
		}
		else 
		{
			lockedSfx.play();
		
			isCollide = false;
		}
	}
	else if(Player.tempItem[idx] == 7) //Main Door Opened 
	{
		gameState = 3;
			
		sequence.stop();
	}
	
	return isCollide;
}

function drawTitle()
{
	Font.drawText("a king's journey", 1.5*tileWidth, 1*tileHeight+8);
	Font.drawText("chapter 3:", 3*tileWidth, 3*tileHeight+8);
	Font.drawText("trapped & poisoned", 1*tileWidth, 4*tileHeight+8);
	
	ctx.drawImage(asset, 0, 0, tileWidth, tileHeight, 5*tileWidth, 6.5*tileHeight, tileWidth, tileHeight);
	
	Font.drawText("press space", 3*tileWidth, 9*tileHeight+8);
	Font.drawText("to continue", 3*tileWidth, 10*tileHeight+8);
}

function drawPrologue()
{
	Font.drawText("after poisoned by", 1*tileWidth, 0*tileHeight+8);
	Font.drawText("the chancellor, you", 1*tileWidth, 1*tileHeight+8);
	Font.drawText("are thrown to the", 1*tileWidth, 2*tileHeight+8);
	Font.drawText("dungeon.", 1*tileWidth, 3*tileHeight+8);
	
	Font.drawText("you need to move", 1*tileWidth, 4*tileHeight+8);
	Font.drawText("fast to escape", 1*tileWidth, 5*tileHeight+8);
	Font.drawText("before succumbing", 1*tileWidth, 6*tileHeight+8);
	Font.drawText("to death.", 1*tileWidth, 7*tileHeight+8);
	
	Font.drawText("press space", 3*tileWidth, 9*tileHeight+8);
	Font.drawText("to continue", 3*tileWidth, 10*tileHeight+8);
}

function drawGameOver()
{
	if(Player.life <= 0)
	{
		Font.drawText("the end", 3*tileWidth, 9*tileHeight+8);
	
		Font.drawText("alas, the poison", 1.5*tileWidth, 4*tileHeight+8);
		Font.drawText("has killed you...", 1.5*tileWidth, 5*tileHeight+8);
	}
	else
	{
		Font.drawText("to be continued...", 1*tileWidth, 9*tileHeight+8);
	
		Font.drawText("you finally found", 1.5*tileWidth, 3*tileHeight+8);
		Font.drawText("the way out.", 1.5*tileWidth, 4*tileHeight+8);
		Font.drawText("it's time to get", 1.5*tileWidth, 5*tileHeight+8);
		Font.drawText("revenge!", 1.5*tileWidth, 6*tileHeight+8);
	}
}

//Control--------------------------------------
function keyDownHandler(e) {
	if(gameState == 0)
	{
		if(e.keyCode == 13 || e.keyCode == 32)
		{
			gameState = 1;
		}
	}
	else if(gameState == 1)
	{
		if(e.keyCode == 13 || e.keyCode == 32)
		{
			gameState = 2;
			
			sequence.play();	
		}
	}
	else if(gameState == 2)
	{
		if(e.keyCode == 39) //Right
		{
			var result = checkCollision(Player.posX, Player.posY, 1, 0);
			if(result) Player.posX++;
		}
		else if(e.keyCode == 37) //Left
		{
			var result = checkCollision(Player.posX, Player.posY, -1, 0);
			if(result) Player.posX--;
		}
		else if(e.keyCode == 38) //Up
		{
			var result = checkCollision(Player.posX, Player.posY, 0, -1);
			if(result) Player.posY--;
		}
		else if(e.keyCode == 40) //Down
		{
			var result = checkCollision(Player.posX, Player.posY, 0, 1);
			if(result) Player.posY++;
		}
		
		if(result)
		{
			Player.life--;
			stepSfx.play();
			
			if(Player.life <= 0)
			{
				gameState = 3;
				
				sequence.stop();
			}
		}
	}
	else if(gameState == 3)
	{
		if(e.keyCode == 13 || e.keyCode == 32)
		{
			Player.init();
			
			gameState = 0;
		}
	}		
}
document.addEventListener("keydown", keyDownHandler, false);

//Music
var ac = new AudioContext();
var tempo = 60;
var sequence = new TinyMusic.Sequence( ac, tempo, [
  '-   e',
    'Bb3 e',
    'A3  e',
    'Bb3 e',
    'G3  e',
    'A3  e',
    'F3  e',
    'G3  e',

    'E3  e',
    'F3  e',
    'G3  e',
    'F3  e',
    'E3  e',
    'F3  e',
    'D3  q',

    '-   e',
    'D4  s',
    'C4  s',
    'D4  e',
    'Bb3 e',
    'C4  e',
    'Bb3 e',
    'A3  e',
    'Bb3 e',

    'G3  e',
    'A3  e',
    'Bb3 e',
    'A3  e',
    'G3  s',
    'A3  s',
    'G3  e',
    'F3  q'
]);
sequence.loop = true;
sequence.gain.gain.value = 0.25; 
