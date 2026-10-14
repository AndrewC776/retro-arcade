/**
 * Created by ehtd on 9/7/15.
 */

var Wall = function(ctx, image, tileId, width, height, x, y) {
    this.ctx = ctx;
    this.image = image;
    this.tileId = tileId;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
};

Wall.prototype = new Sprite();
Wall.prototype.constructor = Wall;
