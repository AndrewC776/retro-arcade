import GameObjectClass from "./gameObject";
import ASSETS from "./assets";

import { TILE_SIZE, MAP_SIZE } from "./setup";

import { clamp, addVectors, getDistance, HUE_MAP } from "./utils";

export default class extends GameObjectClass implements Player {
  vel: Vector = [0, 0];
  item?: GameObject;
  maxSpeed = TILE_SIZE / 12;
  acc = 0.15;

  scope = TILE_SIZE * 1.5;

  constructor(
    id: string,
    gridPos: Vector,
    color: string,
    public controller?: Controller
  ) {
    super(id, "player", gridPos, color);

    this.scale *= 0.8;
    this.w = ASSETS.playerArms.width * this.scale;
    this.h = ASSETS.player.height * this.scale;

    this.maxSpeed *= this.scale;

    this.hue = HUE_MAP[color] || 0;
  }

  get rotation() {
    const [dx] = this.vel;
    if (dx > 0) return 0.15;
    if (dx < 0) return -0.15;
    return 0;
  }

  setColor(newColor: string) {
    if (HUE_MAP[newColor]) {
      this.hue = HUE_MAP[newColor];
      super.setColor(newColor);
    }
  }

  onResize(scaleTo: number) {
    super.onResize(scaleTo);

    this.maxSpeed *= scaleTo;
    this.scope *= scaleTo;
  }

  accelerate() {
    if (this.controller.left) this.vel[0] -= this.acc;
    else if (this.controller.right) this.vel[0] += this.acc;
    else this.vel[0] = 0;

    if (this.controller.up) this.vel[1] -= this.acc;
    else if (this.controller.down) this.vel[1] += this.acc;
    else this.vel[1] = 0;

    let s = this.maxSpeed;
    this.vel[0] = clamp(-s, s, this.vel[0]);
    this.vel[1] = clamp(-s, s, this.vel[1]);
  }

  move(level: GameObject[], blocks: Vector[]) {
    this.accelerate();
    this.updateOffset();

    const nextPos = addVectors(this.pos, this.vel);

    if (!this.owner) {
      let wallCollision = blocks.some(
        (pos) => getDistance(pos, nextPos) < TILE_SIZE * 0.85
      );

      if (wallCollision) return;

      let collision = level.some(
        (object) =>
          object.preventCollision &&
          getDistance(object.pos, nextPos) < TILE_SIZE * 0.85
      );

      if (collision) return;
    }

    this.pos = nextPos.map((coord) =>
      clamp(0, MAP_SIZE - this.w, coord)
    ) as Vector;

    this.item && this.moveItem();
  }

  moveItem() {
    this.item.pos = [...this.pos];
    this.item.pos[0] += (this.w - this.item.w) / 2;
    this.item.pos[1] -= this.h;
  }

  pickItem(item: GameObject) {
    // console.log(`${this.id} picked ${item.id}`);

    item.owner = this;
    item.active = true;
    item.offset = this.offset;
    item.offsetDirection = this.offsetDirection;

    this.item = item;
  }

  dropItem(isActive = true): GameObject {
    if (!this.item) return;

    const item = this.item;
    item.active = isActive;
    item.owner = null;

    this.item = null;
    // console.log(`${this.id} released ${item.id}`);

    return item;
  }

  update(level: GameObject[], blocks: Vector[]) {
    level = level.filter(
      (object) =>
        object.id !== this.id && !object.owner && this.id !== object.item?.id
    );

    this.move(level, blocks);

    if (this.controller.action) {
      this.controller.action = false;

      const [target, dist] = this.getClosestObject(level);
      if (dist < this.scope) target.onAction(this);
    }

    if (this.item && this.controller.release) this.dropItem();

    return this;
  }

  renderDetails(ctx: Ctx) {
    ctx.save();

    if (this.item) {
      // raise hands
      ctx.translate(0, this.h * 0.75);
      ctx.scale(1, -1);
    } else {
      ctx.translate(0, this.h * 0.25);
    }
    ctx.drawImage(ASSETS.playerArms, 0, 0, this.w, this.h);

    ctx.restore();
  }
}
