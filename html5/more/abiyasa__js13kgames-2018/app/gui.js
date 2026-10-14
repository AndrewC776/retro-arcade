window.gamehame = window.gamehame || {};
gamehame.GuiText = class GuiText extends gamehame.Base {
  constructor(posX, posY, width, text) {
    super();

    this.sprite = kontra.sprite({
      x: posX,
      y: posY,
      color: 'grey',
      width: width,
      height: 40,

      render: function () {
        this.draw();

        const ctx = this.context;

        ctx.font = 'bold 20px sans-serif';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        ctx.fillText(text, this.x, this.y + 25);

        ctx.restore();
      }
    })
  }
}
