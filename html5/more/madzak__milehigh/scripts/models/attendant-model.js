'use strict';

/**
 * Flight attendant model
 * @param {Object} layout
 *   {Number} aisleCol, aisleRow 
 */
function Attendant (layout) {
  this.side = layout.aisleCol === 0 ? -1 : 1;
  this.x = this.originalX = layout.aisleCol;
  this.y = layout.aisleRow;
  this.direction = this.side > 0 ? 'l' : 'r';
  this.inSeat = true;
  this.speed = 1; // normal speed.  increase during turbulence?
  this.hasCart = true;
}

Attendant.prototype.walk = function () {
  // Move attenant to aisle
  this.inSeat = false;
};

Attendant.prototype.move = function () {
  this.x = this.getNextMoveLocationX();
};

/**
 * Checks if attendant and cart are on a square at x
 */
Attendant.prototype.hitTest = function (location) {
  if (this.inSeat) {
    return false;
  }
  // check for aisle match
  if (this.y !== location.y) {
    return false;
  }
  if (this.x === location.x) {
    return true;
  }
  if (this.hasCart && Math.abs(this.x - location.x) <= 2) {
    if (this.direction === 'l') {
      return location.x < this.x;
    } else {
      return location.x > this.x;
    }
  }
};

Attendant.prototype.getNextMoveLocationX = function () {
  return this.x + (this.direction === 'l' ? -1 : 1) * this.speed;
};

Attendant.prototype.getNextMoveCartLocationX = function () {
  return this.getNextMoveLocationX() + (this.direction === 'l' ? -2 : 2);
};

Attendant.prototype.returnToSeat = function () {
  this.direction = (this.direction === 'l') ? 'r' : 'l';
  this.speed = 2;
};

Attendant.prototype.sit = function () {
  this.speed = 1;
  this.inSeat = true; // hides attendant & cart
  this.direction = this.side > 0 ? 'l' : 'r';
  this.x = this.originalX;
};
