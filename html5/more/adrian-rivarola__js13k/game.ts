import ASSETS from "./assets";
import LEVELS from "./levels";
import { TILE_SIZE, MAP_SIZE } from "./setup";

import { displayMessage } from "./toast";

import {
  createBug,
  createPainter,
  createItemProvider,
  createStorageServer,
} from "./modifiers/";

import { createRandomObjective } from "./utils";

class Game implements GameState {
  isPaused = false;
  levelCompleted = false;
  endless = false;
  level = -1;
  score = 0;

  players: Player[] = [];
  objects: GameObject[] = [];
  blocks: Vector[] = [];

  tasks: Task[] = [];

  loadLevel(level: number) {
    this.level = level % LEVELS.length;
    this.objects = [...this.players];
    this.levelCompleted = false;
    this.isPaused = false;
    this.players.forEach((player) => player.resetPos());

    const config = LEVELS[this.level];

    this.endless = !!config.endless;

    this.tasks = config.servers.map(() =>
      createRandomObjective(config.items, config.colors)
    );

    this.blocks = config.blocks.map(
      (pos) => pos.map((coord) => coord * TILE_SIZE) as Vector
    );

    const providers = config.providers.map((pos, idx) =>
      createItemProvider(pos, config.items[idx])
    );

    const painters = config.painters.map((pos, idx) =>
      createPainter(pos, config.colors[idx])
    );

    const servers = this.tasks.map((objective, idx) =>
      createStorageServer(idx + 1, config.servers[idx], objective)
    );

    const bugs = config.bugs.map(createBug);

    this.objects.unshift(...providers, ...painters, ...servers, ...bugs);

    displayMessage(config.message, 10000);
  }

  resize(scaleTo: number) {
    this.objects.forEach((object) => object.onResize(scaleTo));

    this.blocks.forEach((pos) => {
      pos[0] *= scaleTo;
      pos[1] *= scaleTo;
    });
  }

  onTaskCompleted(resetServer: (newTask: Task) => void) {
    this.score += 3;

    if (this.endless) {
      const levelConfig = LEVELS[this.level];
      const newTask = createRandomObjective(
        levelConfig.items,
        levelConfig.colors
      );
      resetServer(newTask);

      const idx = this.tasks.findIndex((task) => task.completed);
      this.tasks[idx] = newTask;
    }

    this.levelCompleted = this.tasks.every((objective) => objective.completed);

    if (this.levelCompleted) {
      this.score += 2;
      setTimeout(() => this.loadLevel(this.level + 1), 3000);
    }
  }

  renderTasks(ctx: Ctx) {
    ctx.save();

    ctx.textAlign = "center";
    ctx.font = "14px bold";

    ctx.lineWidth = 1;
    ctx.translate(0, 20);

    this.tasks.forEach((objective, i) => {
      const xOffset = i > 0 ? 2.5 : 0.5;

      ctx.translate(TILE_SIZE * xOffset, 0);
      ctx.globalAlpha = objective.completed ? 0.5 : 1;

      ctx.fillStyle = "white";
      ctx.fillText(`Task# ${i + 1}`, TILE_SIZE, -1);

      objective.components.forEach(({ itemId, color }, j) => {
        ctx.fillStyle = color;
        ctx.fillRect(0, 19 * j, TILE_SIZE * 2, 18);
        ctx.strokeRect(0, 19 * j, TILE_SIZE * 2, 18);

        ctx.fillStyle = "black";
        ctx.fillText(
          itemId.substring(2, itemId.length - 2),
          TILE_SIZE,
          (1 + j) * 17
        );
      });
    });

    ctx.restore();
  }

  render(ctx: Ctx) {
    ctx.save();

    ctx.drawImage(ASSETS.floor, 0, 0, MAP_SIZE, MAP_SIZE);

    if (this.level === -1) {
      return;
    }

    if (this.isPaused) {
      ctx.fillStyle = "white";
      ctx.textAlign = "center";
      ctx.font = "2rem monospace";

      ctx.fillText("Game Paused", MAP_SIZE / 2, MAP_SIZE / 2);

      return;
    }

    this.blocks.forEach((pos) => {
      ctx.drawImage(ASSETS.block, pos[0], pos[1], TILE_SIZE, TILE_SIZE * 1.5);
    });

    this.renderTasks(ctx);

    this.objects.forEach((object) => {
      object.active && object.update(this.objects, this.blocks).render(ctx);
    });

    ctx.font = "1.5rem bold monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.fillText(`Score: ${this.score}`, TILE_SIZE * 14.5, TILE_SIZE / 2);

    ctx.restore();
  }
}

const game = new Game();

export default game;
