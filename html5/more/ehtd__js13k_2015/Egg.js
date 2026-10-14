/**
 * Created by ehtd on 9/7/15.
 */

var Egg = function(ctx, image, tileId, width, height, x, y) {
    this.ctx = ctx;
    this.image = image;
    this.tileId = tileId;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
};

Egg.prototype = new Sprite();
Egg.prototype.constructor = Egg;

Egg.prototype.collected = function() {
    console.log("Collected egg");
};

