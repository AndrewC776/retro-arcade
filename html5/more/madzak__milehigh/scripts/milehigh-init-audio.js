/*globals MileHigh,AudioContext */
/*jshint unused: false */
'use strict';

MileHigh.prototype.initAudio = function () {
  var actx = new AudioContext(),
      osc,
      amp = null;

  function makeCustomSine() {
    var length = 10,
        sine1 = new Float32Array(length),
        sine2 = new Float32Array(length),
        i = null;
    for (i = 0; i < length; i++) {
      sine1[i] = Math.sin(Math.PI * i / length);
    }
    for (i = 0; i < length; i++) {
      sine2[i] = Math.cos(Math.PI * i / length);
    }
    return actx.createWaveTable(sine1, sine2);
  }

  function makeCustomSquare() {
    var length = 10,
        square = new Float32Array(length),
        i = null;
    for (i = 0; i < square.length; i++) {
      square[i] = i % 2;
    }
    return actx.createWaveTable(square, square);
  }
  
  function setOscType(type) {
    if (type === 'CustomSine') {
      osc.setWaveTable(makeCustomSine());
    } else if (type === 'CustomSquare') {
      osc.setWaveTable(makeCustomSquare());
    } else if (type === 'Square') {
      osc.type = 1;
    }
  }

  function setVol(vol) {
    amp.gain.value = vol;
  }

  function setFreq(freq) {
    osc.frequency.value = freq;
  }

  function stopAudio() {
    osc.noteOff(0);
  }

  function startAudio() {
    osc.noteOn(0);
  }

  function makeAudio(type, freq, vol) {
    if (osc) {
      stopAudio();
    }
    osc = actx.createOscillator();
    setOscType(type);
    setFreq(freq);
    amp = actx.createGainNode();
    setVol(vol);
    osc.connect(amp);
    amp.connect(actx.destination);
    startAudio();
  }

  function playAudioSeatBelts() {
    makeAudio('CustomSquare', 293.66, 0.6);
    setTimeout(function() {
      setFreq(246.94);
      setTimeout(stopAudio, 500);
    }, 500);
  }

  function playAudioWhistle() {
    makeAudio('CustomSine', 400, 0.6);
    setTimeout(function() {
      setFreq(600);
      setTimeout(function() {
        stopAudio();
        setTimeout(function() {
          makeAudio('CustomSine', 400, 0.6);
          setTimeout(function() {
            setFreq(500);
            setTimeout(function() {
              setFreq(400);
              setTimeout(function() {
                stopAudio();
              }, 150);
            }, 50);
          }, 50);
        }, 50);
      }, 50);
    }, 150);
  }

  function playAudioPlayerMove() {
      makeAudio('Square', 98, 0.4);
      setTimeout(stopAudio, 30);
  }

  function playAudioScore() {
    makeAudio('CustomSine', 587.33, 0.6);
    setTimeout(function() {
      setFreq(783.99);
      setTimeout(stopAudio, 100);
    }, 100);
  }

  function playAudio(e) {
    if (e.detail === 'seatBelts') {
      playAudioSeatBelts();
    }
    if (e.detail === 'whistle') {
      playAudioWhistle();
    }
    if (e.detail === 'playerMove') {
      playAudioPlayerMove();
    }
    if (e.detail === 'playerScore') {
      playAudioScore();
    }
  }

  addEventListener('audio', playAudio, false);
};

