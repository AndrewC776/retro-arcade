function Ball(id, data, colors) {

    this.id = id;
    this.data = data;
    this.x = 0;
    this.y = 0;
    this.r = 10;
    this.vx = 0;
    this.vy = 0;
    this.c = colors.base;
    this.ct = colors.invert;
    this.isAlive = true;
    this.isYoung = true;
    this.bumped = [];
    this.done = false;

    let ctx, bounds;
    let count = 0;
    const maxR = 120;
    const PI2 = 2 * Math.PI;
    const edgesBumped = {
        hor: false,
        vert: false
    };
    const fontFactors = [0.45, 0.35, 0.3];
    const getFont = () => {
        const fs = Math.round(this.r * fontFactors[data.complexity]);
        return `bold ${fs}px sans-serif`;
    };

    this.render = () => {
        if (this.isAlive) {
            ctx.fillStyle = this.c;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, PI2);
            ctx.fill();
            ctx.fill();
            ctx.fillStyle = this.ct;
            ctx.font = getFont();
            ctx.fillText(data.expression, this.x, this.y);
        }
    };

    this.bump = (id, vx, vy) => {
        if (!this.bumped.includes(id)) {
            this.c = 'red';
            this.ct = 'red';
            this.vx = vx * 1.1;
            this.vy = vy * 1.1;
            this.bumped.push(id);
            this.done = true;
        }
    };

    this.setData = data => {
        ctx = data.ctx;
        bounds = data.bounds;
        this.x = data.x;
        this.y = data.y;
        this.vx = data.vx;
        this.vy = data.vy;
    };

    this.update = () => {
        let dr = -4;
        if (!this.done) {
            count++;
            dr = count % 5 === 0 ? 1 : 0;
        }
        this.r += dr;
        this.r = this.r > maxR ? maxR : this.r;
        if (this.r <= 0) {
            this.isAlive = false;
        } else if (this.r > 30) {
            this.isYoung = false;
        }
        if (this.x + this.r > bounds.w || this.x - this.r < 0) {
            if (!edgesBumped.vert) {
                this.vx *= -1;
                edgesBumped.vert = true;
            }
        } else {
            edgesBumped.vert = false;
        }
        if (this.y + this.r > bounds.h || this.y - this.r < 0) {
            if (!edgesBumped.hor) {
                this.vy *= -1;
                edgesBumped.hor = true;
            }
        } else {
            edgesBumped.hor = false;
        }
        this.x += this.vx;
        this.y += this.vy;
    };

    this.intersects = other => {
        if (this.done) return false;
        const d = dist(this, other);
        return d < this.r + other.r;
    };

    function dist(a, b) {
        return Math.hypot(a.x - b.x, a.y - b.y);
    }
}
