function Tile(ctx, n, x, y, s, r) {
    'use strict';
    this.ctx = ctx;
    this.n = n;
    this.x = x;
    this.y = y;
    this.s = s;
    this.r = r;
    this.c = '#193441';
    var fs = Math.round(s / 2);
    this.font = '700 ' + fs + 'px fantasy';
    this.moves = {
        right: ['x', 1],
        left: ['x', -1],
        up: ['y', -1],
        down: ['y', 1]
    };
}

Tile.prototype.draw = function() {
    var it = this;
    it.ctx.roundRect(it.x, it.y, it.s, it.s, it.r);
    it.ctx.fillStyle = it.c;
    it.ctx.fill();

    it.ctx.font = it.font;
    it.ctx.strokeStyle = '#91AA9D';
    it.ctx.lineWidth = 1;
    it.ctx.strokeText(it.n, it.x + it.s / 2, it.y + it.s / 2);
};

Tile.prototype.update = function(dir, dt) {
    var m = this.moves[dir];
    var k = m[0] + '_init';
    if (dt === 0) {
        this[k] = this[m[0]];
    } else {
        this[m[0]] = this[k] + m[1] * (this.s + this.r) * dt;
    }
};
