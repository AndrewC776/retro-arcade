const SPEED = 120;
let pressedKeys: {[key: string]: 0 | 1} = {};

document.addEventListener('keydown', (event: KeyboardEvent) => {
	pressedKeys[event.key] = 1;
});

document.addEventListener('keyup', (event: KeyboardEvent) => {
	pressedKeys[event.key] = 0;
});

window.addEventListener('blur', () => {
	pressedKeys = {};
});

export function render($ctx: CanvasRenderingContext2D, player: Player): void {
	$ctx.fillStyle = player[3];
	$ctx.fillRect(player[0], player[1], player[2], player[2]);
}

export default (timeDifference: number): Velocity => {
	const velocity: Velocity = [0, 0];
	if (pressedKeys.s) {
		velocity[1] += SPEED * timeDifference;
	}

	if (pressedKeys.w) {
		velocity[1] -= SPEED * timeDifference;
	}

	if (pressedKeys.a) {
		velocity[0] -= SPEED * timeDifference;
	}

	if (pressedKeys.d) {
		velocity[0] += SPEED * timeDifference;
	}

	return velocity;
};

