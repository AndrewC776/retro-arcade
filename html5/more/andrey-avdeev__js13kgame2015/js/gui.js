function GUI() {
    this.score = 1;
    this.ammo = 30;
    this.lives = 3;

    this.level = 1;
}
GUI.prototype.update = function () {
    this.score += $.dt;

    if (Math.floor(this.score / 10) > this.level) {
        this.level++;
        $.levelAsteroidsLength = $.utils.LevelAsteroids();
        if (this.level % 10 == 0) {
            this.lives++;
        }
    }
}
GUI.prototype.render = function () {
    //score
    $.ctxgui.font = "20px Arial";
    $.ctxgui.fillStyle = "red";
    $.ctxgui.textAlign = "center";
    $.ctxgui.fillText(Math.floor(this.score), 20, 30);

    //tips
    if (this.score < 3) {
        $.ctxgui.font = "18px Arial";
        $.ctxgui.fillStyle = "red";
        $.ctxgui.fillText("'R'/touch to reverse and shoot", 200, 30);
        $.ctxgui.fillText("Hold to see", 180, 50);
    }

    //ammo
    $.ctxgui.beginPath();
    $.ctxgui.strokeStyle = "red";
    $.ctxgui.lineWidth = 2;
    var startHeight = ($.height / 2) - ((this.ammo * 5) / 2);
    $.ctxgui.moveTo(10, startHeight);
    $.ctxgui.lineTo(10, startHeight + this.ammo * 5);
    $.ctxgui.stroke();

    console.log(this.ammo);

    //lives
    if (this.lives > 0) {
        for (var i = 0; i < this.lives; i++) {
            $.ctxgui.beginPath();
            $.ctxgui.fillStyle = 'yellow';
            $.ctxgui.fillRect((i + 1) * 10, 40, 5, 5);
        }
    } else {
        if ($.timeDeath <= 0) {
            $.timeDeath = $.timeNow;
        }

        $.ctxgui.font = "25px Arial";
        $.ctxgui.fillStyle = "white";
        $.ctxgui.fillText("Game Over", $.width / 2 - 50, $.height / 2 - 25);

        var bestScore = this.getCookie("ReGravyBestScore");
        if (bestScore != null) {
            $.ctxgui.font = "10px Arial";
            if (this.score > bestScore) {
                this.setCookie("ReGravyBestScore", this.score);
                $.ctxgui.fillText("Best score : " + Math.floor(this.score), $.width / 2 - 50, $.height / 2 - 10);
            } else {
                $.ctxgui.fillText("Best score : " + Math.floor(bestScore), $.width / 2 - 50, $.height / 2 - 10);
            }
        } else {
            this.setCookie("ReGravyBestScore", this.score);
        }


        if ($.timeNow - $.timeDeath > 1500) {
            $.ctxgui.font = "18px Arial";
            $.ctxgui.fillText("'R'/touch to restart", $.width / 2 - 50, $.height / 2 + 25);
        }
    }

    //level
    $.ctxgui.font = "15px Arial";
    $.ctxgui.fillStyle = "black";
    $.ctxgui.textAlign = "left";
    $.ctxgui.fillText('Level ' + this.level, 10, $.height - 20);

    //author
    $.ctxgui.font = "10px Arial";
    $.ctxgui.fillStyle = "silver";
    $.ctxgui.textAlign = "center";
    $.ctxgui.fillText("Created by Andrew Avdeev for js13kgames 2015", $.width / 5, $.height);
}

GUI.prototype.restart = function () {
    this.lives = 3;

    for (var i = 0; i < $.laserbeamsLength; i++) {
        $.laserbeams[i].deactivate();
    }

    this.ammo = 30;

    this.score = 1;
    this.level = 1;
    $.levelAsteroidsLength = $.utils.LevelAsteroids();

    for (var i = $.levelAsteroidsLength; i < $.asteroidsLength; i++) {
        $.asteroids[i].refresh();
    }

    $.timePowerupBlow = $.timeNow;
    $.timePowerupImmortality = $.timeNow;

    $.g = 9.8

    $.player.refresh();
}

GUI.prototype.setCookie = function (name, value, expires, path, domain, secure) {
    $.doc.cookie = name + "=" + escape(value) +
      ((expires) ? "; expires=" + expires : "") +
      ((path) ? "; path=" + path : "") +
      ((domain) ? "; domain=" + domain : "") +
      ((secure) ? "; secure" : "");
}
GUI.prototype.getCookie = function (name) {
    var cookie = " " + $.doc.cookie;
    var search = " " + name + "=";
    var setStr = null;
    var offset = 0;
    var end = 0;
    if (cookie.length > 0) {
        offset = cookie.indexOf(search);
        if (offset != -1) {
            offset += search.length;
            end = cookie.indexOf(";", offset)
            if (end == -1) {
                end = cookie.length;
            }
            setStr = unescape(cookie.substring(offset, end));
        }
    }
    return (setStr);
}