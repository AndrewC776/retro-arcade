/*globals MileHigh */
/*jshint unused: false */

'use strict';

// HUD view renderer
// Called on every turn.  should update all play stats for the user.
// We should include a debug mode as well
MileHigh.prototype.renderHUD = function (ctx, stats, boardWidth, boardHeight) {
  var turnCounter = document.getElementById('turnCounter');
  var turnsLeftCounter = document.getElementById('turnsLeftCounter');
  turnCounter.textContent = stats.turns;
  turnsLeftCounter.textContent = this.maxTurns - stats.turns;
};

MileHigh.prototype.renderText = function (ctx, text, x, y) {
  ctx.textAlign = 'left';
  ctx.fillStyle = 'white';
  ctx.fillText(text, x, y);
};
