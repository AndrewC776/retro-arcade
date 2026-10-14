/**
 * Created by ehtd on 9/12/15.
 */

var Sword = function(x, y, tileId) {
    this.ctx = ctx;
    this.image = scaledMap;
    this.tileId = tileId;

    this.width = tileSize;
    this.height = tileSize;
    this.x = x;
    this.y = y;
    this.tickCount = 0;

    this.unlocked = false;
    this.sealed = false;

    this.alive = true;
};

Sword.prototype = new Sprite();
Sword.prototype.constructor = Sword;

Sword.prototype.render = function() {

    if (this.alive == false) return;

    var ox = this.tileId % 4;
    var oy = Math.floor(this.tileId / 4);
    var sx = ox * this.width;
    var sy = oy * this.height;

    ctx.drawImage(this.image,
        sx,
        sy,
        this.width,
        this.height,
        this.x,
        this.y,
        this.width,
        this.height);
};

Sword.prototype.update = function(dt) {

    if (this.alive == false) return;

    var nx = this.x;
    var ny = this.y;

    var d = Math.round(dt * MAXSPEED * 4);

    if (this.tileId == swordUp) {
        ny -= d;
    } else if (this.tileId == swordDown) {
        ny += d;
    }

    var mask = this.newCollisionMask(nx+5,ny+5,this.width-20, this.height-20);

    if (this.intersects(mask, hero.bounds())) {
        hero.fail();
        this.alive = false;
        return;
    }

    var collides = this.collided(walls, mask);
    if (collides){
        this.alive = false;
        return;
    }

    collides = this.collided(rocks, mask);
    if (collides){
        this.alive = false;
        return;
    }

    this.y = ny;

    if (this.y > tileSize*13 || this.y < 0) {
        this.alive = false;
    }
};

Sword.prototype.collided = function (group, mask) {

    var collided = false;
    for (var i = 0; i < group.length; i++) {
        var c = group[i];
        if (this.intersects(mask, c.bounds()) && c.tileId != bb){
            collided = true;
            break;
        }
    }
    return collided;
};

