import { chapters } from './chapters';
import Game from './game';
import { maps } from './map';
import Tiles from './tiles';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const zzfx: any;

export default class Menu {
  private menuDiv = document.getElementById('menu');

  private playbtn = document.getElementById('play');

  private chaptersDiv = document.getElementById('chapters');

  private levelDiv = document.getElementById('level');

  private events = document.getElementById('events');

  private backward = document.getElementById('backward');

  private forward = document.getElementById('forward');

  private menubtn = document.getElementById('menubtn');

  private reloadbtn = document.getElementById('reload');

  private fullscreen = document.getElementById('fullscreen');

  private endScreen = document.getElementById('endscreen');

  private endScreen2 = document.getElementById('endscreen2');

  private urlbar = document.getElementById('urlbar');

  private nextchapter = document.getElementById('nextchapter');

  private displayStatus = 'home';

  private chapter = 1;
  private level = 1;

  constructor(private game: Game) {
    if (this.menuDiv !== null && this.playbtn !== null) {
      this.playbtn.addEventListener('click', () => {
        if (/iPhone|iPad|Android/i.test(navigator.userAgent)) {
          this.toggleFullScreen();
          window.screen.orientation.lock('landscape');
        }
        this.showChapters();
      });
    } else {
      console.error('menu or play button not found');
    }

    // backward button
    if (this.backward !== null) {
      this.backward.addEventListener('click', () => {
        this.backward?.blur();
        if (typeof this.game.engine.map.levelIndex === 'undefined') {
          if (this.displayStatus === 'chapters') {
            this.show();
          } else if (this.displayStatus === 'levels') {
            this.showChapters();
          }
        } else {
          if (this.game.engine.map.levelIndex > 0) {
            const levelIndex = this.game.engine.map.levelIndex;
            this.game.stop();
            this.game.begin();
            this.game.engine.map.loadLevel(maps[levelIndex - 1]);
            this.game.run();
          }
        }
      });
    }

    // Forward button
    if (this.forward !== null) {
      this.forward.addEventListener('click', () => {
        this.forward?.blur();
        const levelIndex = this.game.engine.map.levelIndex;
        if (typeof levelIndex !== 'undefined') {
          if (
            !(levelIndex >= Number(this.game.getLocalStorage('levelIndex')))
          ) {
            this.game.stop();
            this.game.begin();
            this.game.engine.map.loadLevel(maps[levelIndex + 1]);
            this.game.run();
          }
        }
      });
    }

    // menu button
    if (this.menubtn !== null) {
      this.menubtn.addEventListener('click', () => {
        this.game.engine.controls.hideControls();
        this.game.stop();
        this.show();
      });
    }

    // reload button
    if (this.reloadbtn !== null) {
      this.reloadbtn.addEventListener('click', () => {
        this.reloadbtn?.blur();
        this.refresh();
      });
    }

    // next chapter button
    if (this.nextchapter !== null) {
      this.nextchapter.addEventListener('click', () => {
        const levelIndex = this.game.engine.map.levelIndex;
        this.hideEndScreen();
        this.game.begin();
        this.game.engine.map.loadLevel(maps[levelIndex + 1]);
        this.game.run();
      });
    }

    // fullscreen button
    if (this.fullscreen !== null) {
      this.fullscreen.addEventListener('click', () => {
        this.fullscreen?.blur();
        this.toggleFullScreen();
      });
    }

    this.initChapters();
    this.initLevels();
    this.initEvents();
  }

  show(): void {
    this.hideall();
    if (this.urlbar !== null) {
      this.urlbar.innerText = 'https://nilo.com/home.html';
    }
    if (this.menuDiv !== null) this.menuDiv.style.visibility = 'visible';
    this.game.engine.context.clearRect(
      0,
      0,
      this.game.engine.context.canvas.width,
      this.game.engine.context.canvas.height,
    );
    this.game.engine.context.canvas.style.backgroundColor = '#f1f9cb';
    this.displayStatus = 'menu';
  }

  hide(): void {
    if (this.menuDiv !== null) this.menuDiv.style.visibility = 'hidden';
  }

  // Chapters
  initChapters(): void {
    if (this.chaptersDiv != null) {
      const btns = this.chaptersDiv.children;
      for (let i = 0; i < btns.length; i++) {
        btns[i].addEventListener('click', e => {
          this.chapter = Number((<HTMLButtonElement>e.target).value);
          this.showlevels();
        });
      }
      if (Number(this.game.getLocalStorage('levelIndex')) < 5) {
        (<HTMLButtonElement>btns[1]).disabled = true;
      }
    }
  }

  showChapters(): void {
    this.hideall();
    if (this.chaptersDiv !== null)
      this.chaptersDiv.style.visibility = 'visible';
    this.displayStatus = 'chapters';
  }
  hideChapters(): void {
    if (this.chaptersDiv !== null) this.chaptersDiv.style.visibility = 'hidden';
  }

  // Levels
  initLevels(): void {
    if (this.levelDiv != null) {
      const btns = this.levelDiv.children;
      for (let i = 0; i < btns.length; i++) {
        btns[i].addEventListener('click', e => {
          this.hideall();
          this.level = Number((<HTMLButtonElement>e.target).value);
          this.game.engine.map.loadLevel(`${this.chapter}${this.level}`);
          this.game.run();
        });
      }
    }
  }

  showlevels(): void {
    this.hideall();
    if (this.levelDiv != null) {
      this.levelDiv.style.visibility = 'visible';
      const btns = this.levelDiv.children;
      for (let i = 0; i < btns.length; i++) {
        if (this.chapter === 1) {
          if (Number(this.game.getLocalStorage('levelIndex')) - i < 0) {
            (<HTMLButtonElement>btns[i]).disabled = true;
          }
        }
        if (this.chapter === 2) {
          console.log('here');
          if (Number(this.game.getLocalStorage('levelIndex')) - 5 - i < 0) {
            (<HTMLButtonElement>btns[i]).disabled = true;
          }
        }
      }
    }
    this.displayStatus = 'levels';
  }
  hidelevels(): void {
    if (this.levelDiv != null) this.levelDiv.style.visibility = 'hidden';
  }

  // Events
  initEvents(): void {
    if (this.events !== null) {
      // Player Dead
      this.events.addEventListener('gameover', () => {
        const levelIndex = this.game.engine.map.levelIndex;
        this.game.stop();
        this.game.begin();
        this.game.engine.map.loadLevel(maps[levelIndex]);
        this.game.run();
      });

      // Level End
      this.events.addEventListener('fileFound', async () => {
        this.game.stop();
        const levelIndex = this.game.engine.map.levelIndex;
        this.game.engine.controls.hideControls();
        this.game.setLocalStorage('levelIndex', (levelIndex + 1).toString());

        if (levelIndex === 4) {
          await new Promise(r => setTimeout(r, 200));

          if (this.endScreen !== null) {
            if (this.urlbar !== null) {
              this.urlbar.innerText = 'https://nilo.com/index.html';
            }
            this.game.engine.context.clearRect(
              0,
              0,
              this.game.engine.context.canvas.width,
              this.game.engine.context.canvas.height,
            ),
              (this.endScreen.style.visibility = 'visible');

            this.game.engine.context.canvas.style.backgroundColor = chapters[
              Math.floor(Number(maps[levelIndex]) / 10).toString()
            ].colors.background.toString();

            Array.from(
              this.endScreen.childNodes[1].childNodes[0].childNodes,
            ).forEach((c: HTMLSpanElement, i) => {
              c.style.backgroundColor =
                chapters[
                  Math.floor(Number(maps[levelIndex]) / 10).toString()
                ].colors.endscreencolors[i];
            });
          }
        } else if (levelIndex === 9) {
          // endscreeen 2
          await new Promise(r => setTimeout(r, 200));
          if (this.endScreen2 !== null) {
            if (this.urlbar !== null) {
              this.urlbar.innerText = 'https://nilo.com/index.html';
            }
            this.game.engine.context.clearRect(
              0,
              0,
              this.game.engine.context.canvas.width,
              this.game.engine.context.canvas.height,
            ),
              (this.endScreen2.style.visibility = 'visible');

            this.game.engine.context.canvas.style.backgroundColor = chapters[
              Math.floor(Number(maps[levelIndex]) / 10).toString()
            ].colors.background.toString();
          }
        } else {
          this.game.begin();
          this.game.engine.map.loadLevel(maps[levelIndex + 1]);
          this.game.run();
        }
      });
    }
  }

  // End Screen
  hideEndScreen(): void {
    if (this.endScreen !== null) {
      this.endScreen.style.visibility = 'hidden';
    }
  }

  // End Screen 2
  hideEndScreen2(): void {
    if (this.endScreen2 !== null) {
      this.endScreen2.style.visibility = 'hidden';
    }
  }

  // Full Screen
  toggleFullScreen(): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc: any = window.document;
    const docEl = doc.documentElement;

    const requestFullScreen =
      docEl.requestFullscreen ||
      docEl.mozRequestFullScreen ||
      docEl.webkitRequestFullScreen ||
      docEl.msRequestFullscreen;
    const cancelFullScreen =
      doc.exitFullscreen ||
      doc.mozCancelFullScreen ||
      doc.webkitExitFullscreen ||
      doc.msExitFullscreen;

    if (
      !doc.fullscreenElement &&
      !doc.mozFullScreenElement &&
      !doc.webkitFullscreenElement &&
      !doc.msFullscreenElement
    ) {
      requestFullScreen.call(docEl);
    } else {
      cancelFullScreen.call(doc);
    }
    window.screen.orientation.lock('landscape');
  }

  // refresh button
  refresh = (): void => {
    if (!Tiles.reload) {
      const player = this.game.engine.player;
      if (player !== undefined) {
        player.state.falling = true;
      }
      Tiles.reload = true;
      zzfx(
        1,
        0,
        7865,
        0.1,
        0.11,
        0,
        0,
        1.6,
        -1.8,
        0.3,
        -500,
        -0.09,
        0.01,
        0.2,
        0,
        0,
        0.13,
        0.64,
        0.18,
        0,
      ); // refresh;

      Tiles.tiles[1].setSolid(false);
      Tiles.tiles[2].setSolid(false);
      Tiles.tiles[3].setSolid(false);
      setTimeout(function () {
        Tiles.reload = false;
        Tiles.tiles[1].setSolid(true);
        Tiles.tiles[2].setSolid(true);
        Tiles.tiles[3].setSolid(true);
      }, 200);
    }
  };

  // Hide all interface.
  hideall(): void {
    this.hideEndScreen();
    this.hideEndScreen2();
    this.hide();
    this.hideChapters();
    this.hidelevels();
  }
}
