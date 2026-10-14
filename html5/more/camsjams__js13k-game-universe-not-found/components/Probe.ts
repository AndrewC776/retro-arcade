import {PROBE_SIZE} from '../constants/Game';

export function render($ctx: CanvasRenderingContext2D, probes: Coords[]): void {
	probes.forEach((probe, i) => {
		$ctx.fillStyle = `rgba(0,${255 - i * 25},0,0.5)`;
		$ctx.fillRect(probe[0], probe[1], PROBE_SIZE, PROBE_SIZE);
	});
}
