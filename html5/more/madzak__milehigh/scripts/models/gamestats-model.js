/*jshint unused: false */
/**
 * Game Stats model
 */
'use strict';

function GameStats() {
  this.turns = 0;
  this.scores = 0;
  this.attemptedScores = 0;
  this.failedScores = 0;
  this.levelsCompleted = 0;
  this.startTime = (new Date()).getTime(); // game start time
  // All the yummy stats can go here
}
