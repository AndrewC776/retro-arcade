type Coords = [x: number, y: number];
type Player = [x: number, y: number, size: number, color: string];
type Velocity = [forceX: number, forceY: number];
type Door = [x: number, y: number, goToIndex: number, hasDestroyed?: boolean];

type CaptainsLog = (message: string, isGarbledTime?: boolean) => void;

type Universe = {
	x: number;
	y: number;
	name: string;
	active?: boolean;
	doors: Door[];
}

type Level = Universe[];

type Levels = Level[];

type GameContext = {
	player: Player | undefined;
	level: Level | undefined;
	levelNum: number;
	universe: Universe | undefined;
}
