import {SHIP_SIZE} from '../constants/Game';

export function render($ctx: CanvasRenderingContext2D, ships: Coords[]): void {
	ships.forEach((ship, i) => {
		$ctx.fillStyle = `rgba(${34 + i * 25},100,140,0.9)`;
		$ctx.fillRect(ship[0], ship[1], SHIP_SIZE, SHIP_SIZE);
	});
}
