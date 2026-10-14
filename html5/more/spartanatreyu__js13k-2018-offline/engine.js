/*

This is the game engine script.

It handles initialization, draw loop, game loop and input

*/

const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'green';
const gameObjects = [];
let currentTime;

// Chain fine-tuned constants, none of these are based on real physics
// A chain 6 long will be ~200 pixels apart (35 x 6 = 210px)
// and sag half as far down when the two ends are together
const chainLengthMultiplier = 35;
const chainElasticity = 0.25;
const chainStiffness = 0.04;
const sagMultiplierNumerator = 5;

//the default game object
function entity(entityType, x, y, width, height)
{
	this.entityType = entityType; //float, draggable
	this.x = x || 0;
	this.y = y || 0;
	this.dx = 0;
	this.dy = 0;
	this.prevX = this.x;
	this.prevY = this.y;
	this.width = width || 50;
	this.height = height || 50;
	this.color = [Math.random() * 255, Math.random() * 255, Math.random() * 255];
	this.reference = gameObjects.push(this) - 1;
	window.console.log('entity added to game at: ' + this.x + ', ' + this.y);
	if(entityType === 'float')
	{
		this.dx = Math.random() - 0.5;
		this.dy = Math.random() - 0.5;
	}

	this.step = function(dt)
	{
		switch (this.entityType)
		{
		case 'draggable':
			if (this.isHeld === true)
			{
				this.prevX = this.x;
				this.prevY = this.y;
				this.dx = this.dragX - this.x;
				this.dy = this.dragY - this.y;
				// window.console.table([this.dx,this.dy,this.x,this.y,this.dragX,this.dragY]);
			}
			else
			{
				gravity(this,0.5);
			}
			lockToLevel(this);
			applyVelocity(this, 1);
			break;
		case 'placeable':
			this.prevX = this.x;
			this.prevY = this.y;
			if (this.isHeld === true)
			{
				this.dx = this.dragX - this.x;
				this.dy = this.dragY - this.y;
				// window.console.table([this.dragX,this.dragY,this.x,this.y, this.dx, this.dy]);
			}
			//
			//
			//
			//	IF I JUST ADD A LOT OF PORTS, OR MAKE EACH PLACEABLE SNAP TO THE NEAREST EMPTY PLACEABLE,
			//	I DON'T HAVE TO WORRY ABOUT GRAVITY ON A DANGLING CORD
			//
			//
			//
			applyVelocity(this, 1);
			lockToLevel(this);
			break;
		case 'follow':
			// follow(this, gameObjects[this.following], 0.5, 0.01);
			follow(this, gameObjects[this.following], 0.1, 0.01);
			gravity(this, 0.5);
			lockToLevel(this);
			applyVelocity(this, dt);
			break;
		case 'chain':
			chain(this, gameObjects[this.chainPrevious], gameObjects[this.chainNext], chainElasticity, chainStiffness);
			lockToLevel(this);
			applyVelocity(this, dt);
			break;
		case 'float':
		default:
			wrapAroundLevel(this);
			applyVelocity(this, dt);
			break;
		}
		this.prevX = this.x;
		this.prevY = this.y;
	};
	this.draw = function(dt)
	{
		ctx.fillStyle   = 'rgb('+this.color[0]+','+this.color[1]+','+this.color[2]+')';
		ctx.strokeStyle = 'rgb('+this.color[0]+','+this.color[1]+','+this.color[2]+')';
		ctx.lineWidth = 10;
		
		if(
			this.entityType === 'float'
			|| this.entityType === 'draggable'
			|| this.entityType === 'follow'
		)
		{
			ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
		}
		if (this.entityType === 'placeable')
		{
			// ctx.fillRect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
			ctx.beginPath();
			ctx.arc(this.x,this.y,this.width/2,0,Math.PI*2);
			ctx.fill();
			ctx.closePath();
			// if(this.chainLength)
			// {
			// 	ctx.fillStyle = 'red';
			// 	ctx.beginPath();
			// 	ctx.arc(this.x, this.y, this.chainLength * chainLengthMultiplier, 0, Math.PI * 2);
			// 	ctx.stroke();
			// 	ctx.closePath();
			// }
		}
		if (this.following)
		{
			// ctx.beginPath()
		}
		/*
		Smooth the paths later using something similar to this method:
		https://stackoverflow.com/questions/7054272/how-to-draw-smooth-curve-through-n-points-using-javascript-html5-canvas
		*/
		if (this.chainNext && this.chainPrevious === undefined)
		{
			ctx.beginPath();
			ctx.moveTo(this.x, this.y);
			let current = this;
			while(current.chainNext)
			{
				current = gameObjects[current.chainNext];
				ctx.lineTo(	current.x,current.y);
			}
			// ctx.lineTo(gameObjects[this.chainNext].x, gameObjects[this.chainNext].y);
			ctx.stroke();
			ctx.closePath();
		}
	};

	return this.reference;
}

//the game loop
function update(timestamp)
{
	//calculate time since last frame, time may go weird when switching tabs
	if(!currentTime)
	{
		currentTime = timestamp;
	}
	let deltaTime = timestamp - currentTime;

	ctx.clearRect(0,0,800,600);

	drawBoard();

	//loop through game objects here
	for (let loopIterator = 0; loopIterator < gameObjects.length; loopIterator++)
	{
		const currentObject = gameObjects[loopIterator];
		currentObject.step(deltaTime);
		currentObject.draw(deltaTime);
	}

	//reset timestamp and queue another frame
	currentTime = timestamp;
	window.requestAnimationFrame(update);
}

function createRope(x,y, ropeLength)
{
	window.console.group('creating rope');
	let ropePiecePrevious = new entity('draggable', x, y, 50, 50);
	let ropePiece;
	for (let ropeIterator = 0; ropeIterator < ropeLength; ropeIterator++)
	{
		ropePiece = new entity('follow', x, y, 25, 25);
		ropePiece.following = ropePiecePrevious.reference;
		ropePiecePrevious = ropePiece;
		window.console.log('length '+ropeIterator);
	}
	window.console.groupEnd('creating rope');
}

function createChain(x1,y1,x2,y2,chainLength)
{
	window.console.group('creating chain');
	const chainStart = new entity('placeable', x1, y1, 50, 50);
	const chainEnd = new entity('placeable', x2, y2, 50, 50);
	let chainLinkPrevious = chainStart;
	let chainLink;
	for (let chainIterator = 0; chainIterator < chainLength; chainIterator++)
	{
		window.console.log('link '+chainIterator);
		//Make the last chain link dragable
		if(chainIterator === chainLength-1)
		{
			chainLink = chainEnd;
		}
		//make new chain link
		else
		{
			//Todo: space the chain links between the two chain ends using linear interpolation (lerp function in utility.js)
			chainLink = new entity('chain', x1, y1, 25, 25);
		}

		//link that new chain link to the previous chain link
		chainLinkPrevious.chainNext = chainLink.reference;
		chainLink.chainPrevious = chainLinkPrevious.reference;
		
		//figure out how much the chain should sag based on chain length
		chainLink.chainLength = chainLength;
		chainLink.chainStart = chainStart.reference;
		chainLink.chainEnd = chainEnd.reference;

		//prepare for next chain link;
		chainLinkPrevious = chainLink;
	}

	//make sure references are on the chainStart object since it isn't in the above loop
	chainStart.chainLength = chainLength;
	chainStart.chainStart = chainStart.reference;
	chainStart.chainEnd = chainEnd.reference;


	window.console.groupEnd('creating chain');
}

createRope(300,300,5);
createChain(300,200,500,200,6);
createChain(200,100,600,100,12);

//create some game objects
new entity('float',      50, 100, 30, 30);
new entity('float',     400, 500, 30, 30);
new entity('float',     500, 550, 30, 30);
new entity('draggable',     200, 200, 50, 50);
window.console.log(gameObjects);
setupBoard();
nextLevel();
nextLevel();
nextLevel();
nextLevel();
window.console.log(board);

//kick off the update loop now
window.requestAnimationFrame(update);