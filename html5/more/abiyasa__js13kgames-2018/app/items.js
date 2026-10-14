window.gamehame = window.gamehame || {};
gamehame.Station = class Station extends gamehame.Base {
  constructor(posX, posY, radius) {
    super();

    this.radius = radius;
    this.sprite = kontra.sprite({
      x: posX,
      y: posY,
      color: 'green',
      width: 20,
      height: 20,

      radius: radius,

      render: function () {
        this.draw();

        const ctx = this.context;
        ctx.save();

        // green transparent
        ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
        ctx.beginPath();
        ctx.arc(
          this.x + (this.width / 2),
          this.y + (this.height / 2),
          this.radius, 0, 2 * Math.PI
        );
        ctx.fill();

        ctx.restore();
      }
    });
  }
}

gamehame.Switch = class Switch extends gamehame.Base {
  constructor(posX, posY) {
    super();

    this.sprite = kontra.sprite({
      x: posX,
      y: posY,
      color: '#ff8080',
      width: 20,
      height: 20,
      off: false
    });
  }

  switchOff() {
    this.sprite.off = true;
  }

  isSwitchOff() {
    return this.sprite.off;
  }
}
