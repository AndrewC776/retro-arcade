/**
 * Created by ehtd on 9/7/15.
 */

var TiledBackground = function(ctx, image, tileId, tileSize) {
    this.ctx = ctx;
    this.image = image;
    this.tileId = tileId;
    this.width = tileSize;
    this.height = tileSize;
    this.tiles = [];
    this.generateTiles(13,13);
};

TiledBackground.prototype.generateTiles = function (width, height) {
    for (var i = 0; i < width; i++) {
        for (var j = 0; j<height; j++) {
            var s = new Sprite(this.ctx,
                this.image,
                this.tileId,
                this.width,
                this.height,
                i*this.width,
                j*this.width);
            this.tiles.push(s);
        }
    }
};

TiledBackground.prototype.update = function(dt) {
    this.tiles.forEach(function(tile) {
        tile.update(dt);
    });
};

TiledBackground.prototype.render = function() {
    this.tiles.forEach(function(tile) {
       tile.render();
    });
};