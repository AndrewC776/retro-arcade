import Modifier from "./modifier";
import game from "../game";
import { TILE_SIZE } from "../setup";

export function createStorageServer(
  serverId: number,
  pos: Vector,
  task_: Task
) {
  let storage: GameObject[] = [],
    server: Modifier,
    task = task_,
    capacity = task.components.length;

  function resetServer(newTask: Task) {
    storage = [];
    task = newTask;
    capacity = newTask.components.length;
    server.color = "white";
  }

  function command(player: Player) {
    if (task.completed) return;

    server.color = "white";

    if (!player.item) {
      // retrive an object from storage, if any
      if (storage.length) {
        player.pickItem(storage.pop());
      }
    } else if (!player.item.item && storage.length < capacity) {
      // store player's item, and stop rendering it
      const playerItem = player.dropItem(false);
      storage.push(playerItem);

      if (playerItem.type === "bug") {
        storage.forEach((object) => {
          object.active = true;
        });

        storage.splice(0, storage.length);
      }

      if (storage.length === task.components.length) {
        task.completed = storage.every(
          ({ id, color }, idx) =>
            id === task.components[idx].itemId &&
            color === task.components[idx].color
        );

        if (task.completed) {
          server.color = "lightgreen";
          game.onTaskCompleted(resetServer);
        } else {
          server.color = "red";
          console.log({ task, storage });
        }
      }
    }
  }

  server = new Modifier(
    `Server #${serverId}`,
    "storage",
    pos,
    command,
    "white"
  );

  server.renderDetails = (ctx: Ctx) => {
    ctx.save();

    ctx.translate(-TILE_SIZE * 0.5, 10);
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    storage.forEach((object, idx) => {
      ctx.fillStyle = object.color;
      ctx.fillRect(
        0,
        idx * (TILE_SIZE / capacity),
        TILE_SIZE * 0.4,
        TILE_SIZE / capacity
      );
      ctx.strokeRect(
        0,
        idx * (TILE_SIZE / capacity),
        TILE_SIZE * 0.4,
        TILE_SIZE / capacity
      );
    });

    ctx.restore();
  };

  server.renderId = (ctx: Ctx) => {
    ctx.textAlign = "center";
    ctx.font = "bold 1rem monospace";
    ctx.fillText(
      `${storage.length}/${capacity}`,
      server.w * 0.5,
      server.h + 24
    );

    ctx.fillStyle = "white";
    ctx.fillText(server.id, server.w * 0.5, server.h + 12);
  };

  return server;
}
