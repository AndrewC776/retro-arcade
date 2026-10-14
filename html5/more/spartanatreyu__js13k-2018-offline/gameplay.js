//This represents difficulty and level, increments when 
let day = 1;
//When this reaches 0, the game is over. When this reaches day*2, the day is over.
let satisfaction = 1;
//if this is 0, we don't have to check for empty tiles, this is used to prevent an infinite loop
let totalNumberOfEmptyTiles = 0;
//increments when a new tile pair is made, so that only the right tiles are paired together
let nextTilePairToAdd = 0;
//represents the state of the boards tiles, and which ones are paired
let board = [];

function setupBoard()
{
	board = [];
	
	//alters board based on day
	for (let boardRows = 0; boardRows < day; boardRows++)
	{
		let boardRow = [];
		
		//Note: adding +1 to the day results in the number of tiles is always being even, 
		//important when the gameboard can only be occupied by pairs of tiles needing to be connected.
		for (let boardColumns = 0; boardColumns < day+1; boardColumns++)
		{
			let boardTile = undefined;
			totalNumberOfEmptyTiles++;
			boardRow.push(boardTile);
		}

		board.push(boardRow);
	}

	window.console.log(board);

}

function drawBoard()
{
	ctx.fillStyle = 'white';
	ctx.strokeStyle = 'white';
	for (let boardColumns = 0; boardColumns < board.length; boardColumns++)
	{
		const boardColumn = board[boardColumns];
		
		for (let boardRows = 0; boardRows < boardColumn.length; boardRows++)
		{
			const boardTile = board[boardColumns][boardRows];
			/*
			ctx.beginPath();
			ctx.moveTo(boardRows * 100 + 100, 0);
			ctx.lineTo(boardRows * 100 + 100, boardColumns * 100 + 100);
			ctx.stroke();
			ctx.closePath();
			*/
			ctx.strokeRect(boardRows*100 + 50, boardColumns*100 + 50, 100, 100);

			ctx.fillText(boardTile, boardRows * 100 + 75, boardColumns * 100 + 75);
		}
	}
}

function nextLevel()
{
	day++;
	satisfaction = 1;
	totalNumberOfEmptyTiles = 0;
	nextTilePairToAdd = 0;
	setupBoard();
}

function findEmptyTile()
{
	let boardColumns = board[0].length;
	let boardRows = board.length;

	let emptyTileColumn = Math.floor(Math.random() * boardColumns);
	let emptyTileRow    = Math.floor(Math.random() * boardRows);
	let emptyTile = board[emptyTileRow][emptyTileColumn];

	//repeat until an empty tile is found
	while (totalNumberOfEmptyTiles > 0 && emptyTile !== undefined)
	{
		emptyTileColumn = Math.floor(Math.random() * boardColumns);
		emptyTileRow = Math.floor(Math.random() * boardRows);
		emptyTile = board[emptyTileRow][emptyTileColumn];
	}

	return [emptyTileColumn,emptyTileRow];
}

function setupTilePair()
{
	// window.console.log(board);
	if (totalNumberOfEmptyTiles < 2)
	{
		window.console.log('stopping setupTilePair(). totalNumberOfEmptyLines < 2');
		return false;
	}
	
	let firstTile  = findEmptyTile();
	let secondTile = findEmptyTile();
	
	while (firstTile[0] === secondTile[0] && firstTile[1] === secondTile[1])
	{
		secondTile = findEmptyTile();
	}
	
	// window.console.log('firstTile: ' + firstTile);
	// window.console.log('secondTile: ' + secondTile);
	// window.console.log('nextTilePairToAdd: ' + nextTilePairToAdd);

	board[firstTile[1]][firstTile[0]] = nextTilePairToAdd;
	board[secondTile[1]][secondTile[0]] = nextTilePairToAdd;
	
	totalNumberOfEmptyTiles -= 2;
	nextTilePairToAdd++;
	
	window.console.log(board);
}