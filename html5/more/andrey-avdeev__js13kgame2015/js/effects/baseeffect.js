function BaseEffect(params) {
    this.index = params.index;

    this.x = params.x;
    this.y = params.y;

    this.vx = params.vx;
    this.vy = params.vy;

    this.time = 0;
    this.timeMax = params.timeMax;

    this.isActive = true;
    this.isRendered = true;
}