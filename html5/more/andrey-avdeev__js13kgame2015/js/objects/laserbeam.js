function LaserBeam(params) {
    BaseObject.call(this, params);

    this.width = params.width;
    this.height = params.height;

    this.isActive = false;
    this.isRendered = false;
}
LaserBeam.prototype.update = function () {
    //out of bounds
    if (this.x > $.width) {
        this.deactivate();
    }

    //collisions
    for (var i = 0; i < $.wallsLength; i++) {
        if ($.walls[i].isActive) {
            if ($.utils.IsRectanglesCollides(this.x, this.y, this.width, this.height, $.walls[i].x, $.walls[i].y, $.walls[i].width, $.walls[i].height)) {
                $.utils.PlaySound([3, , 0.01, , 0.213, 0.3374, , -0.6493, , , , , , , , , , , 1, , , , , 0.5]);
                this.deactivate();
            }
        }
    }
    for (var i = 0; i < $.levelAsteroidsLength; i++) {
        if ($.asteroids[i].isActive) {
            if ($.utils.IsRectangleCircleCollides(this.x, this.y, this.width, this.height, $.asteroids[i].x, $.asteroids[i].y, $.asteroids[i].radius)) {
                this.deactivate();

                $.asteroids[i].isActive = false;
                $.asteroids[i].isRendered = false;

                if ($.utils.Random(0, $.powerupsSpawnRate) > $.powerupsSpawnRate * 9 / 10) {
                    var k = 0;
                    while (k < $.powerupsLength && $.powerups[k].isActive) {
                        k++;
                    }
                    if (k < $.powerupsLength) {
                        if (!$.powerups[2].isActive && $.timeNow - $.timePowerupImmortality > 10000) {
                            k = 2;
                        }
                        if (!$.powerups[3].isActive && $.timeNow - $.timePowerupBlow > 20000) {
                            k = 3;
                        }
                        if (k == 0 || k == 1) {
                            $.powerups[k].refresh($.asteroids[i].x, $.asteroids[i].y);
                        }
                        if (k == 2) {
                            $.timePowerupImmortality = $.timeNow;
                            $.powerups[k].refresh($.asteroids[i].x, $.asteroids[i].y);
                        }
                        if (k == 3) {
                            if ($.timeNow - $.timePowerupBlow > 20000) {
                                $.timePowerupBlow = $.timeNow;
                                $.powerups[k].refresh($.asteroids[i].x, $.asteroids[i].y);
                            }
                        }
                    }
                }

                $.utils.PlaySound([3, , 0.1434, 0.6081, 0.2012, 0.0568, , 0.0091, , , , , , , , , , , 1, , , , , 0.21]);
                $.explosions[$.asteroids[i].index].refresh($.asteroids[i].x, $.asteroids[i].y, $.asteroids[i].vx);
            }
        }
    }

    this.x += this.vx * $.dt;
}
LaserBeam.prototype.render = function () {
    $.ctxfg.drawImage($.cPreLaserBeam, Math.round(this.x), Math.round(this.y));
}

LaserBeam.prototype.deactivate = function () {
    this.isActive = false;
    this.isRendered = false;

    if ($.gui.ammo < $.laserbeamsLength) {
        $.gui.ammo++;
    }

}
LaserBeam.prototype.refresh = function (x, y) {
    this.x = x;
    this.y = y;

    this.isActive = true;
    this.isRendered = true;
}