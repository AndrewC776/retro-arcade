function Player(game, x, y) {

    this.x = x;
    this.y = y;
    this.r = 50;
    this.id = 'player';
    const color1 = '#611427';
    const color2 = '#958976';
    let isInit = false;
    this.data = {
      isCorrect: null
    };
    let ctx = null;
    let bounds = null;
    const PI2 = 2 * Math.PI;

    this.render = () => {
        if (!isInit) return;
        ctx.fillStyle = this.c1;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, PI2);
        ctx.fill();
        ctx.fillStyle = this.c2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r * 0.9, 0, PI2);
        ctx.fill();
    };

    this.reset = () => {
        this.c1 = color1;
        this.c2 = color2;
        this.isAlive = true;
        isInit = false;
    };

    this.bump = (a, b, c, isCorrect) => {
        if (isCorrect) {
            this.c1 = color2;
            game.onCorrect();
            setTimeout(() => {
                this.c1 = color1;
            }, 500);
        }else {
            this.c2 = color1;
            game.onFail();
        }
    };

    this.setData = data => {
        ctx = data.ctx;
        bounds = data.bounds;
        ctx.canvas.addEventListener('mousemove', e => {
            if (game.over) return;
            isInit = true;
            const {x, y} = getMousePosition(ctx.canvas, e);
            this.x = x;
            this.y = y;
        });
    };

    function getMousePosition(c, e) {
        const bcr = c.getBoundingClientRect();
        return {
            x: e.pageX - bcr.left,
            y: e.pageY - bcr.top
        };
    }

    this.update = () => {
    };

    this.intersects = other => {
        if (!isInit) return false;
        const d = dist(this, other);
        return d < this.r + other.r;
    };

    function dist(a, b) {
        return Math.hypot(a.x - b.x, a.y - b.y);
    }
}