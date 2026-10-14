export default class Vector2 {
  constructor(public x = 0, public y = 0) {}

  add(v: Vector2): Vector2 {
    this.x += v.x;
    this.y += v.y;
    return this;
  }

  sub(v: Vector2): Vector2 {
    this.x -= v.x;
    this.y -= v.y;
    return this;
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  distanceTo(v: Vector2): number {
    return Math.sqrt((this.x - v.x) ** 2 + (this.y - v.y) ** 2);
  }

  scale(s: number): Vector2 {
    this.x *= s;
    this.y *= s;
    return this;
  }

  divide(s: number): Vector2 {
    this.x /= s;
    this.y /= s;
    return this;
  }

  zero(): Vector2 {
    this.x = 0;
    this.y = 0;
    return this;
  }

  normalized(): Vector2 {
    return this.divide(this.length());
  }
}
