function Asteroid(params) {
    BaseObject.call(this, params);

    this.radius = params.radius;

    this.m = params.m;

    this.isRendered = false;
}
Asteroid.prototype.update = function () {
    //out of bounds
    if (!this.isRendered && (this.x - this.radius) <= $.width) {
        this.isRendered = true;
    }
    if (this.x + this.radius <= 0 || this.y + this.radius < 0 || this.y - this.radius > $.height) {
        this.deactivate();
    }

    //collisions
    for (var i = 0; i < $.wallsLength; i++) {
        if ($.utils.IsRectangleCircleCollides($.walls[i].x, $.walls[i].y, $.walls[i].width, $.walls[i].height, this.x, this.y, this.radius)) {
            if ($.walls[i].wallType === 'top') {
                this.y = $.walls[i].y + $.walls[i].height + this.radius;
                this.vy = 0;
            } else {
                this.y = $.walls[i].y - this.radius;
                this.vy = 0;
            }
        }
    }
    //update position
    this.x += this.vx * $.dt;
    this.y += ($.g * $.dt * $.dt / 2) + this.vy * $.dt;

    this.vy += $.dt * $.g * this.m;
}
Asteroid.prototype.render = function () {
    $.ctxfg.drawImage($.cPreAsteroids[Math.floor(this.radius)], Math.round(this.x - this.radius), Math.round(this.y - this.radius));
}

Asteroid.prototype.deactivate = function () {
    this.isRendered = false;
    this.isActive = false;
}
Asteroid.prototype.refresh = function () {
    var randomRadius = $.utils.Random(1, 10);

    this.x = $.width + $.utils.Random(10, 50);
    this.y = $.height / 2 + $.utils.Random(-50, 50);

    this.radius = randomRadius;
    this.m = Math.round(10 / randomRadius) * 2;

    this.isActive = true;
}