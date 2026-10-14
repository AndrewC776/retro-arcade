import {WIDTH, HEIGHT, FONT_SIZE} from '../constants/Game';
import {render as renderDoors} from './Door';
import {render as renderMoonGate} from './MoonGate';

const getUniverseName = (universe: Universe): string =>
	`Universe ${universe.name}`;

const renderAsHidden = ($ctx: CanvasRenderingContext2D, universe: Universe): void => {
	$ctx.fillStyle = 'transparent';
	$ctx.fillRect(universe.x, universe.y, WIDTH, HEIGHT);
};

const renderStars = ($ctx: CanvasRenderingContext2D, universe: Universe): void => {
	const MAX_WIDTH = universe.x + WIDTH;
	const MAX_HEIGHT = universe.y + HEIGHT;
	for (let i = universe.x; i < MAX_WIDTH; i++) {
		for (let j = universe.y; j < MAX_HEIGHT; j++) {
			if ((i + j) % 12 === 0 && j % 6 === 0) {
				$ctx.fillStyle = `rgba(255,255,255,${Math.min(0.3, Math.random())})`;
				$ctx.fillRect(i, j, 1, 1);
			}
		}
	}
};

export function render($ctx: CanvasRenderingContext2D, level: Level): void {
	level.forEach((universe) => {
		if (!universe.active) {
			return renderAsHidden($ctx, universe);
		}

		$ctx.fillStyle = '#fff';
		$ctx.font = `${FONT_SIZE}px "Courier New", Courier, monospace`;
		$ctx.fillText(getUniverseName(universe), universe.x + WIDTH / 3, universe.y + FONT_SIZE + HEIGHT);
		$ctx.fillStyle = '#101';
		$ctx.fillRect(universe.x, universe.y, WIDTH, HEIGHT);
		renderStars($ctx, universe);

		if (universe.doors.length) {
			renderDoors($ctx, universe);
		} else {
			renderMoonGate($ctx, universe);
		}
	});

}
