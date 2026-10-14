/*globals MileHigh,World */
'use strict';

/**
 * Rendering functions
 */

MileHigh.PIECE_SIZE = 25;

/**
 * square renderer
 */
MileHigh.renderSimpleSquare = function (ctx, row, col, fillStyle) {
  var y = row * MileHigh.PIECE_SIZE + 1,
      x = col * MileHigh.PIECE_SIZE + 1,
      width = MileHigh.PIECE_SIZE - 2,
      height = MileHigh.PIECE_SIZE - 2;

  ctx.fillStyle = fillStyle;
  ctx.fillRect(x, y, width, height);
};

MileHigh.renderHappyFace = function (ctx, row, col, fillStyle) {
  var y = row * MileHigh.PIECE_SIZE + 1,
      x = col * MileHigh.PIECE_SIZE + 1,
      width = MileHigh.PIECE_SIZE - 2,
      height = MileHigh.PIECE_SIZE - 2;

  ctx.fillStyle = fillStyle;
  ctx.fillRect(x, y, width, height);
  ctx.font = '21pt Times, Serif';
  ctx.fillStyle = '#9cf';
  ctx.textAlign = 'center';
  ctx.fillText('☺', col * MileHigh.PIECE_SIZE + MileHigh.PIECE_SIZE / 2, row * MileHigh.PIECE_SIZE + MileHigh.PIECE_SIZE / 2 + 8);
};

MileHigh.renderCartBlock = function (ctx, row, col, fillStyle) {
  var y = row * MileHigh.PIECE_SIZE + 1,
      x = col * MileHigh.PIECE_SIZE + 1,
      width = MileHigh.PIECE_SIZE - 2,
      height = MileHigh.PIECE_SIZE - 2;

  ctx.fillStyle = fillStyle;
  ctx.fillRect(x, y, width, height);
  ctx.font = '21pt Times, Serif';
  ctx.fillStyle = '#44a';
  ctx.textAlign = 'center';
  ctx.fillText('☵', col * MileHigh.PIECE_SIZE + MileHigh.PIECE_SIZE / 2, row * MileHigh.PIECE_SIZE + MileHigh.PIECE_SIZE / 2 + 8);
};


MileHigh.renderLavatory = function (ctx, row, col, fillStyle) {
  var y = row * MileHigh.PIECE_SIZE + 1,
      x = col * MileHigh.PIECE_SIZE + 1,
      width = MileHigh.PIECE_SIZE - 2,
      height = MileHigh.PIECE_SIZE - 2;

  ctx.fillStyle = fillStyle;
  ctx.fillRect(x, y, width, height);
  ctx.font = '17pt Times, Serif';
  ctx.fillStyle = 'red';
  ctx.textAlign = 'center';
  ctx.fillText('♥', col * MileHigh.PIECE_SIZE + MileHigh.PIECE_SIZE / 2, row * MileHigh.PIECE_SIZE + MileHigh.PIECE_SIZE / 2 + 8);
};

MileHigh.renderImageData = function (ctx, row, col, img) {
  var x = row * MileHigh.PIECE_SIZE;
  var y = col * MileHigh.PIECE_SIZE;
  ctx.drawImage(img, x, y);
};

MileHigh.prototype.render = function (ctx, width, height) {
  this.beginRendering(ctx, width, height);
  this.renderPlane(ctx, this.world.planeLayout, width, height);
  this.renderTravelers(ctx, this.world.travelers, width, height);
  this.renderCrew(ctx);
  this.renderPlayer(ctx);
  this.renderHUD(ctx, this.gameStats, width, height);
  this.endRendering(ctx);
};

/**
 * Rendering hooks for moving the world
 */
MileHigh.prototype.beginRendering = function (ctx, width, height) {
  ctx.save();

  if (this.world.currentObstacle === World.Obstacle.TURBULENCE) {
    var r1 = Math.random(), r2 = Math.random(), off1 = r1 * 10, off2 = r2 * 10;
    this.jiggleX = (r1 * 10) % 2 === 0 ? -off1 : off1;
    this.jiggleY = (r2 * 10) % 2 === 0 ? -off2 : off2;

    ctx.translate(this.jiggleX, this.jiggleY);
  } else {
    ctx.clearRect(0, 0, width, height);
  }
};

MileHigh.prototype.endRendering = function (ctx) {
  ctx.translate(-this.jiggleX, -this.jiggleY);
  ctx.restore();
};
