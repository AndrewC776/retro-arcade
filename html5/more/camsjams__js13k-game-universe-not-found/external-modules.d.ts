declare module 'tinymusic' {
	export type AudioSetting = {
		gain: {
			value: number;
		};
		frequency: {
			value: number;
		};
	}

	declare class Sequence {
		constructor(context: AudioContext, tempo: number, sequences: String[]) {}

		play(when: number): void;
		stop(): void;

		loop: boolean;

		staccato: number;
		smoothing: number;
		gain: AudioSetting;
		mid: AudioSetting;
		treble: AudioSetting;
		bass: AudioSetting;
	}

	export = {Sequence};
}
