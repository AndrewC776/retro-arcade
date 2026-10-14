export const SHIP_SIZE = 10;
export const PROBE_SIZE = 5;
export const DOOR_SIZE = 25;
export const MOON_GATE_SIZE = 40;
export const FONT_SIZE = 20;
export const FUEL_AMOUNT = 1000;
export const GAME_WIDTH = 1080;
export const GAME_HEIGHT = 612;

export const WIDTH = 250;
export const HEIGHT = 275;
export const WIDTH_WITH_GAP = WIDTH + 15;
export const HEIGHT_WITH_GAP = HEIGHT + 35;
export const PADDING = 10;

export const GAME_STATE = {
	NORMAL: 0,
	DESTROYED: 1,
	ENTERED_MOON_GATE: 2,
	FUEL_EMPTY: 3
};

export const ships: Coords[] = [
	[PADDING, 5],
	[PADDING, 50],
	[PADDING, 95]
];

export const probes: Coords[] = [
	[ships[0][0] + SHIP_SIZE, ships[0][1]],
	[ships[1][0] + SHIP_SIZE, ships[1][1]],
	[ships[2][0] + SHIP_SIZE, ships[2][1]]
];

export const addVessels = (): void => {
	ships.push([PADDING, 140]);
	probes.push([ships[3][0] + SHIP_SIZE, ships[3][1]]);
	probes.push([PADDING + SHIP_SIZE, 180]);
};
