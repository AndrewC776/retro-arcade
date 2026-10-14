//input loop
let mouseHeld = false;
let objectSelected = null;
let selectionRadius = 30; // in canvas pixels
let dragBounded = null; // reference to other side of chain, if object selected is the start of a chain

canvas.addEventListener('mousedown', mousedown);
canvas.addEventListener('mousemove', mousemove);
canvas.addEventListener('mouseup', mouseup);

function mousedown(e) {
	mouseHeld = true;
	window.console.log('click at: ' + e.offsetX + ', ' + e.offsetY);

	//when checking for a click, loop through all objects comparing the click location with each object's location.
	//loop through game objects here
	for (let loopIterator = 0; loopIterator < gameObjects.length; loopIterator++) {
		const currentObject = gameObjects[loopIterator];
		// window.console.log('checking ' + loopIterator);
		if (currentObject.entityType === 'draggable' || currentObject.entityType === 'placeable') {
			//TODO: Extend this if statement so clicking will not move an entity if it's part of a chain that's already as stretched as it can be
			if (Math.abs(currentObject.x - e.offsetX) < selectionRadius &&
				Math.abs(currentObject.y - e.offsetY) < selectionRadius)
				{
				objectSelected = loopIterator;
				currentObject.isHeld = true;
				currentObject.dragX = e.offsetX;
				currentObject.dragY = e.offsetY;
				// window.console.log('Entity: "' + objectSelected + '" is draggable.');

				//check if the object is the end of a chain and if so, find out how far the object can be dragged away from it
				if (currentObject.chainStart === objectSelected){dragBounded = currentObject.chainEnd;}
				if (currentObject.chainEnd === objectSelected){dragBounded = currentObject.chainStart;}
				//When a match is found, stop searching the loop so we only have one object selected
				break;
			}
		}
	}
}

function mousemove(e) {
	//move the selected object towards the offset
	if (mouseHeld === true && objectSelected !== null)
	{
		let offsetX = e.offsetX;
		let offsetY = e.offsetY;
		
		//override offsetX and offsetY if there is moving a chain
		
		let maxDraggableDistance = null;
		if(dragBounded !== null)
		{
			maxDraggableDistance = gameObjects[objectSelected].chainLength * chainLengthMultiplier;
			// window.console.log('max drag distance = '+maxDraggableDistance);

			// Move this block into utility? (repeated in phyiscs.js)
			// start block
			let chainStart = gameObjects[gameObjects[objectSelected].chainStart];
			let chainEnd = gameObjects[gameObjects[objectSelected].chainEnd];
			
			//find the distance between the two ends of the chain using pythagorean theorem
			let chainLengthDistance = Math.sqrt(Math.pow(Math.abs(chainStart.x - chainEnd.x), 2) + Math.pow(Math.abs(chainStart.y - chainEnd.y), 2));
			//end block

			//find out which side is the other side to help with the offset calculation below
			let chainOther = null;
			if (gameObjects[objectSelected].reference === gameObjects[objectSelected].chainStart)
			{
				chainOther = chainEnd;
			}
			else
			{
				chainOther = chainStart;
			}
			
			// window.console.log('chainLengthDistance = ' + chainLengthDistance);

			// if(chainLengthDistance > (maxDraggableDistance * 1.05))
			if(chainLengthDistance > maxDraggableDistance)
			{
				// window.console.log('chainLengthDistance > maxDraggableDistance');
				let theta = 0;
				let adjacent = chainStart.x - chainEnd.x;
				let opposite = chainStart.y - chainEnd.y;
				theta = Math.atan(adjacent/opposite) || 0; // measured in radians, || 0 prevents NaN
				//convert to degrees
				// theta = theta / (Math.PI / 180);
				window.console.log('a = '+adjacent+', o = '+opposite+', theta = '+theta);

				let stretchedDistanceX = Math.sin(theta) * maxDraggableDistance;
				let stretchedDistanceY = Math.cos(theta) * maxDraggableDistance;
				window.console.log(stretchedDistanceX + ', ' + stretchedDistanceY);
				// ctx.fillRect(stretchedDistanceX - 10, stretchedDistanceY - 10, 20, 20);
				// offsetX = stretchedDistanceX + chainOther.x;
				// offsetY = stretchedDistanceY + chainOther.y;
				if ((opposite > 0 && chainOther === chainEnd) || (opposite < 0 && chainOther === chainStart))
				{
					offsetX = stretchedDistanceX + chainOther.x;
					offsetY = stretchedDistanceY + chainOther.y;
				}
				// else if ((opposite < 0 && chainOther === chainEnd) || (opposite > 0 && chainOther === chainStart))
				else
				{
					// offsetX = 300;
					// offsetY = 300;
					offsetX = chainOther.x - stretchedDistanceX;
					offsetY = chainOther.y - stretchedDistanceY;
				}
				// mouseup();

				window.console.log('stretchedDistanceX = ' + stretchedDistanceX + ', chainOther.x = ' + chainOther.x);
			}
		}
		
		gameObjects[objectSelected].dragX = offsetX;
		gameObjects[objectSelected].dragY = offsetY;
		// gameObjects[objectSelected].dx = 0;
		// gameObjects[objectSelected].dy = 0;
		// gameObjects[objectSelected].x = offsetX;
		// gameObjects[objectSelected].y = offsetY;
		// window.console.log('drag to: ' + e.offsetX + ', ' + e.offsetY);
	}
}

function mouseup(e) {
	window.console.log(gameObjects[objectSelected]);

	//remove all momentum from placeable objects
	if (gameObjects[objectSelected].entityType === 'placeable')
	{
		gameObjects[objectSelected].dx = 0;
		gameObjects[objectSelected].dy = 0;
	}

	//reset everything
	mouseHeld = false;
	if (objectSelected !== null) {
		gameObjects[objectSelected].isHeld = false;
		objectSelected = null;
		dragBounded = null;
	}
	window.console.log('drag end at: ' + e.offsetX + ', ' + e.offsetY);
}
