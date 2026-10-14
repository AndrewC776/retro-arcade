
import {DOOR_SIZE} from '../constants/Game';
import boxCollides from '../utils/collider';

export const checkCollisions = (universe: Universe, player: Player): Door | undefined => {
	let doorEntered = undefined;
	universe.doors.forEach((door) => {
		if (boxCollides([player[0], player[1]], player[2], [universe.x + door[0], universe.y + door[1]], DOOR_SIZE)) {
			doorEntered = door;

			if (door[2] === -1) {
				door[3] = true;
			}
		}
	});

	return doorEntered;
};

export function render($ctx: CanvasRenderingContext2D, universe: Universe): void {
	universe.doors.forEach((door) => {
		if (door[3]) {
			$ctx.fillStyle = 'crimson';
		} else {
			$ctx.fillStyle = 'darkviolet';
		}

		$ctx.fillRect(universe.x + door[0], universe.y + door[1], DOOR_SIZE / 2, DOOR_SIZE);
	});
}
