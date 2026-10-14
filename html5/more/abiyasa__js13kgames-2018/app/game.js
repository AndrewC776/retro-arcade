gamehame = gamehame || {};

gamehame.GAME_STATUS_INIT_MAIN_SCREEN = 'init-main-screen';
gamehame.GAME_STATUS_MAIN_SCREEN = 'main-screen';
gamehame.GAME_STATUS_INIT_LEVEL = 'init-level';
gamehame.GAME_STATUS_START = 'start';
gamehame.GAME_STATUS_YOU_WIN = 'you-win';
gamehame.GAME_STATUS_GAME_OVER = 'you-lost';

gamehame.init = function () {
  kontra.init();

  gamehame.hero = null;
  gamehame.stations = [];
  gamehame.switches = [];
  gamehame.gameStatus = gamehame.GAME_STATUS_INIT_MAIN_SCREEN;
  gamehame.guiSprites = [];

  gamehame.levels = [
    {
      start: { x: 30, y: 250 },
      stations: [
      ],
      switches: [
        { x: 500, y: 250 }
      ]
    },

    {
      start: { x: 30, y: 250 },
      stations: [
        {x: 110, y: 100, radius: 150 },
        {x: 300, y: 200, radius: 90 },
        {x: 400, y: 300, radius: 150 },
      ],
      switches: [
        {x: 500, y: 100 }
      ]
    },

    {
      start: { x: 30, y: 250 },
      stations: [
        { x: 110, y: 100, radius: 150 },
        { x: 300, y: 200, radius: 90 },
        { x: 400, y: 300, radius: 250 },
      ],
      switches: [
        { x: 500, y: 10 }
      ]
    }

  ];
  gamehame.currentLevel = 0;
  // gamehame.currentLevel = 2;
}

gamehame.start = function () {
  kontra.gameLoop({
    update(dt) {
      let { stations, hero, gameStatus, switches } = gamehame;

      stations.forEach(station => station.update(dt));
      gamehame.guiSprites.forEach(s => s.update(dt));
      switches.forEach(s => s.update(dt));

      switch (gameStatus) {
      case gamehame.GAME_STATUS_INIT_MAIN_SCREEN:
        gamehame.guiSprites = [
          new gamehame.GuiText(50, 50, 550, '▷ Stay offline, avoid the green area, pick the red card')
        ];
        gamehame.gameStatus = gamehame.GAME_STATUS_MAIN_SCREEN;
        break;

      case gamehame.GAME_STATUS_MAIN_SCREEN:
        if (kontra.keys.pressed('space')) {
          gamehame.gameStatus = gamehame.GAME_STATUS_INIT_LEVEL;
        }
        break;

      case gamehame.GAME_STATUS_INIT_LEVEL:
        const level = gamehame.levels[gamehame.currentLevel];

        gamehame.hero = new gamehame.Hero(level.start.x, level.start.y);
        gamehame.stations = level.stations.map(st => new gamehame.Station(st.x, st.y, st.radius));
        gamehame.switches = level.switches.map(st => new gamehame.Switch(st.x, st.y));
        gamehame.guiSprites = [];
        gamehame.gameStatus = gamehame.GAME_STATUS_START;
        break;

      case gamehame.GAME_STATUS_START:
        hero && hero.update(dt);

        if (!hero.isDead) {
          // check for coverage with stations
          let isInCoverage = 0;
          stations.forEach(station => {
            if (hero.isInCoverage(station)) {
              isInCoverage++;
            }
          });
          if (isInCoverage > 0) {
            hero.connect();
          } else {
            hero.disconnect();
          }

          // check switch
          switches.forEach(sw => {
            if (hero.collidesWith(sw)) {
              sw.switchOff();
            }
          });
          gamehame.switches = switches.filter(sw => !sw.isSwitchOff());
        }

        if (hero.isDead) {
          gamehame.guiSprites = [
            new gamehame.GuiText(50, 50, 550, 'You are now online ♺ So sad ✖︎')
          ];
          gamehame.gameStatus = gamehame.GAME_STATUS_GAME_OVER;
        } else if (switches.length === 0) {
          gamehame.guiSprites = [
            new gamehame.GuiText(50, 50, 200, 'Good job! ✧✧')
          ];
          gamehame.gameStatus = gamehame.GAME_STATUS_YOU_WIN;
        }
        break;

        case gamehame.GAME_STATUS_YOU_WIN:
          if (kontra.keys.pressed('space')) {
            if (gamehame.currentLevel < (gamehame.levels.length - 1)) {
              gamehame.currentLevel++;
            }
            gamehame.gameStatus = gamehame.GAME_STATUS_INIT_LEVEL;
          }
        break;

        case gamehame.GAME_STATUS_GAME_OVER:
          if (kontra.keys.pressed('space')) {
            gamehame.gameStatus = gamehame.GAME_STATUS_INIT_LEVEL;
          }
        break;
      }
    },

    render() {
      let { stations, hero, guiSprites, switches } = gamehame;

      switches.forEach(s => s.render());
      stations.forEach(st => st.render());
      if (hero) {
        hero.render();
      }
      guiSprites.forEach(sprite => {
        sprite.render();
      });
    }
  }).start();
}
