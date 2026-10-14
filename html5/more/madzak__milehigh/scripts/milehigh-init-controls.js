/*globals MileHigh */
/*jshint unused: false */
'use strict';

MileHigh.prototype.initControls = function (player) {
  var world = this.world,
      touch = {};

  function move(dir) {
    var playerMove = new CustomEvent('audio', {detail: 'playerMove'});
    window.dispatchEvent(playerMove);
    if (dir === 'L' && world.canIMoveLeft(player)) {
      player.x--;
    } else if (dir === 'R' && world.canIMoveRight(player)) {
      player.x++;
    } else if (dir === 'U' && world.canIMoveUp(player)) {
      player.y--;
    } else if (dir === 'D' && world.canIMoveDown(player)) {
      player.y++;
    }
  }

  window.addEventListener('keydown', function(e) {
    if (e.keyCode === 37) {
      e.preventDefault();
      move('L');
    } else if (e.keyCode === 38) {
      e.preventDefault();
      move('U');
    } else if (e.keyCode === 39) {
      e.preventDefault();
      move('R');
    } else if (e.keyCode === 40) {
      e.preventDefault();
      move('D');
    }
  }, false);

  window.addEventListener('touchstart', function(e) {
    e.preventDefault();
    if (e.touches.length === 1) {
      touch.startX = e.touches[0].pageX;
      touch.startY = e.touches[0].pageY;
    }
  }, false);

  window.addEventListener('touchmove', function(e) {
    e.preventDefault();
    touch.stopX = e.touches[0].pageX;
    touch.stopY = e.touches[0].pageY;
  }, false);

  window.addEventListener('touchend', function(e) {
    e.preventDefault();
    if (touch.startY > touch.stopY + 100) {
      move('U');
    } else if (touch.startY < touch.stopY - 50) {
      move('D');
    } else if (touch.startX > touch.stopX - 50) {
      move('L');
    } else if (touch.startX < touch.stopX + 50) {
      move('R');
    }
  }, false);
};
