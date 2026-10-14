/*jshint unused: false */
/*globals World,GameStats */

'use strict';

var MileHigh = function () {

  var TOTAL_TRAVELERS = 20;

  var seven6seven = [
    '#OOOO# OOOOOOOOOOOOOO O OOOOOOOOOOOO###',
    '+OOOO# OOOOOOOOOOOOOO O OOOOOOOOOOOO+#+',
    '                                       ',
    '#OOOO# OOOOOOOOOOOOOOO OOOOOOOOOOOOOO+#',
    '#OOOO# OOOOOOOOOOOOOOO OOOOOOOOOOOOOO##',
    '#OOOO# OOOOOOOOOOOOOOO OOOOOOOOOOOOOO+#',
    '                                       ',
    '+OOOO# OOOOOOOOOOOOOO O OOOOOOOOOOOO+#+',
    '#OOOO# OOOOOOOOOOOOOO O OOOOOOOOOOOO###',
  ];

  var crj700 = [
    '# OOOOOOOOOOO OOOOO###',
    '# OOOOOOOOOOO OOOOO#+#',
    '                      ',
    '# OOOOOOOOOOO OOOOOOOO',
    '# OOOOOOOOOOO OOOOOOOO',
  ];

  var seven3seven = [
    '#OO# OOOOOOOOOOO O OOOOOOOOOOOOOO###',
    '#OO# OOOOOOOOOOO O OOOOOOOOOOOOOO###',
    '#OO# OOOOOOOOOOO O OOOOOOOOOOOOOO+#+',
    '                                    ',
    '+OO# OOOOOOOOOOO O OOOOOOOOOOOOOO+#+',
    '#OO# OOOOOOOOOOO O OOOOOOOOOOOOOO###',
    '#OO# OOOOOOOOOOO O OOOOOOOOOOOOOO###'
  ];
  this.player = this.initPlayer();
  this.world = new World(seven6seven, TOTAL_TRAVELERS, this.player);
  if (window.AudioContext) {
    this.audio = this.initAudio();
  }
  this.controls = this.initControls(this.player);
  this.gameStats = new GameStats();
  this.initObstacles();
};

