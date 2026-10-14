function Utils() {
    var _this = this;

    this.Random = function (min, max) {
        return Math.random() * (max - min) + min;
    }

    this.IsCirclesCollides = function (x1, y1, r1, x2, y2, r2) {
        return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2)) < r1 + r2;
    }
    this.IsRectangleCircleCollides = function (x1, y1, w1, h1, x2, y2, r2) {
        var distX = Math.abs(x2 - x1 - w1 / 2);
        var distY = Math.abs(y2 - y1 - h1 / 2);

        if (distX > (w1 / 2 + r2)) { return false; }
        if (distY > (h1 / 2 + r2)) { return false; }

        if (distX <= (w1 / 2)) { return true; }
        if (distY <= (h1 / 2)) { return true; }

        var dx = distX - w1 / 2;
        var dy = distY - h1 / 2;
        return (dx * dx + dy * dy <= (r2 * r2));
    }
    this.IsRectanglesCollides = function (x1, y1, w1, h1, x2, y2, w2, h2) {
        return x1 < x2 + w2 &&
                x1 + w1 > x2 &&
                y1 < y2 + h2 &&
                y1 + h1 > y2;
    }

    this.PlaySound = function (params) {
        try {
            var soundURL = jsfxr(params);
            var player = new Audio();
            player.src = soundURL;
            player.play();
        } catch (e) {
            console.log(e.message);
        }
    }

    this.LevelAsteroids = function () {
        return Math.min($.levelMinimumAsteroidsLength * $.gui.level, $.asteroidsLength);
    }
}