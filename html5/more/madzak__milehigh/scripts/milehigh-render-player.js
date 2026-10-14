/*globals MileHigh */
/*jshint unused: false */
'use strict';

MileHigh.prototype.renderPlayer = function renderPlayer(ctx) {

  var PIECE_SIZE = 25;    // pixels high and wide

  //ctx.fillStyle = '#a0a';
  //ctx.fillRect((this.player.x * PIECE_SIZE)+1, (this.player.y * PIECE_SIZE)+1, this.player.width, this.player.height);

  MileHigh.renderImageData(ctx, this.player.x, this.player.y, window.imgPlayer);

  var numberOfPairs = this.world.pairedTravelers().length;
  if (numberOfPairs > 0) {
    ctx.font = '20pt Webdings';
    ctx.fillStyle = 'red';
    ctx.textAlign = 'center';
    ctx.fillText('♥', this.player.x * PIECE_SIZE + PIECE_SIZE / 2, this.player.y * PIECE_SIZE + PIECE_SIZE / 2 + 12);

    ctx.font = '10pt Arial';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText(numberOfPairs + '', this.player.x * PIECE_SIZE + PIECE_SIZE / 2, this.player.y * PIECE_SIZE + PIECE_SIZE / 2 + 6);
  }

};
