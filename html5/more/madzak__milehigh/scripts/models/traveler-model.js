/*jshint unused: false */
/**
 * Traveler object
 */

'use strict';

function Traveler (id, opts) {
  opts = opts || {};
  this.id = id;
  this.x = opts.x || 0;
  this.y = opts.y || 0;
  this.heat = 0;
  this.baseHeat = Math.floor(Math.random(10));
  this.encounters = 0; // number of times in bathroom
  this.blocks = 0; // number of times bathroom encounters failed
  this.paired = false;
  this.moving = false;
  this.returning = false;
  this.lavatoryUsage = 0;
  // other possible properties: frigidity or looseness, type: (flight
  // attendant, pilot, ...)
}

/*
 * Do the act of pairing a traveler. Expects newPosition to have an x and y property
 * to use as the travelers new position.
 */
Traveler.prototype.pair = function (newPosition) {
  this.paired = true;
  this.x = newPosition.x;
  this.y = newPosition.y;
  var playerMove = new CustomEvent('audio', {detail: 'whistle'});
  window.dispatchEvent(playerMove);

};

Traveler.prototype.unpair = function () {
  this.paired = false;
};

Traveler.prototype.canMove = function () {
  return (this.heat === 0) && !this.paired;
};

