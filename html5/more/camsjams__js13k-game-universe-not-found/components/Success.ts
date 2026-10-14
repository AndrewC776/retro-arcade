/* eslint-disable max-statements */
import {GAME_WIDTH, GAME_HEIGHT} from '../constants/Game';

const RADIUS = GAME_WIDTH / 6;
const CENTER = [GAME_WIDTH / 2, GAME_HEIGHT / 2];

export function render($ctx: CanvasRenderingContext2D, hasAllShips: boolean, startTime: number): void {
	const timeDifference = (Date.now() - startTime) / 1000.0;
	$ctx.fillStyle = '#fff';
	$ctx.font = '25px "Courier New", Courier, monospace';
	$ctx.fillText('You Found a Safe Universe', GAME_WIDTH / 3, 25);
	$ctx.font = '20px "Courier New", Courier, monospace';
	$ctx.fillText(`Your Journey Score Was ${timeDifference} (lower is better)`, GAME_WIDTH / 4, 545);
	if (hasAllShips) {
		$ctx.fillStyle = '#2E8B57';
		$ctx.fillText('Accomplished Leader: All Ships Survived', GAME_WIDTH / 3.5, 65);
	} else {
		$ctx.fillStyle = 'rgba(34, 100, 140, 0.9)';
		$ctx.fillText('Great Leader: Most Ships Survived', GAME_WIDTH / 3, 65);
		$ctx.fillStyle = '#333';
		$ctx.fillText('Retry (refresh page) For a Perfect Mission', GAME_WIDTH / 3.5, 95);
	}

	$ctx.beginPath();
	$ctx.arc(CENTER[0], CENTER[1], RADIUS, 0, 2 * Math.PI);
	$ctx.fillStyle = 'blue';
	$ctx.fill();

	const planet = [CENTER[0] - RADIUS, CENTER[1] - RADIUS];

	$ctx.fillStyle = 'green';
	$ctx.fillRect(planet[0] + 70, planet[1] + 40, 10, 15);
	$ctx.fillRect(planet[0] + 65, planet[1] + 45, 15, 15);
	$ctx.fillRect(planet[0] + 65, planet[1] + 50, 15, 15);
	$ctx.fillRect(planet[0] + 65, planet[1] + 55, 20, 15);

	$ctx.fillRect(planet[0] + 75, planet[1] + 100, 25, 25);
	$ctx.fillRect(planet[0] + 70, planet[1] + 125, 75, 25);
	$ctx.fillRect(planet[0] + 65, planet[1] + 150, 100, 25);
	$ctx.fillRect(planet[0] + 45, planet[1] + 175, 100, 25);
	$ctx.fillRect(planet[0] + 50, planet[1] + 200, 115, 25);
	$ctx.fillRect(planet[0] + 65, planet[1] + 225, 150, 25);
	$ctx.fillRect(planet[0] + 65, planet[1] + 250, 125, 25);
	$ctx.fillRect(planet[0] + 70, planet[1] + 275, 100, 25);

	$ctx.fillRect(planet[0] + 225, planet[1] + 40, 15, 15);
	$ctx.fillRect(planet[0] + 220, planet[1] + 55, 25, 15);
	$ctx.fillRect(planet[0] + 215, planet[1] + 70, 30, 15);
	$ctx.fillRect(planet[0] + 215, planet[1] + 85, 55, 15);
	$ctx.fillRect(planet[0] + 210, planet[1] + 100, 70, 15);
	$ctx.fillRect(planet[0] + 205, planet[1] + 115, 50, 15);
	$ctx.fillRect(planet[0] + 215, planet[1] + 130, 45, 15);
	$ctx.fillRect(planet[0] + 220, planet[1] + 145, 30, 15);

	$ctx.fillRect(planet[0] + 255, planet[1] + 275, 30, 20);
	$ctx.fillRect(planet[0] + 265, planet[1] + 295, 15, 20);
	$ctx.fillRect(planet[0] + 275, planet[1] + 315, 5, 10);

	$ctx.fillRect(planet[0] + 305, planet[1] + 180, 30, 20);
	$ctx.fillRect(planet[0] + 300, planet[1] + 200, 15, 20);
	$ctx.fillRect(planet[0] + 275, planet[1] + 220, 5, 10);

	$ctx.fillStyle = 'rgba(255,255,255,0.7)';
	$ctx.fillRect(planet[0] + 70, planet[1] + 120, 10, 5);
	$ctx.fillRect(planet[0] + 65, planet[1] + 125, 20, 5);
	$ctx.fillRect(planet[0] + 70, planet[1] + 125, 10, 5);

	$ctx.fillRect(planet[0] + 100, planet[1] + 35, 10, 5);
	$ctx.fillRect(planet[0] + 95, planet[1] + 40, 20, 5);
	$ctx.fillRect(planet[0] + 95, planet[1] + 45, 15, 5);
	$ctx.fillRect(planet[0] + 100, planet[1] + 50, 10, 5);

	$ctx.fillRect(planet[0] + 110, planet[1] + 85, 10, 5);
	$ctx.fillRect(planet[0] + 100, planet[1] + 90, 20, 5);
	$ctx.fillRect(planet[0] + 100, planet[1] + 95, 15, 5);
	$ctx.fillRect(planet[0] + 120, planet[1] + 100, 10, 5);

	$ctx.fillRect(planet[0] + 110, planet[1] + 185, 10, 5);
	$ctx.fillRect(planet[0] + 100, planet[1] + 190, 20, 5);
	$ctx.fillRect(planet[0] + 100, planet[1] + 195, 35, 5);
	$ctx.fillRect(planet[0] + 120, planet[1] + 200, 20, 5);

	$ctx.fillRect(planet[0] + 230, planet[1] + 215, 30, 20);
	$ctx.fillRect(planet[0] + 225, planet[1] + 235, 40, 15);

	$ctx.fillRect(planet[0] + 195, planet[1] + 280, 25, 10);
	$ctx.fillRect(planet[0] + 200, planet[1] + 290, 30, 25);
}
