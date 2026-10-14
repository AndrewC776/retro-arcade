/**
 * Created by ehtd on 9/8/15.
 */

var Chest = function(ctx, image, tileId, width, height, x, y) {
    this.ctx = ctx;
    this.image = image;
    this.tileId = tileId;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.isOpen = false;
    this.hasKey = true;
};

Chest.prototype = new Sprite();
Chest.prototype.constructor = Chest;

Chest.prototype.openChest = function() {

    if (this.isOpen) return;

    this.isOpen = true;
    console.log("Chest is open");

    this.tileId++;
};

Chest.prototype.pickKey = function() {

    if(this.hasKey == false) return;

    this.hasKey = false;

    console.log("Picked key");

    this.tileId++;
};
