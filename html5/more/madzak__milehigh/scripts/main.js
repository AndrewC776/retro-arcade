/*globals MileHigh, requestAnimationFrame, World */

'use strict';

// polyfill to support Chrome, Firefox 4, Safari 6 and IE 10
(function() {
  var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  window.requestAnimationFrame = requestAnimationFrame;
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
})();

(function() {
  var board = document.getElementById('gameCanvas');
  var ctx = board.getContext('2d');

  (function setup() {
    board.width = '975';
    board.height = '225';
  })();

  var milehigh = new MileHigh();

  function tick(timestamp) {
    milehigh.render(ctx, board.width, board.height);
    milehigh.nextTurn(timestamp);
  }

  function loop(timestamp) {
    // Is Game Over?
    if (milehigh.world.currentObstacle === World.Obstacle.LANDING) {
      document.getElementById('gameover-alert').classList.remove('hide');
      // TODO: Unregister events upon game over? Or allow restart of game?
      return;
    }
    requestAnimationFrame(loop);
    tick(timestamp);
  }

  function start() {
    loop();
    /** To scroll past URL on iPhone (not needed on iPad) **/
    window.addEventListener('load', function() {
      window.scrollTo(0, 1);
    }, false);
  }

  var imgSeat = new Image();
  imgSeat.src = 'images/seat.gif';

  var imgPlayer = new Image();
  imgPlayer.src = 'images/face.gif';

  imgPlayer.onload = function() {//i know, i know
    window.imgSeat = imgSeat;
    window.imgPlayer = imgPlayer;
    start();
  };

})();
