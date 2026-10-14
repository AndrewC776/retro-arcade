# Switchboard Simulator

This is a game made for the Js13kGames competition. The 2018 theme was "Offline", so after some random ideas I thought to myself: "What was the first thing that could go online or offline?" and I remembered the old telephone switchboards.

## Gameplay idea

Gameplay should be the player plugging in cords between the required ports on a telephone switchboard. The number of cords available will be limited and different lengths so the user will have to manage which cords they are using at any one time.

The switchboard is made up of a grid of ports and lights with a special speaker port in the corner and co-ordinate labels along the columns and rows of the ports. At random times, a light next to a port will blink signalling that there is a call coming through. Connecting the speaker port next to the port with the blinking light will pop open a speech bubble. The speech bubble will say what port the call should be connected to.

A time meter will slowly rise throughout play and a satisfaction meter will lower as the user makes mistakes. If the satisfaction meter runs out the game is over and a "You're Fired!" screen is shown signalling the end of the game.

If the time meter fills up, the day is considered over and the next day begins with a reset satisfaction meter. The day acts as a sort of level or score, each day is more challenging than the last. The aim of the game is to last as long as possible before being fired.

## Todo

- [-] Create the basic file structure and app skeleton
  - [x] engine.js (canvas, game loop, input) ~1.5kb
  - [-] utility.js (randomness functions, other repeated functions...) ~0.5kb
  - [ ] graphics.js (detailed draw commands for all game objects) ~2kb
  - [-] physics.js (rope physics, gravity) ~1kb
  - [-] gameplay.js (incoming calls, satisfaction meter, day counter and difficulty) ~3kb
  - [ ] audio.js (audio / music engine, sounds and songs) ~5kb
- [ ] Create a basic gameplay prototype (connect the call to the correct port)
- [ ] Update build process to include a file size budget, minification and final packaging automation
- [ ] Add gameplay (satisfaction meter, day counter, increasing difficulty)
- [ ] Investigate draggables bugging out when dragged beyond chain's limit.
  - Is it caused by the step/draw function being called mid-input function or vica versa?
  - If so, will moving latest mouse event variables into global variables and moving all input interaction/physics logic into the step function fix any strange bugs?
- [ ] Improve graphics
- [ ] Add sounds (port plug and port unplug sounds, incoming call, speech, angry speech, game over tune, gameplay tune.)

## Done

- [x] Plan
- [x] Create a basic build process
- [x] Create a basic engine (game loop, input, drawing)
- [x] Add rope physics to the cords