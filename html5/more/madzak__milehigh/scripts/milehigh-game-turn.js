/*globals MileHigh,World */
/*jshint unused: false */
'use strict';

/*
  Main game mechanic.
  A turn happens each second.
*/

MileHigh.prototype.lastTurnTime = 0;
MileHigh.prototype.score = 0;

MileHigh.prototype.nextTurn = function (timestamp) {
  var secondsSinceLastTurn = Math.floor((timestamp - this.lastTurnTime) / 1000);

  if (!timestamp || this.lastTurnTime === 0 || secondsSinceLastTurn >= 1) {
    this.lastTurnTime = timestamp || 0;
    this.playTurn();
  }
};

/**
 * Update Score and update UI.
 * @param  {number} incrementScoreBy
 */
MileHigh.prototype.updateScore = function (incrementScoreBy) {
  var playerScore = new CustomEvent('audio', {detail: 'playerScore'});
  window.dispatchEvent(playerScore);
  this.score += incrementScoreBy;
  document.getElementById('score').textContent = this.score;
};

MileHigh.prototype.playTurn = function () {
  /* GAME RULES CALLED FROM HERE */
  //console.log('running logic for this turn ', this.lastTurnTime);

  this.moveNPOs();
  // There can be many states for the player.  Without implementing a damn
  // state machine, we need to use a basic switch statement to determine
  // which rules to apply.
  switch (this.player.state) {
  case World.PlayerState.HORNY:
    // Check for proximity to travelers.  If near one, transition to flirting
    this.checkForFlirting();
    break;
  case World.PlayerState.FLIRTING:
    // When near any traveler and not currently paired, increase traveler heat
    // level
    this.checkForPairing();
    break;
  case World.PlayerState.PAIRED:
    if (this.world.playerInLavatory()) {
      this.player.state = World.PlayerState.IN_LAVATORY;
    }
    break;
  case World.PlayerState.IN_LAVATORY:
    this.updateScore(this.world.pairedTravelers().length);
    this.resetPlayerState();
    //TODO: Play a sound too?
    break;
  }
  // Generate random obstacles and handle any
  switch (this.getObstacle()) {
  case World.Obstacle.LANDING:
    this.gameOver();
    break;
  case World.Obstacle.TURBULENCE_IMMINENT:
    this.seatBeltsAlert();
    break;
  case World.Obstacle.TURBULENCE:
    this.updateTurbulence();
    break;
  case World.Obstacle.SNACKS:
    // console.log('snack time!');
    this.addSnackCarts();
    break;
  }

  this.gameStats.turns++;
};

/**
 * Check for proximity to traveler.  Simply transition to flirting mode if we
 * are near any - must be in nearby seat or isle?.
 */
MileHigh.prototype.checkForFlirting = function () {
  var near = this.world.getNearbyTravelers({breakOnMatch: true});

  if (near.length === 0) {  // revert to horny state if moved away
    this.player.state = World.PlayerState.HORNY;
    this.world.resetTravelerHeatLevels();
    // console.log('player is horny');
    return;
  }

  if (near.length > 0) { // transition to flirting if near traveler
    this.player.state = World.PlayerState.FLIRTING;
    // console.log('player is flirting');
  }
};

/**
 * Check heat levels on nearby travelers and see if we should become paired.
 */
MileHigh.prototype.checkForPairing = function () {
  if (this.world.currentObstacle === World.Obstacle.TURBULENCE ||
      this.world.currentObstacle === World.Obstacle.TURBULENCE_IMMINENT) {
    return;
  }
  var near = this.world.getNearbyTravelers();

  if (near.length === 0) {  // revert to horny state if moved away
    this.player.state = World.PlayerState.HORNY;
  }
  // increment heat levels for nearby, and remove from those not or no longer nearby
  this.world.updateTravelerHeatLevels(near);

  this.pairedTravelers = this.world.travelersReadyToPair(near);
  if (this.world.travelersReadyToPair(near).length > 0) {
    this.player.state = World.PlayerState.PAIRED;

    // trigger travelers to pair with player
    var newLocation = this.player;
    this.pairedTravelers.forEach(function (traveler) {
      traveler.pair(newLocation);
    });
  }
};

/**
 * Resets player to initial state and clears all pairings
 */
MileHigh.prototype.resetPlayerState = function () {
  this.world.findTravelersARandomPlaceToSit(this.world.pairedTravelers());
  this.world.clearAllPairings();
  this.player.state = World.PlayerState.HORNY;
};

MileHigh.prototype.moveAttendants = function () {
  // Move attendants
  this.world.attendants.forEach(function (a) {
    if (!a.inSeat) {
      if (this.currentObstacle === World.Obstacle.TURBULENCE) {
        a.returnToSeat();
      }
      if (this.isAttendantAtEndOfAisle(a)) {
        a.sit();
      } else {
        if (this.canAttendantMoveTo({x: a.getNextMoveCartLocationX(), y: a.y})) {
          a.move();
        }
      }
    }
  }, this.world);
};

MileHigh.prototype.moveTravelers = function () {

  this.world.travelers.forEach(function (t) {
    // skip pairing travelers
    if (t.canMove()) {
      // skip randomly
      if (t.moving) {
        if (t.returning) {
          this.moveTravelerToSeat(t);
        } 
        else if (this.currentObstacle === World.Obstacle.TURBULENCE_IMMINENT ||
          this.currentObstacle === World.Obstacle.TURBULENCE) {

          this.startTravelerTripToSeat(t);
        } 
        else {
          this.moveTravelerToLavatory(t); 
        }
      }
      else if (this.numMovingNPOs < World.MAX_MOVING_NPOS && 
        Math.random() <= World.NPO_MOVE_PROBABILITY) {
        this.startTravelerTripToLavatory(t);
        this.numMovingNPOs++;
      }
    }
  }, this.world);
};

/**
 * In situations where a player is blocked by NPOs from moving anywhere we have
 * to take some action to allow gameplay to continue
 */
MileHigh.prototype.unblockPlayer = function () {
  // assume it's a traveler
  this.world.travelers.filter(function (t) {
    return t.moving;
  }).forEach(function (t) {
    if (this.world.isAdjacent(t, this.player)) {
      this.world.startTravelerTripToSeat(t);
    }
  }, this);
};

/**
 * Handles per-turn NPO logic
 */
MileHigh.prototype.moveNPOs = function () {

  this.moveAttendants();

  this.moveTravelers();

  if (this.world.isPlayerBlocked()) {
    // console.warn('Player is blocked!');
    this.unblockPlayer();
  }
};
