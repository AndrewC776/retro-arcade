import {ships, probes, SHIP_SIZE, PROBE_SIZE} from '../constants/Game';
import levels from '../constants/Levels';

let currentPlayer: Player | undefined = undefined;
let currentLevel: Level | undefined = undefined;
let currentUniverse: Universe | undefined = undefined;
let stageMulti = 1;
let totalLevels = -1;

const getPlayer = (): Player | undefined => {
	const probe = probes.pop();
	if (probe) {
		return [probe[0], probe[1], PROBE_SIZE, 'rgba(0,255,0,0.5)'];
	}

	const ship = ships.pop();
	if (ship) {
		return [ship[0], ship[1], SHIP_SIZE, 'rgba(34,100,140,0.9)'];
	}
};

const getCurrentLevel = (): Level | undefined => {
	const nextLevel = levels.shift();
	stageMulti = totalLevels - levels.length;
	return nextLevel;
};

export const getContext = (): GameContext => {
	if (!currentPlayer) {
		currentPlayer = getPlayer();
	}

	if (!currentLevel) {
		currentLevel = getCurrentLevel();
		currentUniverse = currentUniverse ?
			currentUniverse :
			currentLevel ?
				currentLevel[0] :
				undefined;
	}

	return {
		player: currentPlayer,
		level: currentLevel,
		levelNum: stageMulti,
		universe: currentUniverse
	};
};

export const reset = (): void => {
	totalLevels = levels.length;
	currentPlayer = undefined;
	currentLevel = undefined;
	currentUniverse = undefined;
};

export const goToUniverse = (nextIndex: number): Universe | undefined => {
	if (currentLevel && currentLevel[nextIndex]) {
		currentLevel[nextIndex].active = true;
		currentUniverse = currentLevel[nextIndex];

		return currentUniverse;
	}
};

export const destroyActivePlayer = (): void => {
	if (currentLevel) {
		currentLevel = currentLevel.map((u, i) => {
			if (i !== 0) {
				u.active = false;
			}

			return u;
		});

		currentUniverse = currentLevel[0];
	}

	currentPlayer = undefined;
};

export const goToNextLevel = (): void => {
	currentLevel = getCurrentLevel();
	currentUniverse = currentLevel ?
		currentLevel[0] :
		undefined;
};
