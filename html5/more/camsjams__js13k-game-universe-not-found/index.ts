import {
	getContext,
	reset as resetGame,
	goToUniverse,
	destroyActivePlayer,
	goToNextLevel
} from './controllers/GameController';
import updatePlayer, {render as renderPlayer} from './controllers/PlayerController';
import {
	playWarp,
	play404,
	playEnterGate,
	playNoFuel,
	playGameWin,
	playGameLoss,
	playBgm
} from './controllers/SoundController';
import {checkCollisions} from './components/Door';
import {checkCollisions as onEnterMoonGate} from './components/MoonGate';
import {render as renderSuccess} from './components/Success';
import {render as renderShips} from './components/Ship';
import {render as renderProbes} from './components/Probe';
import {render as renderUniverses} from './components/Universe';
import {
	ships,
	probes,
	FUEL_AMOUNT,
	GAME_HEIGHT,
	GAME_WIDTH,
	WIDTH,
	HEIGHT,
	GAME_STATE, addVessels
} from './constants/Game';
import {addLevels} from './constants/Levels';

let lastTime = 0;
let gameStart = 0;
let fuelLeft = FUEL_AMOUNT;
let missionAccomplished = 3;

const $score = document.getElementById('s') as HTMLElement;
const $time = document.getElementById('t') as HTMLElement;
const $message = document.getElementById('m') as HTMLElement;
const $log = document.getElementById('l') as HTMLElement;
const $g = document.getElementById('g') as HTMLElement;

const canvas: HTMLCanvasElement = document.createElement('canvas');
$g.appendChild(canvas);

canvas.width = GAME_WIDTH;
canvas.height = GAME_HEIGHT;
const $ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

const capLog: CaptainsLog = (message: string, isGarbledTime?: boolean): void => {
	$log.prepend(`[${isGarbledTime ? '??:??:?? ::' : new Date().toLocaleTimeString()}]: ${message}\n`);
};

function resetPlayerToUniverse(player: Player, universe: Universe): void {
	player[0] = universe.x + 0;
	player[1] = universe.y + HEIGHT / 2;

	if (!universe.doors.length) {
		capLog('A Moon Gate! Should we enter it?');
	}
}

function checkBoundaries(player: Player, universe: Universe): void {
	const MAX_WIDTH = universe.x + WIDTH - player[2];
	const MAX_HEIGHT = universe.y + HEIGHT - player[2];
	if (player[0] < universe.x) {
		player[0] = universe.x;
	} else if (player[0] > MAX_WIDTH) {
		player[0] = MAX_WIDTH;
	}

	if (player[1] < universe.y) {
		player[1] = universe.y;
	} else if (player[1] > MAX_HEIGHT) {
		player[1] = MAX_HEIGHT;
	}
}

const getLevelFuel = (levelNum: number): number => FUEL_AMOUNT * Math.max(1, levelNum - 1);

function checkDoors(player: Player, universe: Universe, levelNum: number): number {
	const doorEntered = checkCollisions(universe, player);
	if (doorEntered) {
		if (doorEntered[2] > -1) {
			const nextUniverse = goToUniverse(doorEntered[2]);
			if (nextUniverse) {
				playWarp();
				resetPlayerToUniverse(player, nextUniverse);
			}
		} else {
			fuelLeft = getLevelFuel(levelNum);
			play404();
			destroyActivePlayer();
			return GAME_STATE.DESTROYED;
		}
	}

	return GAME_STATE.NORMAL;
}

function handleMoonGateEntry(player: Player, levelNum: number) {
	playEnterGate();
	goToNextLevel();
	capLog('Moon Gate Entered.');
	capLog('----', true);
	capLog(`We have entered into a new Mother Universe: M\u03BC${levelNum + 1}.`, true);
	capLog('Calibrated sensors to new time vortex.');
	fuelLeft = getLevelFuel(levelNum + 1);
	player[0] = WIDTH / 2;
	player[1] = HEIGHT / 2;
}

function checkFuel(vel: Velocity, levelNum: number): number {
	fuelLeft -= (Math.abs(vel[0]) + Math.abs(vel[1])) * .5;
	if (fuelLeft < 0) {
		capLog('Fuel Supply Empty.');
		capLog('Vessel Lost.');
		capLog('---');
		fuelLeft = getLevelFuel(levelNum);
		playNoFuel();
		destroyActivePlayer();
		return GAME_STATE.FUEL_EMPTY;
	}

	return GAME_STATE.NORMAL;
}

function updatePlayerData(timeDifference: number, player: Player, universe: Universe, levelNum: number): number {
	const vel = updatePlayer(timeDifference);
	player[0] += vel[0];
	player[1] += vel[1];

	checkBoundaries(player, universe);
	const gameStateChange = checkDoors(player, universe, levelNum);
	if (onEnterMoonGate(universe, player)) {
		handleMoonGateEntry(player, levelNum);
		return 2;
	}

	const fuelResult = checkFuel(vel, levelNum);
	return fuelResult !== GAME_STATE.NORMAL ? fuelResult : gameStateChange;
}

const smartUpdate = (value: string, ele: HTMLElement): void => {
	if (value !== ele.innerHTML) {
		ele.innerHTML = value;
	}
};

function update(timeDifference: number, game: GameContext): number {
	let gameStateChange = 0;
	if (game.player && game.universe) {
		fuelLeft -= timeDifference * .25;
		gameStateChange = updatePlayerData(timeDifference, game.player, game.universe, game.levelNum);
	}

	smartUpdate(`<b>Fuel:</b> ${~~fuelLeft}`, $time);
	smartUpdate(`<b>Survivors:</b> ${ships.length * 100}`, $score);
	smartUpdate(
		`<b>Status:</b>
		Exploring <i>Level ${game.levelNum}</i> |
		 ${ships.length} <i>ships left</i> | ${probes.length} <i>probes left</i>`,
		$message);

	if (gameStateChange === GAME_STATE.DESTROYED) {
		capLog('Warning - ERC#+404-0-404: Universe Not Found!');
		capLog('Vessel Lost.');
		capLog('---');
	}

	return gameStateChange;
}

function render(game: GameContext): void {
	if (game.level) {
		renderUniverses($ctx, game.level);
		renderShips($ctx, ships);
		renderProbes($ctx, probes);
	}

	if (game.player) {
		renderPlayer($ctx, game.player);
	}
}

function onLoopEnd(now: number): void {
	lastTime = now;
	requestAnimationFrame(loop);
}

function onGameWin(): void {
	playGameWin();
	renderSuccess($ctx, ships.length === missionAccomplished, gameStart);
}

function onGameLost(): void {
	smartUpdate(`<div class="over">
		<h2>Game Over</h2>
		<p>Refresh reality (...the page) to Retry</p>
		</div>`, $g);
	playGameLoss();
}

// eslint-disable-next-line max-statements
function loop(): void {
	const now = Date.now();
	const timeDifference = (now - lastTime) / 1000.0;
	const game = getContext();
	$ctx.clearRect(0, 0, canvas.width, canvas.height);
	if (game.levelNum > 1 && game.universe === undefined) {
		onGameWin();
		return;
	}

	if (update(timeDifference, game) !== GAME_STATE.NORMAL) {
		onLoopEnd(now);
		$ctx.clearRect(0, 0, canvas.width, canvas.height);
		return;
	}

	if (!game.player) {
		onGameLost();
		return;
	}

	render(game);
	onLoopEnd(now);
}

function reset(): void {
	fuelLeft = FUEL_AMOUNT;
	resetGame();
}

((): void => {
	const title = document.getElementById('title') as HTMLElement;
	const game = document.getElementById('game') as HTMLElement;
	title.addEventListener('click', () => {
		game.className = '';

		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		if (document.monetization && document.monetization.state === 'started') {
			capLog('We Have Discovered a Coil Scribe! Our Ships Were Cloned.');
			capLog('Our Sensors Have Detected Additional Levels Because of the Coil Scribe.');
			addVessels();
			missionAccomplished = 4;
			addLevels();
		}

		reset();
		playBgm();
		lastTime = Date.now();
		gameStart = Date.now();
		loop();
	});
})();
