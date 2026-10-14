import { OhajikiGame } from "@/2026/game";
import { createMainLoop } from "@/common/game";

const main = (): void => {
  const levelArea = document.getElementById("levelArea");
  if (!levelArea) {
    return;
  }

  const startGame = (marbleCount: number): void => {
    document.getElementById("menu")?.classList.add("hidden");

    const game = new OhajikiGame(marbleCount);
    const start = createMainLoop(game);
    start();
  };

  const levels = [
    ["Easy", 4],
    ["Normal", 6],
    ["Hard", 8],
    ["Expert", 12],
  ] as const;
  levels.forEach(([level, count]) => {
    const button = document.createElement("button");
    button.className = "level-btn";
    button.textContent = `${level}\n(${count})`;
    button.onclick = () => startGame(count);
    levelArea.appendChild(button);
  });
};

main();
