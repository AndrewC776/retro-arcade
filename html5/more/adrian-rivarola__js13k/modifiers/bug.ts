import { TILE_SIZE, MAP_SIZE } from "../setup";
import Player from "../player";

import { addVectors } from "../utils";

export function createBug(pos: Vector) {
  return new Bug(pos);
}

const DIRECTIONS = [-1.75, 1.75];

class Bug extends Player {
  vel: Vector = [0, 0];
  asset = undefined;

  coolDown = 0;
  canBePicked: boolean;
  canStealItem: boolean;

  constructor(pos: Vector) {
    super("bug", pos, "lightgreen");

    this.type = "bug";
    this.w = this.h = TILE_SIZE / 2;

    this.canBePicked = Math.random() > 0.6;
    this.canStealItem = Math.random() > 0.5;

    let axis = Math.round(Math.random());
    this.vel[axis] = DIRECTIONS[Math.round(Math.random())];
    this.vel[1 - axis] = pos[axis] * 0.15;
  }

  setColor(newColor: Color) {
    this.owner?.setColor(newColor);
  }

  onAction(player: Player) {
    if (player.item) {
      if (player.item.type === "bug") {
        player.dropItem(false);
        this.evolve();

        return;
      }
      if (!this.item) this.pickItem(player.dropItem());

      return;
    }

    if (this.item) return player.pickItem(this.dropItem());

    if (this.canBePicked) return player.pickItem(this);
  }

  evolve() {
    this.canBePicked = false;

    this.scope *= 1.25;
    this.w *= 2;
    this.h *= 2;
    this.vel[0] *= 1.125;
    this.vel[1] *= 1.125;
  }

  accelerate() {}

  move() {
    this.accelerate();

    this.pos = addVectors(this.pos, this.vel);

    const limit = TILE_SIZE * 1.5;

    if (this.pos[0] < limit || this.pos[0] > MAP_SIZE - limit)
      this.vel[0] *= -1;
    if (this.pos[1] < limit || this.pos[1] > MAP_SIZE - limit)
      this.vel[1] *= -1;
  }

  update(level: GameObject[]) {
    this.updateOffset();

    !this.owner && this.move();

    if (this.item) {
      this.moveItem();
      return this;
    }

    if (this.coolDown > 0) {
      --this.coolDown;
      return this;
    }

    level = level.filter(
      (object) =>
        object.type === "item" ||
        (object.type === "player" && object.item?.type === "item")
    );

    const [target, dist] = this.getClosestObject(level);

    if (dist > this.scope)
      // target out of range
      return this;

    this.coolDown = 100;

    if (target.type === "item") {
      this.pickItem(target);
      return this;
    }

    this.canStealItem
      ? this.pickItem((target as Player).dropItem())
      : target.item.setColor("darkgreen");

    return this;
  }

  renderId() {}

  renderDetails(ctx: Ctx) {
    ctx.save();

    ctx.restore();
  }
}
