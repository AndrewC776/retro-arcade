import { Game } from "@/common/types/game";

export const createMainLoop = (game: Game) => {
  const start = () => {
    game.update();
    requestAnimationFrame(start);
  };
  return start;
};
