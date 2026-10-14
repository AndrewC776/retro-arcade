function PowerUp(params) {
    BaseObject.call(this, params);

    this.width = params.width;
    this.height = params.height;

    this.isActive = false;
    this.isRendered = false;
}
PowerUp.prototype.update = function () {
    if (this.x < 0 || this.y < 0 || this.y > $.height) {
        this.deactivate();
    }

    this.x += this.vx * $.dt;
}
PowerUp.prototype.render = function () {
    $.ctxfg.drawImage($.cPrePowerups[this.index], Math.round(this.x), Math.round(this.y))
}

PowerUp.prototype.deactivate = function () {
    this.isActive = false;
    this.isRendered = false;
}
PowerUp.prototype.refresh = function (x, y) {
    this.x = x;
    this.y = y;

    this.isActive = true;
    this.isRendered = true;
}