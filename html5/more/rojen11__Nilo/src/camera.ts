import Vector2 from './vector';
import Player from './player';
import Engine from './engine';
import Tiles from './tiles';

export default class Camera {
  constructor(
    public pos: Vector2,
    public viewportWidth: number,
    public viewportHeight: number,
    public followed: Player,
    private engine: Engine,
  ) {}

  update(): void {
    // followed player
    if (this.followed !== null) {
      if (
        this.followed.pos.x > this.viewportWidth / 2 &&
        this.followed.pos.x <
          this.engine.map.worldWidth * Tiles.TilesWidth - this.viewportWidth / 2
      ) {
        this.pos.x = this.followed.pos.x - this.viewportWidth / 2;
      }
      if (
        this.followed.pos.y <
          this.engine.map.worldHeight * Tiles.TilesHeight -
            this.viewportHeight / 2 &&
        this.followed.pos.y > this.viewportHeight / 2
      ) {
        this.pos.y = this.followed.pos.y - this.viewportHeight / 2;
      }
    }
  }
}
