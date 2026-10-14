import Vector2 from './vector';
import Engine from './engine';
import { lerp } from './utils';
import Tiles from './tiles';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const zzfx: any;
export default class Player {
  public width = 30;

  public height = 30;

  public color = 'red';

  public speed: number;

  public velGoal = 0;

  public velocity: Vector2 = new Vector2(0, 0);

  public gravity: Vector2 = new Vector2(0, 4200);

  public jumpHeight = 6;

  public jumpVelocity: number;

  public pcolor = '#000';

  public pos: Vector2;

  private engine: Engine;
  private ctx: CanvasRenderingContext2D;

  public state = {
    falling: false,
    jumping: false,
    jumpStartHeight: 0,
    dead: false,
    jumpPad: false,
  };

  private static Instance: Player = new Player();

  public static getInstance(): Player {
    return this.Instance;
  }

  init(ctx: CanvasRenderingContext2D, engine: Engine, pos: Vector2): void {
    this.ctx = ctx;
    this.engine = engine;
    this.pos = pos;
    this.state.dead = false;
    this.state = {
      falling: false,
      jumping: false,
      jumpStartHeight: 0,
      dead: false,
      jumpPad: false,
    };
    this.speed = 400;
    this.jumpVelocity = -1200;
    const d = document.getElementById('events');
    d?.dispatchEvent(new Event('playerinit'));
  }

  // update player
  update(dt: number): void {
    if (this.state.dead) {
      return;
    }
    this.velGoal = 0;

    let mdt = 1000;

    // Controls

    // left
    if (this.engine.controls.control.left) {
      if (this.velocity.x > 0) mdt = 2000;
      this.velGoal = -this.speed;
    }

    // right
    if (this.engine.controls.control.right) {
      if (this.velocity.x < 0) mdt = 2000;
      this.velGoal = this.speed;
    }

    // jump
    if (this.engine.controls.control.up && !this.state.jumping) {
      this.velocity.y = this.jumpVelocity;
      this.state.jumping = true;
      this.state.jumpStartHeight = this.pos.y;
      this.state.falling = true;

      // eslint-disable-next-line no-sparse-arrays
      zzfx(
        0.4,
        0,
        564,
        0,
        0.01,
        0.01,
        0,
        0,
        1.3,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0.4,
        0.03,
        0,
      ); // jump
    }

    this.velocity.x = lerp(this.velGoal, this.velocity.x, dt * mdt);

    // collision in x axis
    let colx = false;
    if (this.velocity.x !== 0) {
      this.state.falling = true;
      const w = this.velocity.x < 0 ? 0 : this.width;
      colx =
        this.checkCollision(
          new Vector2(this.pos.x + this.velocity.x * dt + w, this.pos.y + 1),
        ) ||
        this.checkCollision(
          new Vector2(
            this.pos.x + this.velocity.x * dt + w,
            this.pos.y + this.height,
          ),
        );
      if (
        this.pos.x + this.velocity.x * dt + w >
          this.engine.map.worldWidth * Tiles.TilesWidth - Tiles.TilesWidth ||
        this.pos.x + this.velocity.x * dt + w < 0 + Tiles.TilesWidth
      ) {
        colx = true;
      }
    }

    if (colx) this.velocity.x = 0;

    // adding gravity
    if (this.state.falling) {
      this.velocity.y += this.gravity.y * dt;
    }

    // collision in y axis
    let coly = false;
    if (this.velocity.y !== 0 && !this.state.dead) {
      const h = this.velocity.y < 0 ? 0 : this.height;
      coly =
        this.checkCollision(
          new Vector2(this.pos.x, this.pos.y + this.velocity.y * dt + h),
          true,
          h !== 0,
        ) ||
        this.checkCollision(
          new Vector2(
            this.pos.x + this.width,
            this.pos.y + this.velocity.y * dt + h,
          ),
          true,
          h !== 0,
        );
      if (
        this.pos.y + this.velocity.y * dt + h >
          this.engine.map.worldHeight * Tiles.TilesHeight - Tiles.TilesHeight ||
        this.pos.y + this.velocity.y * dt + h < 0 + Tiles.TilesHeight
      ) {
        coly = true;
      }
      if (coly) {
        const tvel = this.velocity.y * dt;
        this.velocity.y = 0;
        if (h === 0) {
          if (
            this.checkCollision(
              new Vector2(
                this.pos.x,
                this.pos.y + this.gravity.y * dt + this.height,
              ),
              true,
            ) ||
            this.checkCollision(
              new Vector2(
                this.pos.x + this.width,
                this.pos.y + this.gravity.y * dt + this.height,
              ),
              true,
            )
          ) {
            this.velocity.y += this.gravity.y * dt;
            this.state.falling = true;
          }
        } else {
          if (tvel > 2) {
            this.state.falling = true;
          } else {
            this.state.falling = false;
          }

          this.state.jumping = false;
        }
      }
    }

    // Jumppad
    if (this.state.jumpPad) {
      this.velocity.y = this.jumpVelocity * 1.5;
      this.state.jumpPad = false;
      this.state.falling = true;
    }

    // reset velocity on ground
    if (!this.state.falling) {
      this.velocity.y = 0;
    }

    if (this.state.dead) this.velocity.x = 0;

    this.pos.add(new Vector2(this.velocity.x * dt, this.velocity.y * dt));
  }

  draw(): void {
    this.ctx.save();
    this.ctx.fillStyle = this.pcolor;
    this.ctx.fillRect(
      this.pos.x - this.engine.camera.pos.x,
      this.pos.y - this.engine.camera.pos.y,
      this.width,
      this.height,
    );
    this.ctx.restore();
  }

  // Axis Aligned Bounding box collision
  checkCollision(pos: Vector2, verticle = false, bottom = false): boolean {
    if (this.state.dead) return false;
    const tilepos = new Vector2(
      Math.floor(pos.x / Tiles.TilesWidth) * Tiles.TilesWidth,
      Math.floor(pos.y / Tiles.TilesHeight) * Tiles.TilesHeight,
    );
    if (typeof this.engine.map.level !== 'undefined') {
      const tile =
        typeof this.engine.map.level.map[tilepos.y / Tiles.TilesWidth] ===
          'undefined' ||
        typeof this.engine.map.level.map[tilepos.y / Tiles.TilesWidth][
          tilepos.x / Tiles.TilesHeight
        ] === 'undefined'
          ? 0
          : this.engine.map.level.map[tilepos.y / Tiles.TilesWidth][
              tilepos.x / Tiles.TilesHeight
            ];
      const tileType = Tiles.getTile(tile);

      if (tile >= 1 && tileType.solid) {
        if (
          pos.x < tilepos.x + Tiles.TilesWidth &&
          pos.x + this.width > tilepos.x &&
          pos.y < tilepos.y + Tiles.TilesHeight &&
          pos.y + this.height > tilepos.y
        ) {
          if ((tile == 2 || tile == 7) && verticle) {
            this.dead();
            return false;
          }
          if (tile === 3 && verticle && bottom) {
            zzfx(
              1,
              -0.1,
              440,
              0.05,
              0.01,
              0.16,
              0,
              1.69,
              -17.7,
              0,
              0,
              0,
              0,
              0,
              0.4,
              0,
              0,
              0.65,
              0.01,
              0,
            ); // Jump pad
            this.state.jumpPad = true;
          }
          if (tile === 5) {
            const d = document.getElementById('events');
            if (d !== null) {
              zzfx(
                1,
                0,
                776,
                0.01,
                0.23,
                0,
                0,
                1.89,
                0,
                0,
                343,
                0.05,
                0.1,
                0,
                0,
                0,
                0,
                0.65,
                0,
                0.3,
              ); // end
              d.dispatchEvent(new Event('fileFound'));
            }
          }
          return true;
        }
      }
    }
    return false;
  }

  playDeadAnimation(dt: number): void {
    this.velocity.y += this.gravity.y * dt;
    this.pos.add(new Vector2(0, this.velocity.y * dt));
  }

  dead(): void {
    if (!this.state.dead) {
      zzfx(
        1,
        0.05,
        85,
        0,
        0.07,
        0.04,
        1,
        2.9,
        0,
        0,
        0,
        0,
        0,
        1.5,
        0,
        0,
        0.06,
        0.6,
        0.01,
        0.09,
      ); // death
      this.state.dead = true;
      this.speed = 0;
      this.jumpVelocity = 0;
      this.velocity.zero();
      const d = document.getElementById('events');
      if (d !== null) d.dispatchEvent(new Event('gameover'));
    }
  }
}
