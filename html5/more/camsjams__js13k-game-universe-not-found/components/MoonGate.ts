import {WIDTH, HEIGHT, MOON_GATE_SIZE} from '../constants/Game';
import boxCollides from '../utils/collider';

const RAINBOW = [
	'255,0,0',
	'255,127,0',
	'255,255,0',
	'127,255,0',
	'0,255,0',
	'0,255,127',
	'0,255,255',
	'0,127,255',
	'0,0,255',
	'127,0,255',
	'255,0,255',
	'255,0,127'
];
const R = RAINBOW.length;

const getRainbowIndex = (): number =>
	new Date().getSeconds() % R;

const getRainbowColor = (): string =>
	RAINBOW[getRainbowIndex()];

const getCenter = (universe: Universe) =>
	[universe.x + WIDTH / 2, universe.y + HEIGHT / 2];

export const checkCollisions = (universe: Universe, player: Player): boolean => {
	if (universe.doors.length) {
		return false;
	}

	const center = getCenter(universe);
	return boxCollides([
		player[0], player[1]], player[2], [center[0] - MOON_GATE_SIZE, center[1] - MOON_GATE_SIZE
	], MOON_GATE_SIZE * 2);
};

export function render($ctx: CanvasRenderingContext2D, universe: Universe): void {
	const center = getCenter(universe);
	$ctx.beginPath();
	$ctx.arc(center[0], center[1], MOON_GATE_SIZE, -4, 1);
	$ctx.fillStyle = `rgb(${getRainbowColor()})`;
	$ctx.fill();
	$ctx.fillStyle = '#333';
	$ctx.fillRect(center[0] - MOON_GATE_SIZE - 10, center[1] + MOON_GATE_SIZE - 10, 100, 7);
}
