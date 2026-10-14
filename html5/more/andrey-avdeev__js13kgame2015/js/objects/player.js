function Player(params) {
    BaseObject.call(this, params);

    this.width = params.width;
    this.height = params.height;

    this.m = params.m;

    this.isImmortal = false;
}
Player.prototype.update = function () {
    //check immortality
    if (this.isImmortal) {
        if ($.timeNow - $.timeImmortality > 3000) {
            this.isImmortal = false;
        }
    }

    //out of bounds
    if (this.y <= 0 || this.y + this.height >= $.height) {
        $.explosions[this.index].refresh(this.x + this.width / 2, this.y + this.height / 2, 0);
        this.deactivate();
    }

    //collisions
    for (var i = 0; i < $.wallsLength; i++) {
        if ($.walls[i].isActive) {
            if ($.utils.IsRectanglesCollides(this.x, this.y, this.width, this.height, $.walls[i].x, $.walls[i].y, $.walls[i].width, $.walls[i].height)) {
                $.explosions[this.index].refresh(this.x + this.width / 2, this.y + this.height / 2, $.walls[i].vx);
                this.deactivate();
            }
        }
    }
    for (var i = 0; i < $.levelAsteroidsLength; i++) {
        if ($.asteroids[i].isActive) {
            if ($.utils.IsRectangleCircleCollides(this.x, this.y, this.width, this.height, $.asteroids[i].x, $.asteroids[i].y, $.asteroids[i].radius)) {
                $.asteroids[i].deactivate();

                $.explosions[this.index].refresh(this.x + this.width / 2, this.y + this.height / 2, $.asteroids[i].vx);
                if (!this.isImmortal) {
                    this.deactivate();
                }
            }
        }
    }
    for (var i = 0; i < $.powerupsLength; i++) {
        if ($.powerups[i].isActive) {
            if ($.utils.IsRectanglesCollides(this.x, this.y, this.width, this.height, $.powerups[i].x, $.powerups[i].y, $.powerups[i].width, $.powerups[i].height)) {
                $.powerups[i].deactivate();

                if (i == 0 || i == 1) {
                    $.gui.score += 10;
                }
                if (i == 2) {
                    $.timeImmortality = $.timeNow;
                    this.isImmortal = true;
                }
                if (i == 3) {
                    for (var k = 0; k < $.levelAsteroidsLength; k++) {
                        if ($.asteroids[k].isActive && $.asteroids[k].isRendered) {
                            $.asteroids[k].deactivate();
                            $.explosions[$.asteroids[k].index].refresh($.asteroids[k].x, $.asteroids[k].y, $.asteroids[k].vx);
                        }
                    }
                }

                $.utils.PlaySound([1, , 0.0714, , 0.4326, 0.3646, , 0.4309, , , , , , , , 0.5024, , , 1, , , , , 0.5]);
            }
        }
    }

    this.x += this.vx * $.dt;
    this.y += ($.g * $.dt * $.dt / 2) + this.vy * $.dt;

    this.vy += $.dt * $.g * this.m;
}
Player.prototype.render = function () {
    if (!this.isImmortal) {
        $.ctxfg.drawImage($.cPrePlayer, Math.round(this.x), Math.round(this.y));
    } else {
        $.ctxfg.drawImage($.cPreImmortalPlayer, Math.round(this.x), Math.round(this.y));
    }
}

Player.prototype.deactivate = function () {
    this.isActive = false;
    this.isRendered = false;

    $.utils.PlaySound([3, , 0.2785, 0.5342, 0.3971, 0.1444, , 0.2192, , , , 0.4179, 0.8065, , , 0.7405, , , 1, , , , , 0.21]);
    if (--$.gui.lives > 0) {
        this.refresh();
    }
}
Player.prototype.refresh = function () {
    this.isActive = true;
    this.isRendered = true;

    this.isImmortal = true;
    $.timeImmortality = $.timeNow;

    this.x = 50;
    this.y = $.height / 2;
    this.vy = 0;
}
Player.prototype.shoot = function () {
    var i = 0;
    while (i < $.laserbeamsLength && $.laserbeams[i].isActive) {
        i++
    }
    if (i < $.laserbeamsLength) {
        $.utils.PlaySound([2, , 0.1377, 0.1855, 0.2461, 0.6816, 0.0768, -0.3795, , , , , , 0.1207, 0.0623, , , , 1, , , , , 0.21]);
        $.laserbeams[i].refresh(this.x + this.width, this.y + this.height / 2);
        $.gui.ammo--;
    }
}