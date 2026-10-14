function Game() {
    var _this = this;
    this.doc = document;
    this.canvasContainer = this.doc.getElementById('canvas-container');

    //keyboard initialization
    this.keyboard = new Keyboard();
    this.doc.addEventListener('keydown', this.keyboard.onKeyDown);
    this.doc.addEventListener('keyup', this.keyboard.onKeyUp);

    //touchpad initialization
    this.touchpad = new Touchpad();
    this.canvasContainer.addEventListener("touchstart", this.touchpad.onTouchStart);
    this.canvasContainer.addEventListener("touchend", this.touchpad.onTouchEnd);

    //utils
    this.utils = new Utils();

    //gui
    this.gui = new GUI();

    //time parameters
    this.dt = 0;
    this.timeNow = 0;
    this.timeLast = GetTimeStamp();
    this.timeElapsed = 0;
    this.timeDeath = -1;
    this.timeImmortality = -1;

    this.timePowerupImmortality = GetTimeStamp();
    this.timePowerupBlow = GetTimeStamp();

    //physics parameters
    this.g = 9.8;

    //scaling
    var newWidth = window.innerWidth;
    var newHeight = window.innerHeight;

    this.scaleFactor = newWidth / newHeight;

    this.height = 300;
    this.width = Math.round(this.height * this.scaleFactor - 1);

    var scaleX = this.width / window.innerWidth;
    var scaleY = this.height / window.innerHeight;
    var scaleToFit = Math.min(scaleX, scaleY);


    this.playerWidth = 10;
    this.playerHeight = 10;

    this.wallWidth = 20;
    this.wallHeight = Math.round(_this.height / 3);

    this.laserbeamWidth = 7;
    this.laserbeamHeight = 2;

    this.powerupsWidth = 10;
    this.powerupsHeight = 10;

    this.powerupsSpawnRate = 100;

    //game arrays
    //effects
    this.starsLength = 100;


    //objects
    this.laserbeamsLength = this.gui.ammo;
    this.powerupsLength = 4;
    //to cover all width of widescreen
    this.wallsLength = Math.round(this.width / this.wallWidth) * 2 + 4;
    this.asteroidsLength = Math.round((70 / 22) * this.wallsLength);

    //+1 explosion for player
    this.explosionsLength = this.asteroidsLength + 1;

    this.levelMinimumAsteroidsLength = 10;
    this.levelAsteroidsLength = Math.min(this.levelMinimumAsteroidsLength * this.gui.level, this.asteroidsLength);

    this.player = {};

    this.stars = new Array(this.starsLength);
    this.explosions = new Array(this.explosionsLength);

    this.asteroids = new Array(this.asteroidsLength);
    this.laserbeams = new Array(this.laserbeamsLength);
    this.powerups = new Array(this.powerupsLength);
    this.walls = new Array(this.wallsLength);

    this.lastTopWallindex = 0;
    this.lastBottomWallindex = 0;

    //canvases and contexts
    this.cbg = this.doc.getElementById("cbg");
    this.cfg = this.doc.getElementById("cfg");
    this.cgui = this.doc.getElementById("cgui");

    this.cbg.width = this.width;
    this.cbg.height = this.height;
    this.cbg.style.width = newWidth + 'px';
    this.cbg.style.height = newHeight + 'px';

    this.cfg.width = this.width;
    this.cfg.height = this.height;
    this.cfg.style.width = newWidth + 'px';
    this.cfg.style.height = newHeight + 'px';

    this.cgui.width = this.width;
    this.cgui.height = this.height;
    this.cgui.style.width = newWidth + 'px';
    this.cgui.style.height = newHeight + 'px';

    this.ctxbg = this.cbg.getContext("2d");
    this.ctxfg = this.cfg.getContext("2d");
    this.ctxgui = this.cgui.getContext("2d");

    //pre-rendering
    this.cPreStar = this.doc.createElement('canvas');
    this.cPreStar.width = 2;
    this.cPreStar.height = 2;
    this.ctxPreStar = this.cPreStar.getContext('2d');

    this.preExplosionsLength = 11;
    this.cPreExplosions = new Array(this.preExplosionsLength);
    this.ctxPreExplosions = new Array(this.preExplosionsLength);

    this.cPreWall = this.doc.createElement('canvas');
    //to cover bounds of walls
    this.cPreWall.width = this.wallWidth + 1;
    this.cPreWall.height = this.wallHeight;
    this.ctxPreWall = this.cPreWall.getContext('2d');

    this.cPreLaserBeam = this.doc.createElement('canvas');
    this.cPreLaserBeam.width = this.laserbeamWidth;
    this.cPreLaserBeam.height = this.laserbeamHeight;
    this.ctxPreLaserBeam = this.cPreLaserBeam.getContext('2d');

    this.preAsteroidsLength = 11;
    this.cPreAsteroids = new Array(this.preAsteroidsLength);
    this.ctxPreAsteroids = new Array(this.preAsteroidsLength);

    this.cPrePowerups = new Array(this.powerupsLength);
    this.ctxPrePowerups = new Array(this.powerupsLength);

    this.cPrePlayer = this.doc.createElement('canvas');
    this.cPrePlayer.width = this.playerWidth;
    this.cPrePlayer.height = this.playerHeight;
    this.ctxPrePlayer = this.cPrePlayer.getContext('2d');

    this.cPreImmortalPlayer = this.doc.createElement('canvas');
    this.cPreImmortalPlayer.width = this.playerWidth;
    this.cPreImmortalPlayer.height = this.playerHeight;
    this.ctxPreImmortalPlayer = this.cPreImmortalPlayer.getContext('2d');


    //Frame
    function Frame() {
        _this.timeNow = GetTimeStamp();

        _this.dt = (_this.timeNow - _this.timeLast) / 1000;
        _this.timeElapsed += _this.dt;

        Update();
        Render();

        _this.timeLast = _this.timeNow;

        requestAnimationFrame(Frame);
    }

    function GetTimeStamp() {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    }

    function Update() {
        //gui updating
        if (_this.player.isActive) {
            _this.gui.update();
        }

        //effects updating
        for (var i = 0; i < _this.starsLength; i++) {
            if (_this.stars[i].isActive) {
                _this.stars[i].update();
            } else {
                _this.stars[i].refresh();
            }
        }
        for (var i = 0; i < _this.explosionsLength; i++) {
            if (_this.explosions[i].isActive) {
                _this.explosions[i].update();
            }
        }

        //objects updating
        for (var i = 0; i < _this.wallsLength; i++) {
            if (_this.walls[i].isActive) {
                _this.walls[i].update();
            }
        }
        //for (var i = 0; i < _this.asteroidsLength; i++) {
        for (var i = 0; i < _this.levelAsteroidsLength; i++) {
            if (_this.asteroids[i].isActive) {
                _this.asteroids[i].update();
            } else {
                _this.asteroids[i].refresh();
            }
        }
        for (var i = 0; i < _this.laserbeamsLength; i++) {
            if (_this.laserbeams[i].isActive) {
                _this.laserbeams[i].update();
            }
        }
        for (var i = 0; i < _this.powerupsLength; i++) {
            if (_this.powerups[i].isActive) {
                _this.powerups[i].update();
            }
        }

        if (_this.player.isActive) {
            _this.player.update();
        }
    }
    function Render() {
        _this.ctxfg.save();
        _this.ctxgui.save();

        _this.ctxfg.clearRect(0, 0, _this.width, _this.height);
        _this.ctxgui.clearRect(0, 0, _this.width, _this.height);

        _this.gui.render();

        for (var i = 0; i < _this.starsLength; i++) {
            if (_this.stars[i].isRendered) {
                _this.stars[i].render();
            }
        }
        for (var i = 0; i < _this.wallsLength; i++) {
            if (_this.walls[i].isRendered) {
                _this.walls[i].render();
            }
        };
        //for (var i = 0; i < _this.asteroidsLength; i++) {
        for (var i = 0; i < _this.levelAsteroidsLength; i++) {
            if (_this.asteroids[i].isRendered) {
                _this.asteroids[i].render();
            }
        };
        for (var i = 0; i < _this.laserbeamsLength; i++) {
            if (_this.laserbeams[i].isRendered) {
                _this.laserbeams[i].render();
            }
        };
        for (var i = 0; i < _this.powerupsLength; i++) {
            if (_this.powerups[i].isRendered) {
                _this.powerups[i].render();
            }
        };
        if (_this.player.isRendered) {
            _this.player.render();
        }
        for (var i = 0; i < _this.explosionsLength; i++) {
            if (_this.explosions[i].isRendered) {
                _this.explosions[i].render();
            }
        }

        _this.ctxfg.restore();
        _this.ctxgui.restore();
    }

    //initial creating of objects
    function Initialization() {
        //effects
        //stars
        for (var i = 0; i < _this.starsLength; i++) {
            _this.stars[i] = new Star({
                index: i,
                x: _this.width + _this.utils.Random(0, Math.round(_this.width / 10)),
                y: _this.height / 2 + _this.utils.Random(-Math.round(_this.height / 3), Math.round(_this.height / 3)),
                vx: _this.utils.Random(-200, -70),
                vy: _this.utils.Random(-10, 10),
                timeMax: 4
            });
        }
        //explosions
        for (var i = 0; i < _this.explosionsLength; i++) {
            _this.explosions[i] = new Explosion({
                index: i,
                x: 0,
                y: 0,
                vx: 0,
                vy: 0,
                timeMax: 0.5
            });
        }

        //objects
        //walls
        //top walls
        var k = 0;
        for (var i = 0; i < _this.wallsLength / 2; i++, k++) {
            _this.walls[i] = new Wall({
                index: i,
                x: _this.width + k * (_this.wallWidth) + 1,
                y: Math.round(_this.utils.Random(-(_this.wallHeight - 10), 0)),
                wallType: 'top',
                width: _this.wallWidth,
                height: _this.wallHeight,
                vx: -90,
                vy: 0
            });
        }
        _this.lastTopWallindex = k - 1;
        _this.walls[k - 1].isLastTop = true;

        //bottom walls
        k = 0;
        for (var i = _this.wallsLength / 2; i < _this.wallsLength; i++, k++) {
            _this.walls[i] = new Wall({
                index: i,
                x: _this.width + k * (_this.wallWidth) + 1,
                y: Math.round(_this.utils.Random(_this.height - _this.wallHeight, _this.height - 10)),
                wallType: 'bottom',
                width: _this.wallWidth,
                height: _this.wallHeight,
                vx: -90,
                vy: 0
            });
        }
        _this.lastBottomWallindex = (_this.wallsLength / 2) + k - 1;
        _this.walls[(_this.wallsLength / 2) + k - 1].isLastBottom = true;

        //asteroids
        for (var i = 0; i < _this.asteroidsLength; i++) {
            var randomRadius = _this.utils.Random(1, 10);
            _this.asteroids[i] = new Asteroid({
                index: i,
                x: _this.width + i * 10,
                y: Math.round(_this.utils.Random(0, _this.height)),
                radius: randomRadius,
                m: Math.round(10 / randomRadius) * 2,
                vx: -90,
                vy: 0
            });
        }

        //laserbeams
        for (var i = 0; i < _this.laserbeamsLength; i++) {
            _this.laserbeams[i] = new LaserBeam({
                index: i,
                x: 0,
                y: 0,
                vx: 70,
                vy: 0,
                width: _this.laserbeamWidth,
                height: _this.laserbeamHeight
            });
        }
        //powerups
        for (var i = 0; i < _this.powerupsLength; i++) {
            _this.powerups[i] = new PowerUp({
                index: i,
                x: 0,
                y: 0,
                vx: -200,
                vy: 0,
                width: _this.powerupsWidth,
                height: _this.powerupsHeight
            });
        }

        //player
        _this.player = new Player({
            index: _this.explosionsLength - 1,
            x: 0 + 50,
            y: _this.height / 2,
            vx: 0,
            vy: 0,
            width: _this.playerWidth,
            height: _this.playerHeight,
            m: 20
        });
    }

    //initial prerendering of objects
    function Prerendering() {
        //canvases & contexts
        _this.ctxbg.fillStyle = 'black';
        _this.ctxbg.fillRect(0, 0, _this.cbg.width, _this.cbg.height);

        _this.ctxfg.fillStyle = "rgba(0, 0, 0, 0.1)";
        _this.ctxfg.fillRect(0, 0, _this.cfg.width, _this.cfg.height);

        _this.ctxbg.save();
        _this.ctxfg.save();
        _this.ctxgui.save();

        //star
        _this.ctxPreStar.beginPath();
        _this.ctxPreStar.fillStyle = 'yellow';
        _this.ctxPreStar.fillRect(0, 0, _this.cPreStar.width, _this.cPreStar.height);


        //explosions
        for (var i = 0; i < _this.preExplosionsLength; i++) {
            _this.cPreExplosions[i] = _this.doc.createElement('canvas');
            _this.cPreExplosions[i].width = i * 2 + 2;
            _this.cPreExplosions[i].height = i * 2 + 2;
            _this.ctxPreExplosions[i] = _this.cPreExplosions[i].getContext('2d');

            _this.ctxPreExplosions[i].beginPath();
            _this.ctxPreExplosions[i].arc(i + 1, i + 1, i, 0, 2 * Math.PI, false);
            _this.ctxPreExplosions[i].strokeStyle = 'red';
            _this.ctxPreExplosions[i].lineWidth = 1;
            _this.ctxPreExplosions[i].stroke();
        }

        //asteroids
        for (var i = 1; i < _this.preAsteroidsLength; i++) {
            _this.cPreAsteroids[i] = _this.doc.createElement('canvas');
            _this.cPreAsteroids[i].width = i * 2 + 2;
            _this.cPreAsteroids[i].height = i * 2 + 2;
            _this.ctxPreAsteroids[i] = _this.cPreAsteroids[i].getContext('2d');

            _this.ctxPreAsteroids[i].beginPath();
            _this.ctxPreAsteroids[i].arc(i + 1, i + 1, i, 0, 2 * Math.PI, false);
            _this.ctxPreAsteroids[i].fillStyle = 'grey';
            _this.ctxPreAsteroids[i].fill();
            _this.ctxPreAsteroids[i].strokeStyle = 'white';
            _this.ctxPreAsteroids[i].stroke();
        }

        //wall
        _this.ctxPreWall.beginPath();
        _this.ctxPreWall.fillStyle = 'silver';
        _this.ctxPreWall.fillRect(0, 0, _this.cPreWall.width, _this.cPreWall.height);

        //laserbeam
        _this.ctxPreLaserBeam.beginPath();
        _this.ctxPreLaserBeam.fillStyle = 'red';
        _this.ctxPreLaserBeam.fillRect(0, 0, _this.cPreLaserBeam.width, _this.cPreLaserBeam.height);

        //player
        _this.ctxPrePlayer.beginPath();
        _this.ctxPrePlayer.fillStyle = 'yellow';
        _this.ctxPrePlayer.fillRect(0, 0, _this.cPrePlayer.width, _this.cPrePlayer.height);

        _this.ctxPreImmortalPlayer.beginPath();
        _this.ctxPreImmortalPlayer.fillStyle = 'red';
        _this.ctxPreImmortalPlayer.fillRect(0, 0, _this.cPreImmortalPlayer.width, _this.cPreImmortalPlayer.height);

        //powerups
        for (var i = 0; i < _this.powerupsLength; i++) {

            _this.cPrePowerups[i] = _this.doc.createElement('canvas');
            _this.cPrePowerups[i].width = 10;
            _this.cPrePowerups[i].height = 10;
            _this.ctxPrePowerups[i] = _this.cPrePowerups[i].getContext('2d');

            _this.ctxPrePowerups[i].beginPath();
            if (i == 0 || i == 1) {
                _this.ctxPrePowerups[i].fillStyle = 'orange';
            }
            if (i == 2) {
                _this.ctxPrePowerups[i].fillStyle = 'red';
            }
            if (i == 3) {
                _this.ctxPrePowerups[i].fillStyle = 'purple';
            }
            _this.ctxPrePowerups[i].fillRect(0, 0, _this.cPrePowerups[i].width, _this.cPrePowerups[i].height);
        }
    }

    this.Start = function () {
        Initialization();
        Prerendering();

        requestAnimationFrame(Frame);
    }
}