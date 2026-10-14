import GameObjectClass from "../gameObject";
import { TILE_SIZE } from "../setup";

export default class extends GameObjectClass {
  preventCollision = true;

  constructor(
    id: string,
    type: string,
    position: Vector,
    actionCommand: Command,
    color?: Color
  ) {
    super(id, type, position, color);
    this.w = TILE_SIZE;

    if (type !== "painter") this.h = TILE_SIZE * 1.5;
    else this.h = TILE_SIZE;

    this.onAction = (player: Player) => actionCommand(player);
  }
}

/*
1 => 8a4926
2 => 461c14
3 => 1e090d
*/