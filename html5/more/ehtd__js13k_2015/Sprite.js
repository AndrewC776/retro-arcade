/**
 * Created by ehtd on 9/7/15.
 */

var MAXSPEED    = 32 * 4;

var Sprite = function(ctx, image, tileId, width, height, x, y) {
    this.ctx = ctx;
    this.image = image;
    this.tileId = tileId;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
};

Sprite.prototype.update = function(dt) {
    // Subclass
};

Sprite.prototype.render = function() {

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

Sprite.prototype.intersects = function (r1, r2) {
    return !(r2.left > r1.right ||
    r2.right < r1.left ||
    r2.top > r1.bottom ||
    r2.bottom < r1.top);
};

Sprite.prototype.bounds = function () {
    var bounds = {};
    bounds.left = this.x;
    bounds.top = this.y;
    bounds.right = this.x + this.width;
    bounds.bottom = this.y + this.height;
    return bounds;
};

Sprite.prototype.newCollisionMask = function (x, y, width, height) {
    var bounds = {};
    bounds.left = x;
    bounds.top = y;
    bounds.right = x + width;
    bounds.bottom = y + height;
    return bounds;
};

Sprite.prototype.collided = function (group, mask) {

    var collided = false;
    for (var i = 0; i < group.length; i++) {
        var c = group[i];
        if (this.intersects(mask, c.bounds())){
            collided = true;
            break;
        }
    }
    return collided;
};