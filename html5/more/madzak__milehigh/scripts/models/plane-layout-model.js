/*
  PlaneLayout model
  */
'use strict';

function PlaneLayout(planeLayoutIn) {
  var planeLayout = [],
    firstRowLength = 0;

  this.aisles = [];

  // create layout array, count aisles
  for (var i=0; i < planeLayoutIn.length; i++) {
    if (i === 0) { firstRowLength = planeLayoutIn[i].length; }
    if (firstRowLength !== planeLayoutIn[i].length) {
      throw new Error('initPlaneLayout: Rows are not all the same length.');
    }
    planeLayout.push(planeLayoutIn[i].split(''));

    if (planeLayoutIn[i][0] === ' ') {
      this.aisles.push(i);
    }
  }
  this.planeLayout = planeLayout;
  this.width = firstRowLength;
  this.height = planeLayout.length;
  this.numAisles = this.aisles.length;
  this.lavs = [];

  var loc;
  // Keep track of lavatory locations
  for (var i = 0; i < this.width; i++) {
    for (var j = 0; j < this.height; j++) {
      loc = {x: i, y: j};

      if (this.isLocationALavatory(loc)) {
        this.lavs.push(loc);
      }
    }
  }
}

PlaneLayout.prototype.arrayForRender = function () {
  return this.planeLayout;
};

/* Find any seat, whether occupied or not */
PlaneLayout.prototype.findRandomSeat = function () {
  var y,
    x,
    totalRows = this.height,
    totalCols = this.width;

  while (true) {
    y = Math.floor((Math.random() * totalRows));
    x = Math.floor((Math.random() * totalCols));
    if (this.planeLayout[y][x] === 'O') {
      return { x: x, y: y };
    }
  }
};

/*
  Return true if seat is in arrayOfExistingSeats.

  A seat is in this format: {x: 1, y: 2}
  */
PlaneLayout.prototype.isSeatTaken = function (seat, arrayOfExistingSeats) {

  for (var t=0; t < arrayOfExistingSeats.length; t++) {
    if ((seat.y === arrayOfExistingSeats[t].y) && (seat.x === arrayOfExistingSeats[t].x)) {
      return true;
    }
  }
};

PlaneLayout.prototype.isLocationOutOfBounds = function (location) {
  // do some bounds checking
  if ((location.y < 0) || (location.x < 0) || (location.y > this.height - 1) || (location.x > this.width - 1)) {
    return true;
  }
  return false;
};

PlaneLayout.prototype.isLocationASeat = function (location) {
  if (this.isLocationOutOfBounds(location)) {
    return false;
  }
  if (this.planeLayout[location.y][location.x] === 'O') {
    return true;
  }
  return false;
};

PlaneLayout.prototype.isLocationALavatory = function (location) {
  if (this.isLocationOutOfBounds(location)) {
    return false;
  }
  if (this.planeLayout[location.y][location.x] === '+') {
    return true;
  }
  return false;
};

PlaneLayout.prototype.isLocationUnMoveable = function (currentLocation, newLocation) {
  var x = newLocation.x,
    y = newLocation.y;

  if (this.isLocationOutOfBounds(newLocation)) {
    return true;
  }

  switch (this.planeLayout[y][x]) {
  case 'O':
  case ' ':
  case '+':
    // ensure you can't move horizontally into or out of seats
    if (currentLocation.y === y) {    // only check if you're trying to move horizontally
      if (this.isLocationASeat(currentLocation) || this.isLocationASeat(newLocation)) {
        return true;
      }
    }
    return false;
  default:
    return true;
  }
};

PlaneLayout.prototype.atLeftEdge = function (currentLocation) {
  return (currentLocation.x === 0);
};

PlaneLayout.prototype.atRightEdge = function (currentLocation) {
  return (currentLocation.x === this.width - 1);
};

PlaneLayout.prototype.atTopEdge = function (currentLocation) {
  return (currentLocation.y === 0);
};

PlaneLayout.prototype.atBottomEdge = function (currentLocation) {
  return (currentLocation.y === this.height - 1);
};
