// eslint-disable-next-line max-params
function collides(x: number, y: number, r: number, b: number, x2: number, y2: number, r2: number, b2: number): boolean {
	return !(r <= x2 || x > r2 ||
		b <= y2 || y > b2);
}

export default (posA: Coords, sizeA: number, posB: Coords, sizeB: number): boolean =>
	collides(
		posA[0],
		posA[1],
		posA[0] + sizeA,
		posA[1] + sizeA,
		posB[0], posB[1],
		posB[0] + sizeB,
		posB[1] + sizeB
	);
