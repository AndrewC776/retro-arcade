//apply changes in velocity to position
function applyVelocity(gameObject, dt)
{
	gameObject.x += gameObject.dx * dt;
	gameObject.y += gameObject.dy * dt;
}

//apply gravity to a game object
function gravity(gameObject, mass)
{
	//gravity
	gameObject.dy += mass || 0.01;
	//add sideways friction when touching the ground
	if (gameObject.y > 600 - gameObject.height / 2) gameObject.dx *= 0.8;
}

//prevent a game object from leaving the level's bounds
function lockToLevel(gameObject)
{
	if (gameObject.x + gameObject.width  / 2 > 800){ gameObject.x = 800 - gameObject.width  / 2; gameObject.dx = 0;}
	if (gameObject.x - gameObject.width  / 2 < 0  ){ gameObject.x = 0   + gameObject.width  / 2; gameObject.dx = 0;}
	if (gameObject.y + gameObject.height / 2 > 600){ gameObject.y = 600 - gameObject.height / 2; gameObject.dy = 0;}
	if (gameObject.y - gameObject.height / 2 < 0  ){ gameObject.y = 0   + gameObject.height / 2; gameObject.dy = 0;}
}

//wrap a game object around the other side of a level's bounds
function wrapAroundLevel(gameObject)
{
	if (gameObject.x > 800) gameObject.x = 0;
	if (gameObject.x < 0  ) gameObject.x = 800;
	if (gameObject.y > 600) gameObject.y = 0;
	if (gameObject.y < 0  ) gameObject.y = 600;
}

function follow(gameObject, gameObjectToFollow, elasticity, stiffness)
{
	gameObject.dx *= elasticity || 0.5; 
	gameObject.dy *= elasticity || 0.5;

	gameObject.dx += (gameObjectToFollow.x - gameObject.x) * (stiffness || 0.01);
	gameObject.dy += (gameObjectToFollow.y - gameObject.y) * (stiffness || 0.01);
}

function chain(gameObject, chainPrevious, chainNext, elasticity, stiffness)
{
	gameObject.dx *= elasticity || 0.5;
	gameObject.dy *= elasticity || 0.5;

	gameObject.dx += ((chainPrevious.x - gameObject.x) + (chainNext.x - gameObject.x)) * (stiffness || 0.01);
	gameObject.dy += ((chainPrevious.y - gameObject.y) + (chainNext.y - gameObject.y)) * (stiffness || 0.01);


	let chainStart = gameObjects[gameObject.chainStart];
	let chainEnd = gameObjects[gameObject.chainEnd];
	
	//find the distance between the two ends of the chain using pythagorean theorem
	let chainLengthDistance = Math.sqrt(Math.pow(Math.abs(chainStart.x - chainEnd.x), 2) + Math.pow(Math.abs(chainStart.y - chainEnd.y), 2));
	let chainLengthMaxDistance = chainStart.chainLength * chainLengthMultiplier;

	//find gravity sag of wire based on distance
	let sag = 1 - (chainLengthDistance / chainLengthMaxDistance);
	sag *= (sagMultiplierNumerator / chainStart.chainLength);
	sag = Math.max(sag,0);
	sag = Math.min(sag,1);
	gameObject.dy += sag;

	//add sideways friction when touching the ground
	if (gameObject.y > 600 - gameObject.height / 2) gameObject.dx *= 0.8;
}