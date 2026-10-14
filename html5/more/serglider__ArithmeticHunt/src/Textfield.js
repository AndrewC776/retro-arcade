function Textfield({x, y, color, fontSize, text = ''}) {

    this.text = text;
    this.prefix = '';
    this.id = 'TF';
    this.isStatic = true;
    const font = `${fontSize}px sans-serif`;
    let ctx = null;

    this.setText = text => {
        this.text = text;
    };

    this.setPrefix = text => {
        this.prefix = text;
    };

    this.render = () => {
        ctx.fillStyle = color;
        ctx.font = font;
        ctx.fillText(this.prefix + this.text, x, y);
    };

    this.setData = data => {
        ctx = data.ctx;
    };
}
