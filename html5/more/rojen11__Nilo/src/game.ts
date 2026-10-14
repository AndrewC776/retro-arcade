import Engine from './engine';
import Render from './render';

export default class Game {
  public engine: Engine;

  private lastRender = 0;

  private render: Render;

  private fpsDiv: Element;
  private fpsTime = 0;
  private context: CanvasRenderingContext2D;

  private animFrame: number;

  private running: boolean;

  public events = document.getElementById('events');

  constructor() {
    const canvas = document.getElementsByTagName('canvas')[0];
    const ctx = canvas.getContext('2d');
    if (ctx !== null) {
      this.context = ctx;
    }
    const temp = document.getElementById('fps');
    if (temp !== null) this.fpsDiv = temp;
    this.initLocalStorage();
  }

  begin = (): void => {
    if (this.context === null) {
      console.error('context not found');
    } else {
      this.context.clearRect(
        0,
        0,
        this.context.canvas.width,
        this.context.canvas.height,
      );
      this.engine = new Engine(this.context, this);
      this.render = new Render(this.engine, this.context);
      this.engine.begin();
    }
  };

  // Game Loop
  loop = (timestamp: number): void => {
    if (!this.running) return;

    const progress = timestamp - this.lastRender;
    let dt = progress / 1000;

    if (dt > 0.02) dt = 0.02;

    if (this.fpsTime > 0.25) {
      this.fpsDiv.innerHTML = Math.floor(1 / dt).toString();
      this.fpsTime = 0;
    }
    this.engine.update(dt);
    this.render.draw();

    this.lastRender = timestamp;
    this.fpsTime += dt;
    window.requestAnimationFrame(this.loop);
  };

  run(): void {
    this.running = true;
    this.lastRender = 0;
    this.engine.controls.showControls();
    this.animFrame = window.requestAnimationFrame(this.loop);
  }

  stop(): void {
    this.running = false;
    window.cancelAnimationFrame(this.animFrame);
  }

  initLocalStorage(): void {
    if (this.storageAvailable()) {
      if (localStorage.getItem('game-storage') === null) {
        localStorage.setItem('game-storage', '{"levelIndex":0}');
      } else {
        if (this.getLocalStorage('levelIndex') === null) {
          localStorage.setItem('game-storage', '{"levelIndex":0}');
        }
      }
    }
  }

  setLocalStorage(key: string, value: string): void {
    const currentString = localStorage.getItem('game-storage');
    if (currentString !== null) {
      const currentJSON = JSON.parse(currentString);
      currentJSON[key] = value;
      localStorage.setItem('game-storage', JSON.stringify(currentJSON));
    }
  }

  getLocalStorage(key: string): string | boolean {
    const currentString = localStorage.getItem('game-storage');
    if (currentString !== null) {
      const currentJSON = JSON.parse(currentString);
      if (currentJSON[key] !== null) {
        return currentJSON[key];
      }
    }
    return false;
  }

  storageAvailable(): boolean {
    let storage;
    try {
      storage = window.localStorage;
      const x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return !(e instanceof DOMException);
    }
  }
}
