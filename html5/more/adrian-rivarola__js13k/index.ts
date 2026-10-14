import { createCanvas, onResize } from "./setup";
import { loadAssets } from "./assets";

import Player from "./player";
import { KeyboardController, VirtualController } from "./controller";
import game from "./game";

const mainDiv = document.getElementById("game"),
  start1Button = document.getElementById("start1"),
  start2Button = document.getElementById("start2");

onblur = () => (game.isPaused = true);

onload = () => {
  const { ctx } = createCanvas();

  const loop = () => {
    requestAnimationFrame(loop);
    game.render(ctx);
  };

  window.onresize = onResize;
  onResize();

  loadAssets().then(() => {
    loop();
  });

  if (window.orientation !== undefined) {
    start1Button.innerText = "Start";

    start2Button.style.display = "none";
  }

  start1Button.onclick = () => startGame(1);
  start2Button.onclick = () => startGame(2);
};

function startGame(n: number) {
  mainDiv.style.display = "none";

  game.players = createPlayers(n);
  game.loadLevel(0);
}

function createPlayers(n: number) {
  if (window.orientation !== undefined) {
    return [
      new Player("Player1", [7.5, 7.5], "orange", new VirtualController()),
    ];
  }

  let players = [
    new Player("Player1", [7.5, 7.5], "pink", new KeyboardController("wsadxc")),
  ];
  if (n === 2) {
    players.push(
      new Player(
        "Player2",
        [7.5, 6.5],
        "orange",
        new KeyboardController("824650")
      )
    );
  }

  return players;
}
