import TinyMusic from 'tinymusic';

const ac = new AudioContext();
const warp = new TinyMusic.Sequence(ac, 300, [
	'G4 s',
	'D4 s',
	'F4 s'
]);
warp.loop = false;

export const playWarp = (): void => {
	warp.play(ac.currentTime);
};

const notFound = new TinyMusic.Sequence(ac, 220, [
	'G4 s',
	'G3 q'
]);
notFound.loop = false;

export const play404 = (): void => {
	notFound.play(ac.currentTime);
};

const outOfFuel = new TinyMusic.Sequence(ac, 220, [
	'G2 s',
	'G3 s',
	'F2 s',
	'D3 s'
]);
outOfFuel.loop = false;

export const playNoFuel = (): void => {
	outOfFuel.play(ac.currentTime);
};

const moonGate = new TinyMusic.Sequence(ac, 180, [
	'E3  e',
	'F3  e',
	'G3  e',
	'F3  e',
	'E3  e',
	'F3  e',
	'D3  q'

]);
moonGate.loop = false;

export const playEnterGate = (): void => {
	moonGate.play(ac.currentTime);
};

const gameWin = new TinyMusic.Sequence(ac, 180, [
	'E5  s',
	'F5  s',
	'G5  q',
	'F5  e',
	'E5  e',
	'D5  q'

]);
gameWin.loop = false;

export const playGameWin = (): void => {
	gameWin.play(ac.currentTime);
};

const gameLoss = new TinyMusic.Sequence(ac, 180, [
	'E2  s',
	'F2  s',
	'G2  q',
	'F2  e',
	'E2  e',
	'D2  q'

]);
gameLoss.loop = false;

export const playGameLoss = (): void => {
	gameLoss.play(ac.currentTime);
};

const lead = [
	'- e',
	'F3 e',
	'A3 q',
	'Bb3 e',

	'F3 e',
	'A3 q',
	'Bb3 e',

	'F3 e',
	'E3 e',
	'G3 e',
	'F3 e',
	'E3 e',
	'D3 q',

	'- e',
	'Bb3 s',
	'A3 s',
	'Bb3 e',
	'F3 e',
	'A3 e',
	'Bb3 s',
	'F3 s',
	'A3 e',

	'E3 e',
	'F3 e',
	'G3 e',
	'F3 e',
	'E3 s',
	'F3 s',
	'E3 e',
	'D3 q'
];
const harmony = [
	'- e',
	'F5 e',
	'A5 q',
	'Bb5 e',

	'F5 e',
	'A5 q',
	'Bb5 e',

	'F5 e',
	'E5 e',
	'G5 e',
	'F5 e',
	'E5 e',
	'D5 q',

	'- e',
	'Bb5 s',
	'A5 s',
	'Bb5 e',
	'F5 e',
	'A5 e',
	'Bb5 s',
	'F5 s',
	'A5 e',

	'E6 e',
	'F6 e',
	'G6 e',
	'F6 e',
	'E6 s',
	'F6 s',
	'E6 e',
	'D6 q'
];
const bass = [
	'F2 q',
	'- h',
	'F2 q',

	'A2 q',
	'- h',
	'A2 q',

	'Bb2 q',
	'- h',
	'Bb2 q',

	'F2 h',
	'A2 h'
];
const tempo = 60;

const sequence1 = new TinyMusic.Sequence(ac, tempo, lead);
const sequence2 = new TinyMusic.Sequence(ac, tempo, harmony);
const sequence3 = new TinyMusic.Sequence(ac, tempo, bass);

sequence2.staccato = 0.55;
sequence3.smoothing = 0.4;

sequence1.gain.gain.value = 0.2;
sequence2.gain.gain.value = 0.05;
sequence3.gain.gain.value = 0.05;

sequence2.mid.frequency.value = 1200;
sequence3.mid.gain.value = 3;
sequence3.bass.gain.value = 6;
sequence3.bass.frequency.value = 80;
sequence3.mid.gain.value = -6;
sequence3.mid.frequency.value = 500;
sequence3.treble.gain.value = -2;
sequence3.treble.frequency.value = 1400;

export const playBgm = (): void => {
	const when = ac.currentTime;
	sequence1.play(when);
	sequence2.play(when + 15.5);
	sequence3.play(when);
};
