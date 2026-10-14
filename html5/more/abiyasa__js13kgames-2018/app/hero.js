window.gamehame = window.gamehame || {};

gamehame.Base = class Base {
  update(dt) {
    this.sprite && this.sprite.update(dt);
  }

  render() {
    this.sprite && this.sprite.render();
  }

  collidesWith(target) {
    return this.sprite.collidesWith(target.sprite);
  }
}

gamehame.Hero = class Hero extends gamehame.Base {
  constructor(posX, posY) {
    super();

    this.maxSpeed = 3;
    this.connectionTime = 3;
    this.isDead = false;

    this.sprite = kontra.sprite({
      x: posX,
      y: posY,
      color: 'grey',
      width: 20,
      height: 40,
      dx: 0,
      dy: 0,

      isConnecting: false,
      connectionCountdown: this.connectionTime,

      render: function () {
        this.draw();

        const ctx = this.context;
        ctx.save();
        if (this.isConnecting) {
          ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
          ctx.fillRect(this.x, this.y, this.width, this.height);

          ctx.font = "bold 20px sans-serif";
          ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
          const timer = Math.ceil(this.connectionCountdown);
          ctx.fillText(timer, this.x + 4, this.y + this.height / 2);
        }
        ctx.restore();
      }
    });
  }

  update(dt) {
    this.sprite.dx = 0;
    this.sprite.dy = 0;
    if (!this.isDead) {
      if (kontra.keys.pressed('left')) {
        if (this.sprite.x > 0) {
          this.sprite.dx = -this.maxSpeed;
        }
      } else if (kontra.keys.pressed('right')) {
        if ((this.sprite.x + this.sprite.width) < kontra.canvas.width) {
          this.sprite.dx = this.maxSpeed;
        }
      }
      if (kontra.keys.pressed('up')) {
        if (this.sprite.y > 0) {
          this.sprite.dy = -this.maxSpeed;
        }
      } else if (kontra.keys.pressed('down')) {
        if ((this.sprite.y + this.sprite.height) < kontra.canvas.height) {
          this.sprite.dy = this.maxSpeed;
        }
      }

      if (this.sprite.isConnecting) {
        this.sprite.connectionCountdown -= dt;

        if (this.sprite.connectionCountdown < 0) {
          this.sprite.connectionCountdown = 0;
          this.isDead = true;
        }
      }
    }

    super.update();
  }

  isInCoverage(station) {
    const sprite = this.sprite;
    const dx = (sprite.x + (sprite.width / 2) - station.sprite.x);
    const dy = (sprite.y + sprite.height - station.sprite.y);
    const distanceSquare = (dx * dx) + (dy * dy);

    return (distanceSquare <= (station.radius * station.radius));
  }

  connect() {
    this.sprite.isConnecting = true;
  }

  disconnect() {
    this.sprite.isConnecting = false;
    this.sprite.connectionCountdown = this.connectionTime;
  }
}
