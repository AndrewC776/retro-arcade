function Wall(params) {
    BaseObject.call(this, params);

    this.width = params.width;
    this.height = params.height;

    this.wallType = params.wallType;

    this.isLastTop = false;
    this.isLastBottom = false;

    this.isRendered = false;
}
Wall.prototype.update = function () {
    if (!this.isRendered && this.x <= $.width) {
        this.isRendered = true;
    }
    if (this.x + this.width <= 0) {
        this.isRendered = false;

        if (this.wallType === 'top') {
            this.x = $.walls[$.lastTopWallindex].x + $.walls[$.lastTopWallindex].width + 1;
            this.y = Math.round($.utils.Random(-(this.height - 10), 0));

            $.lastTopWallindex = this.index;
        }
        if (this.wallType === 'bottom') {
            this.x = $.walls[$.lastBottomWallindex].x + $.walls[$.lastBottomWallindex].width + 1;
            this.y = Math.round($.utils.Random($.height - this.height, $.height - 10));

            $.lastBottomWallindex = this.index;
        }
    }

    this.x += this.vx * $.dt;
}
Wall.prototype.render = function () {
    $.ctxfg.drawImage($.cPreWall, Math.round(this.x), Math.round(this.y));
}