import { Sprite, Quadtree, Scene, Pool } from 'kontra';

// I may wish to use a Pool with pool.getAliveObjects()
// instead of the array method I'm doing now.
export default class SpriteState {
  quadTree: Quadtree;
  scene: Scene;
  pool: Pool;
  constructor(initialSprites: Sprite[] = [], scene?: Scene, pool?: Pool) {
    this.quadTree = Quadtree();
    this.scene = scene ?? Scene({ id: 'SpriteState' });
    this.scene.add(initialSprites);

    this.pool = pool ?? Pool({ create: Sprite });
  }

  forEach(callback: (sprite: Sprite) => void): void {
    this.scene.objects.forEach(callback);
  }

  push(sprite: Sprite): void {
    this.quadTree.add(sprite);
    if (sprite.type !== 'bullet') {
      this.scene.add(sprite);
    }

    if (import.meta.env.DEV) {
      window.sprites = this;
    }
  }

  get(index: number): Sprite {
    const sprite = this.scene.objects[index];
    return sprite;
  }

  length(): number {
    return this.scene.objects.length;
  }

  refresh(): void {
    this.quadTree.clear();
    this.quadTree.add(this.pool.getAliveObjects());
    this.quadTree.add(this.scene.objects);
  }

  clearDead(): void {
    this.scene.objects.forEach((obj) => {
      if (!obj.isAlive()) {
        this.scene.remove(obj);
      }
    });
  }

  update(dt: number): void {
    this.pool.update(dt);
    this.scene.update(dt);
  }

  render(): void {
    this.pool.render();
    this.scene.render();
  }
}
