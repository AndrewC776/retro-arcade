/*globals PlaneLayout,Traveler,Attendant */
/*
  Model layer that answers questions about the plane layout, travelers and main player.
*/
'use strict';

function World(planeLayoutIn, totalTravelers, player) {
  this.planeLayout = new PlaneLayout(planeLayoutIn);
  this.player = player;
  this.player.state = World.PlayerState.HORNY; // a player's natural state
  this.currentObstacle = null;
  this.travelers = [];
  this.attendants = [];
  this.numMovingNPOs = 0;
  this.initRandomTravelersAtSpecificSeats(totalTravelers);
  this.initCrew();
}

/**
 * All possible states for a player.  We'll keep a flag to one of these
 * values on the player object
 */
World.PlayerState = {
  'HORNY': 1,
  'FLIRTING': 2,
  'PAIRED': 3,
  'IN_LAVATORY': 4
};

/**
 * All possible obstacles that can occur during a turn
 */
World.Obstacle = {
  'LANDING': 1,
  'TURBULENCE': 2,
  'SNACKS': 3,
  'TERRIST': 4,
  'TURBULENCE_IMMINENT': 5
};

/**
 * Difficulty settings
 */
World.PAIRING_HEAT_THRESHOLD    = 10;
World.NPO_MOVE_PROBABILITY      = 0.05;
World.MAX_MOVING_NPOS           = 3;
World.MAX_TRAVELER_LAVATORY_OCCUPANCY_TURNS = 3;
World.TURBULENCE_PROBABILITY    = 0.02;
World.SNACK_PROBABILITY         = 0.1;

World.prototype.initRandomTravelersAtSpecificSeats = function (totalTravelers) {
  var seatTaken,
    seatToTry,
    traveler;

  for (var i=0; i < totalTravelers; i++) {
    seatTaken = true;
    while (seatTaken) {
      seatToTry = this.planeLayout.findRandomSeat();
      seatTaken = this.planeLayout.isSeatTaken(seatToTry, this.travelers);
    }
    traveler = new Traveler('T' + i, seatToTry);
    // TODO: We should initialize a Traveler object or decorate the blob with random
    // traveler properties here
    this.travelers.push(traveler);
  }
};

World.prototype.initCrew = function () {
  // Add 1 attendant per aisle, on alternating ends of plane
  for (var i = 0, side = -1; i < this.planeLayout.aisles.length; i++) {
    this.attendants.push(new Attendant({
      aisleRow: this.planeLayout.aisles[i],
      aisleCol: (side === -1) ? 0 : this.planeLayout.width - 1
    }));
    side = -side;
  }
};

/*
  If at edge of board, return false, otherwise is the space next to me somewhere I can move
  and is the space available to be moved into?
*/
World.prototype.spaceNotAvailableToMoveTo = function (currentLocation, locationToCheck) {
  var x = locationToCheck.x,
    y = locationToCheck.y;

  // make sure map square is valid to move to (prior to checking if anyone else is actually there)
  if (this.planeLayout.isLocationUnMoveable(currentLocation, {x: x, y: y})) {
    return true;
  }

  // make sure no travelers are there
  for (var traveler = 0; traveler < this.travelers.length; traveler++) {
    if ((x === this.travelers[traveler].x) && (y === this.travelers[traveler].y) && (!this.travelers[traveler].paired)) {
      return true;
    }
  }
  // make sure not attendant or cart are there
  if (this.isAttendantAtLocation(locationToCheck)) {
    return true;
  }

  return false;
};

World.prototype.isAttendantAtLocation = function (locationToCheck) {
  for (var i = 0; i < this.attendants.length; i++) {
    if (this.attendants[i].hitTest(locationToCheck)) {
      return true;
    }
  }
};

World.prototype.canIMoveLeft = function (me) {
  var currentLocation = {x: me.x, y: me.y};
  if (this.planeLayout.atLeftEdge(currentLocation)) {
    return false;
  }
  if (this.spaceNotAvailableToMoveTo(currentLocation, {x: currentLocation.x - 1, y: currentLocation.y})) {
    return false;
  }
  return true;
};

World.prototype.canIMoveRight = function (me) {
  var currentLocation = {x: me.x, y: me.y};
  if (this.planeLayout.atRightEdge(currentLocation)) {
    return false;
  }
  if (this.spaceNotAvailableToMoveTo(currentLocation, {x: currentLocation.x + 1, y: currentLocation.y})) {
    return false;
  }
  return true;
};

World.prototype.canIMoveUp = function (me) {
  var currentLocation = {x: me.x, y: me.y};
  if (this.planeLayout.atTopEdge(currentLocation)) {
    return false;
  }
  if (this.spaceNotAvailableToMoveTo(currentLocation, {x: currentLocation.x, y: currentLocation.y - 1})) {
    return false;
  }
  return true;
};

World.prototype.canIMoveDown = function (me) {
  var currentLocation = {x: me.x, y: me.y};
  if (this.planeLayout.atBottomEdge(currentLocation)) {
    return false;
  }
  if (this.spaceNotAvailableToMoveTo(currentLocation, {x: currentLocation.x, y: currentLocation.y + 1})) {
    return false;
  }
  return true;
};

/**
 * Returns traveler at some location
 * @param {Object} location with x, y
 * @return {Traveler} or null 
 */
World.prototype.getTravelerAtLocation = function (location) {
  var traveler = null;

  for (var i = 0, len = this.travelers.length; i < len; i++) {
    if (this.travelers[i].x === location.x && this.travelers[i].y === location.y) {
      traveler = this.travelers[i];
      break;
    }
  }
  return traveler;
};

World.prototype.getClosestAisle = function (locationY) {
  var closest = this.planeLayout.aisles[0];

  for (var i = 1; i < this.planeLayout.aisles.length; i++) {
    if (Math.abs(this.planeLayout.aisles[i] - locationY) < closest) {
      closest = this.planeLayout.aisles[i];
    }
  }
  return closest;
};

/**
 * Checks if player is near a traveler for flirting.  Returns array of matches
 * @param {Object} opts
 *   {Boolean} breakOnMatch return after 1st match
 * @return {Array}
 */
World.prototype.getNearbyTravelers = function (opts) {
  var near = [],
      currentLocation = {x: this.player.x, y: this.player.y},
      testLocation = {};

  opts = opts || {};

  // Check all adjoining squares
  // OPTIMIZATION: Perhaps walking travelers array would be faster?
  for (var x = -1; x <= 1; x++) {
    testLocation.x = currentLocation.x + x;

    for (var y = -1; y <= 1; y++) {
      testLocation.y = currentLocation.y + y;

      if (this.planeLayout.isLocationASeat(testLocation) && this.planeLayout.isSeatTaken(testLocation, this.travelers)) {

        near.push(this.getTravelerAtLocation(testLocation));

        if (opts.breakOnMatch) {
          break;
        }
      }
    }
  }
  return near;
};

/**
 * Updates all traveler 'heat' levels
 * @param {Array} flirting List of currently flirting travelers
 */
World.prototype.updateTravelerHeatLevels = function (flirting) {
  var found;

  for (var i = 0, len = this.travelers.length; i < len; i++) {
    found = false;

    // lookup matching traveler by id
    for (var j = 0; j < flirting.length; j++) {
      if (flirting[j].id === this.travelers[i].id) {
        found = true;
        break;
      }
    }
    if (found) {
      this.travelers[i].heat += 1;
    } else {
      this.travelers[i].heat = 0;
    }
  }
};

World.prototype.resetTravelerHeatLevels = function () {
  for (var i = 0, len = this.travelers.length; i < len; i++) {
    this.travelers[i].heat = 0;
  }
};

/**
 * Return array of travelers ready to pair (since there may be more than one)
 */
World.prototype.travelersReadyToPair = function (flirting) {
  var pairsFound = [];

  for (var i = 0, len = this.travelers.length; i < len; i++) {
    // lookup matching traveler by id
    for (var j = 0; j < flirting.length; j++) {
      if (flirting[j].id === this.travelers[i].id) {
        if (this.travelers[i].heat >= World.PAIRING_HEAT_THRESHOLD) {
          pairsFound.push(this.travelers[i]);
        }
      }
    }
  }
  return pairsFound;
};

/**
 * Return all the travelers marked as "paired".
 *
 */
World.prototype.pairedTravelers = function () {
    return this.travelers.filter(function (traveler) {
      return traveler.paired;
    });
  };

/**
 * Return true if player is in the bathroom
 * @return {boolean}
 */
World.prototype.playerInLavatory = function () {
  if (this.planeLayout.isLocationALavatory(this.player)) {
    return true;
  }
  return false;
};

/*
 * Return true if player is blocked by npo
 */
World.prototype.isPlayerBlocked = function () {
  // 
  return !(this.canIMoveLeft(this.player) ||
      this.canIMoveRight(this.player) ||
      this.canIMoveUp(this.player) ||
      this.canIMoveDown(this.player)
      );
};

/**
 * Compares location of 2 locations, returns true if they are touching
 */
World.prototype.isAdjacent = function (p1, p2) {
    return (this.getCartesianDistance(p1, p2)) <= 1;
};

World.prototype.findTravelersARandomPlaceToSit = function (travelers) {
  var seatToTry,
    seatTaken,
    planeLayout = this.planeLayout,
    allTravelers = this.travelers;

  travelers.forEach(function (t) {
    seatTaken = true;

    while (seatTaken) {
      seatToTry = planeLayout.findRandomSeat();
      seatTaken = planeLayout.isSeatTaken(seatToTry, allTravelers);
    }
    t.x = seatToTry.x;
    t.y = seatToTry.y;
  });
};

/**
 * Finds closest lav to some person
 * @return {Object} x, y location of lav
 */
World.prototype.findClosestLavatoryTo = function (p) {
  var dist, minDist = this.planeLayout.width * 2;
  var loc, closest;

  this.planeLayout.lavs.forEach(function (l) {
    dist = this.getCartesianDistance(p, l);

    if (dist < minDist) {
      minDist = dist;
      closest = l;
    }
  }, this);
  return closest;
};

/**
 * Returns distance b/w 2 locations
 * @return {Number}
 */
World.prototype.getCartesianDistance = function (p1, p2) {
  return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
};

World.prototype.clearAllPairings = function () {
  this.travelers.forEach(function (traveler) {
    traveler.unpair();
  });
};

World.prototype.inTurbulence = function () {
  return this.currentObstacle === World.Obstacle.TURBULENCE;
};

World.prototype.isAttendantAtEndOfAisle = function (a) {
  if (a.direction === 'l') {
    if (a.hasCart) {
      return a.x <= 2;
    } else {
      return this.planeLayout.atLeftEdge(a);
    }
  } else {
    if (a.hasCart) {
      return a.x >= this.planeLayout.width - 3;
    } else {
      return this.planeLayoutatRightEdge(a);
    }
  }
};

World.prototype.canAttendantMoveTo = function (location) {
  return !(this.getTravelerAtLocation(location) ||
      (this.player.x === location.x && this.player.y === location.y));
};

/** 
 * Moves traveler one position
 */
World.prototype.startTravelerTripToLavatory = function (traveler) {
  traveler.moving = true;
  // save original seat location
  traveler.ogX = traveler.x;
  traveler.ogY = traveler.y;
  traveler.destination = this.findClosestLavatoryTo(traveler);
  // console.log('moving passenger ' + traveler.id + ' to lav at ', traveler.destination);
  // find closest aisle to target bathroom
  traveler.targetAisle = this.getClosestAisle(traveler.destination.y);
  // console.log('target aisle: ' + traveler.targetAisle);
};

World.prototype.startTravelerTripToSeat = function (traveler) {
  traveler.destination = {x: traveler.ogX, y: traveler.ogY};
  // find closest aisle to target seat
  traveler.returning = true;
  // console.log('moving back to seat', traveler.destination);
};

/**
 * move traveler to closer to bathroom, if possible
 */
World.prototype.moveTravelerToLavatory = function (traveler) {
  // if in bathroom
  if (traveler.x === traveler.destination.x && traveler.y === traveler.destination.y) {
    // increase their turn count
    traveler.lavatoryUsage++;
    // if turn count exceeded
    if (traveler.lavatoryUsage > World.MAX_TRAVELER_LAVATORY_OCCUPANCY_TURNS+1) {
      // move them back to a random seat
      traveler.lavatoryUsage = 0;
      this.startTravelerTripToSeat(traveler); 
    }
  } else {
    this.moveTraveler(traveler);
  }
};

World.prototype.moveTravelerToSeat = function (traveler) {
  // if in bathroom
  if (traveler.x === traveler.destination.x && traveler.y === traveler.destination.y) {
    // they are back at their seat!
    traveler.moving = traveler.returning = false;
    this.numMovingNPOs--;
    // console.log('traveler back at seat!', traveler.destination);
  } else {
    this.moveTraveler(traveler);
  }
};

// move helper - does collision detection
World.prototype.moveTraveler = function (traveler) {
  var px = traveler.x, 
      py = traveler.y;
  
  if (traveler.y === traveler.targetAisle && traveler.x === traveler.destination.x) {
    py += (traveler.destination.y > traveler.y) ? 1 : -1;
  } 
  else if (traveler.y !== traveler.targetAisle) {
    // handle returning to seat where seat is 2 squares from an aisle
    if (traveler.returning && (traveler.x === traveler.destination.x)) {
      py += (traveler.y > traveler.destination.y) ? -1 : 1;
    } else {
      py += (traveler.targetAisle > traveler.y) ? 1 : -1;
    }
  }
  else if (traveler.x !== traveler.destination.x) {
    px += (traveler.destination.x > traveler.x) ? 1 : -1;
  }
  // don't move onto player square
  if (this.player.x === px && this.player.y === py) {
    return;
  }
  // don't move onto a cart
  if (this.isAttendantAtLocation({x: px, y: py})) {
    // if in the aisle
    if (py === traveler.targetAisle) {
      // move into seat to get out of the way
      py += 1;
    }
  }
  // travelers can't enter occupied lavatory.  just send them back to seat
  if (this.planeLayout.isLocationALavatory({x: px, y: py}) &&
      this.player.x === px && this.player.y === py) {
    this.startTravelerTripToSeat(traveler);
    return;
  }

  // ok to move
  traveler.x = px;
  traveler.y = py;
};
