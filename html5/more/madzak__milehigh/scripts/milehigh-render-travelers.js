/*globals MileHigh,World */
/*jshint unused: false */
'use strict';

/**
 * Some game settings that could go somewhere one day
 */
MileHigh.TRAVELER_INITIAL_COLOR_RGB = [0, 143, 255];
MileHigh.TRAVELER_COLOR_HEX = '#008';

/**
 * Calculate heat color for paired travelers
 * @param {Number} heat Horniness value (higher is more)
 * @return {String} rgb color string
 */
MileHigh.prototype.getHeatColor = (function () {
  // Determine color gradient step values
  var rStep = 255 / (World.PAIRING_HEAT_THRESHOLD),
    gStep = MileHigh.TRAVELER_INITIAL_COLOR_RGB[1] / (World.PAIRING_HEAT_THRESHOLD),
    bStep = MileHigh.TRAVELER_INITIAL_COLOR_RGB[2] / (World.PAIRING_HEAT_THRESHOLD);

  // helpers grabbed from the web - I don't come up with this shit
  function rgbToHex(R,G,B) {
    return toHex(R)+toHex(G)+toHex(B);
  }
  function toHex(n) {
    n = parseInt(n,10);
    if (isNaN(n)) { return '00'; }
    n = Math.max(0,Math.min(n,255));
    return '0123456789ABCDEF'.charAt((n-n%16)/16) + '0123456789ABCDEF'.charAt(n%16);
  }

  return function (heat) {
    var r, g, b;

    r = MileHigh.TRAVELER_INITIAL_COLOR_RGB[0] + heat * rStep;
    g = MileHigh.TRAVELER_INITIAL_COLOR_RGB[1] - heat * gStep;
    b = MileHigh.TRAVELER_INITIAL_COLOR_RGB[2] - heat * bStep;
    //console.log('heat: ' + heat + ', color: ' + r + ',' + g + ',' + b);

    return rgbToHex(r, g, b);
  };
})();

MileHigh.prototype.renderTravelers = function (ctx, boardWidth, boardHeight) {

  var self = this;

  function renderTraveler (row, col, heat) {
    MileHigh.renderHappyFace(ctx, row, col, heat > 0 ? self.getHeatColor(heat) : MileHigh.TRAVELER_COLOR_HEX);
  }

  var travelers = this.world.travelers;

  for (var t = 0; t < travelers.length; t++) {
    if (!travelers[t].paired) {
      renderTraveler(travelers[t].y, travelers[t].x, travelers[t].heat);
    }
  }
};
