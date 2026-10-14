/**
 * Created by ehtd on 9/7/15.
 */

var Door = function(ctx, image, tileId, width, height, x, y) {
    this.ctx = ctx;
    this.image = image;
    this.tileId = tileId;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.isOpen = false;
    this.toggledValue = false;
};

Door.prototype = new Sprite();
Door.prototype.constructor = Door;

Door.prototype.openDoor = function() {

    if (this.toggledValue) return;

    this.toggledValue = true;
    this.isOpen = true;
    console.log("Door is open");

    this.tileId = 8;
};