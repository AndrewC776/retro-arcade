function Rect({x, y, w, h, color}) {

    this.isStatic = true;
    let ctx = null;

    this.render = () => {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
    };

    this.setData = data => {
        ctx = data.ctx;
    };
}
