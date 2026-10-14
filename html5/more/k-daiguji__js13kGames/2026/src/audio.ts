export class AudioManager {
  private readonly audioContext: AudioContext;
  private readonly masterGain: GainNode;

  constructor() {
    this.audioContext = new window.AudioContext();
    this.masterGain = this.audioContext.createGain();
    this.masterGain.gain.value = 1;
    this.masterGain.connect(this.audioContext.destination);
  }

  public resume(): void {
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
  }

  public playBGM(): void {
    this.resume();
    const now = this.audioContext.currentTime,
      duration = 0.3,
      time = [262, 294, 330, 349].reduce((start, note) => {
        const oscillatorNode = this.createSineOscillator(note);
        this.playNote(oscillatorNode, { end: start + duration, start });
        return start + duration;
      }, now);
    setTimeout(() => this.playBGM(), (time - now) * 1000);
  }

  public playCollisionSound(): void {
    this.resume();
    const start = this.audioContext.currentTime,
      time = { end: start + 0.15, start },
      oscillatorNode = this.createCustomOscillator(600, time);
    this.playNote(oscillatorNode, time);
  }

  public playDropSound(): void {
    this.resume();
    const start = this.audioContext.currentTime,
      time = { end: start + 0.35, start },
      oscillatorNode = this.createCustomOscillator(300, time);
    this.playNote(oscillatorNode, time);
  }

  private createSineOscillator(frequency: number): OscillatorNode {
    const osc = this.audioContext.createOscillator();
    osc.type = "sine";
    osc.frequency.value = frequency;
    return osc;
  }

  private createCustomOscillator(
    frequency: number,
    time: { start: number; end: number },
  ): OscillatorNode {
    const osc = this.audioContext.createOscillator();
    osc.frequency.setValueAtTime(frequency, time.start);
    osc.frequency.exponentialRampToValueAtTime(frequency * 0.5, time.end);
    return osc;
  }

  private playNote(
    oscillatorNode: OscillatorNode,
    time: { start: number; end: number },
  ): void {
    const gain = this.createGainNode(0.15, time);
    oscillatorNode.connect(gain);
    gain.connect(this.masterGain);

    oscillatorNode.start(time.start);
    oscillatorNode.stop(time.end);
  }

  private createGainNode(
    value: number,
    time: { start: number; end: number },
  ): GainNode {
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(value, time.start);
    gainNode.gain.exponentialRampToValueAtTime(0.01, time.end);
    return gainNode;
  }
}
