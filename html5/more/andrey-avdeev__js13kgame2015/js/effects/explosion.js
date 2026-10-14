function Explosion(params) {
    BaseEffect.call(this, params);

    this.radius = 0;

    this.isActive = false;
    this.isRendered = false;
}
Explosion.prototype.update = function () {
    if (this.time >= this.timeMax) {
        this.deactivate();
    } else {
        this.time += $.dt;

        this.x += this.vx * $.dt;
        this.y += this.vy * $.dt;

        this.radius = this.time * 18;
    }
    //out of bounds
    if (this.x + this.radius < 0 || this.y + this.radius < 0 || this.y - this.radius > $.height) {
        this.deactivate();
    }
}
Explosion.prototype.render = function () {
    $.ctxfg.drawImage($.cPreExplosions[Math.floor(this.radius)], Math.round(this.x - this.radius), Math.round(this.y - this.radius));
}

Explosion.prototype.deactivate = function () {
    this.isActive = false;
    this.isRendered = false;
}
Explosion.prototype.refresh = function (x, y, vx) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.time = 0;
    this.radius = 0;
    this.isActive = true;
    this.isRendered = true;
}