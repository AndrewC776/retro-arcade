(function( global ) {

  /*
   * Private stuffz
   */

  var enharmonics = 'B#-C|C#-Db|D|D#-Eb|E-Fb|E#-F|F#-Gb|G|G#-Ab|A|A#-Bb|B-Cb',
    middleC = 440 * Math.pow( Math.pow( 2, 1 / 12 ), -9 ),
    numeric = /^[0-9.]+$/,
    octaveOffset = 4,
    space = /\s+/,
    num = /(\d+)/,
    offsets = {};

  // populate the offset lookup (note distance from C, in semitones)
  enharmonics.split('|').forEach(function( val, i ) {
    val.split('-').forEach(function( note ) {
      offsets[ note ] = i;
    });
  });

  /*
   * Note class
   *
   * new Note ('A4 q') === 440Hz, quarter note
   * new Note ('- e') === 0Hz (basically a rest), eigth note
   * new Note ('A4 es') === 440Hz, dotted eighth note (eighth + sixteenth)
   * new Note ('A4 0.0125') === 440Hz, 32nd note (or any arbitrary
   * divisor/multiple of 1 beat)
   *
   */

  // create a new Note instance from a string
  function Note( str ) {
    var couple = str.split( space );
    // frequency, in Hz
    this.frequency = Note.getFrequency( couple[ 0 ] ) || 0;
    // duration, as a ratio of 1 beat (quarter note = 1, half note = 0.5, etc.)
    this.duration = Note.getDuration( couple[ 1 ] ) || 0;
  }

  // convert a note name (e.g. 'A4') to a frequency (e.g. 440.00)
  Note.getFrequency = function( name ) {
    var couple = name.split( num ),
      distance = offsets[ couple[ 0 ] ],
      octaveDiff = ( couple[ 1 ] || octaveOffset ) - octaveOffset,
      freq = middleC * Math.pow( Math.pow( 2, 1 / 12 ), distance );
    return freq * Math.pow( 2, octaveDiff );
  };

  // convert a duration string (e.g. 'q') to a number (e.g. 1)
  // also accepts numeric strings (e.g '0.125')
  // and compund durations (e.g. 'es' for dotted-eight or eighth plus sixteenth)
  Note.getDuration = function( symbol ) {
    return numeric.test( symbol ) ? parseFloat( symbol ) :
      symbol.toLowerCase().split('').reduce(function( prev, curr ) {
        return prev + ( curr === 'w' ? 4 : curr === 'h' ? 2 :
          curr === 'q' ? 1 : curr === 'e' ? 0.5 :
          curr === 's' ? 0.25 : 0 );
      }, 0 );
  };

  typeof module !== 'undefined' && ( module.exports = Note );

  /*
   * Sequence class
   */

  // create a new Sequence
  function Sequence( ac, tempo, arr ) {
    if ( ac ) {
      this.ac = ac;
      this.createFxNodes();
      this.tempo = tempo || 120;
      this.loop = true;
      this.smoothing = 0;
      this.staccato = 0;
      this.notes = [];
      this.push.apply( this, arr || [] );
    }
  }

  // create gain and EQ nodes, then connect 'em
  Sequence.prototype.createFxNodes = function() {
    var eq = [ [ 'bass', 100 ], [ 'mid', 1000 ], [ 'treble', 2500 ] ],
      prev = this.gain = this.ac.createGain();
    this.wet = this.ac.createGain();
    this.dry = this.ac.createGain();
    eq.forEach(function( config, filter ) {
      filter = this[ config[ 0 ] ] = this.ac.createBiquadFilter();
      filter.type = 'peaking';
      filter.frequency.value = config[ 1 ];
      prev.connect( prev = filter );
    }.bind( this ));
    prev.connect( this.wet );
    prev.connect( this.dry );
    return this;
  };

  // accepts Note instances or strings (e.g. 'A4 e')
  Sequence.prototype.push = function() {
    Array.prototype.forEach.call( arguments, function( note ) {
      this.notes.push( note instanceof Note ? note : new Note( note ) );
    }.bind( this ));
    return this;
  };

  // recreate the oscillator node (happens on every play)
  Sequence.prototype.createOscillator = function() {
    this.stop();
    this.osc = this.ac.createOscillator();
    this.osc.type = this.waveType || 'square';
    this.osc.connect( this.gain );
    return this;
  };

  // schedules this.notes[ index ] to play at the given time
  // returns an AudioContext timestamp of when the note will *end*
  Sequence.prototype.scheduleNote = function( index, when ) {
    var duration = 60 / this.tempo * this.notes[ index ].duration,
      cutoff = duration * ( 1 - ( this.staccato || 0.00000000001 ) );

    this.setFrequency( this.notes[ index ].frequency, when );

    if ( this.smoothing && this.notes[ index ].frequency ) {
      this.slide( index, when, cutoff );
    }

    this.setFrequency( 0, when + cutoff );
    return when + duration;
  };

  // get the next note
  Sequence.prototype.getNextNote = function( index ) {
    return this.notes[ index < this.notes.length - 1 ? index + 1 : 0 ];
  };

  // how long do we wait before beginning the slide? (in seconds)
  Sequence.prototype.getSlideStartDelay = function( duration ) {
    return duration - Math.min( duration, 60 / this.tempo * this.smoothing );
  };

  // slide the note at <index> into the next note at the given time,
  // and apply staccato effect if needed
  Sequence.prototype.slide = function( index, when, cutoff ) {
    var next = this.getNextNote( index ),
      start = this.getSlideStartDelay( cutoff );
    this.setFrequency( this.notes[ index ].frequency, when + start );
    this.rampFrequency( next.frequency, when + cutoff );
    return this;
  };

  // set frequency at time
  Sequence.prototype.setFrequency = function( freq, when ) {
    this.osc.frequency.setValueAtTime( freq, when );
    return this;
  };

  // ramp to frequency at time
  Sequence.prototype.rampFrequency = function( freq, when ) {
    this.osc.frequency.linearRampToValueAtTime( freq, when );
    return this;
  };

  // run through all notes in the sequence and schedule them
  Sequence.prototype.play = function( when ) {
    when = typeof when === 'number' ? when : this.ac.currentTime;

    this.createOscillator();
    this.osc.start( when );

    this.notes.forEach(function( note, i ) {
      when = this.scheduleNote( i, when );
    }.bind( this ));

    this.osc.stop( when );
    this.osc.onended = this.loop ? this.play.bind( this, when ) : null;

    return this;
  };

  // stop playback, null out the oscillator, cancel parameter automation
  Sequence.prototype.stop = function() {
    if ( this.osc ) {
      this.osc.onended = null;
      this.osc.stop( 0 );
      this.osc.frequency.cancelScheduledValues( 0 );
      this.osc = null;
    }
    return this;
  };

  typeof module !== 'undefined' && ( module.exports = Sequence );

  global.Note = Note;
  global.Sequence = Sequence;

}( typeof window !== 'undefined' ? window : this ) );


// audiocontext, beats per minute, overall game volume
var ac, tempo = 80, volume = 0.2;

if ( window.AudioContext || window.webkitAudioContext ) {
 ac = new ( window.AudioContext || window.webkitAudioContext )();
}

var Music = {

  init: function() {
    if ( ac ) {
      this.ac = ac;
      this.osc = this.ac.createOscillator();
      this.compressor = this.ac.createDynamicsCompressor();
      this.output = this.ac.createGain();
      this.output.connect( this.ac.destination );
      this.output.gain.value = volume;

      this.reverb = this.ac.createConvolver();
      this.reverb.buffer = this.createReverb( 2 );
      this.reverb.connect( this.compressor );

      this.collision1.dry.connect( this.output );
      this.collision1.gain.gain.value = 0.4;
      this.collision1.loop = false;

      this.collision2.dry.connect( this.output );
      this.collision2.gain.gain.value = 0.4;
      this.collision2.loop = false;

      this.osc.frequency.value = 0;
      this.osc.connect( this.compressor );
      this.osc.start();

      this.bass.wet.connect( this.reverb );
      this.lead.wet.connect( this.reverb );

      this.bass.dry.connect( this.compressor );
      this.lead.dry.connect( this.compressor );

      this.compressor.ratio.value = 4;
      this.compressor.threshold.value = -12;
      this.compressor.connect( this.output );

      this.bass.staccato = 0.25;
      this.bass.waveType = 'sawtooth';
      this.bass.treble.type = 'lowpass';
      this.bass.treble.frequency.value = 1000;
      this.bass.mid.gain.value = -5;

      this.lead.smoothing = 0.00;
      this.lead.gain.gain.value = 0.35;
      this.lead.wet.gain.value = 1.5;

    }
  },

  play: function() {
    var now, delay;
    if ( this.ac ) {
      now = this.ac.currentTime;
      delay = now + ( 60 / tempo * 16 );
      this.lead.play( now );
      this.bass.play( now );
    }
  },

  stop: function() {
    if ( this.ac ) {
      this.lead.stop();
      this.bass.stop();
    }
  },

  createReverb: function( duration, decay ) {
    var sr = ac.sampleRate,
      len = sr * duration,
      impulse = this.ac.createBuffer( 2, len, sr ),
      impulseL = impulse.getChannelData( 0 ),
      impulseR = impulse.getChannelData( 1 ),
      i = 0;

    if ( !decay ) {
      decay = 2.0;
    }
    for ( ; i < len; ++i ) {
      impulseL[ i ] = ( Math.random() * 2 - 1 ) * Math.pow( 1 - i / len, decay );
      impulseR[ i ] = ( Math.random() * 2 - 1 ) * Math.pow( 1 - i / len, decay );
    }
    return impulse;
  },

  bass: new Sequence( ac, tempo, [
    'C2  h',
    'C2  h',
    'G2  h',
    'G2  h',
    'E2  h',
    'E2  h',
    'D2  h',
    'D2  h'
  ]),

  lead: new Sequence( ac, tempo, [
    'B3 q','D3 q','G3 q','A4 q',
      //
    'B3 q','D3 q','G3 q','A4 q',
      //
    'B3 q','D4 q', 'C4 q', 'b3 q',
      //
    'A4 q', 'G3 q','A4 q','B3 q',
      //
    'C4 q', 'G3 q','A4 q','B3 q',
      //
    'D4 e','D4 e','D4 e',
    //
    'B4 e', 'A4 s','B4 s','G3 e',
    //
    'A4 e', 'D4 e', 'C4 e',
    //
    'B4 h', 'A4 e',
    //
    'E3 e','G3 q','B4 e','D4 q', 'G3 e',
    //
    'C4 e','E4 e','F4 e','E4 e', 'C4 q', 'B4 e',
    //
    'C4 e','A4 e','D3 e','C4 e',
    //
    'B4 e','G3 e','D3 e','B4 e',
    //
    'F3 q','E3 q','D3 q','- e',
    //
    //
    'D3 e','C4 q','B4 e','A4 q', 'D3 q',
    'C4 e','B4 e','A4 e', 'G3 e', 'A4 q',
    //
    'E3 e','G3 q','B4 e','D4 q', 'G3 e',
    //
    'C4 e','E4 e','F4 e','E4 e', 'C4 q', 'B4 e',
    //
    'C4 e','A4 e','D3 e','C4 e',
    //
    'B4 e','G3 e','D3 e','B4 e',
    //
    'F3 q','F3 q','G3 q','- e'
    //

  ])
    ,

  collision1: new Sequence( ac, 220, [
    'G3 s',
    'D4 s',
    'G4 s'
  ]),

  collision2: new Sequence( ac, 220, [
    'G4 s',
    'D4 s',
    'G3 s'
  ])

};


