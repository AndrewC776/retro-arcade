/**
 * Created by ehtd on 9/6/15.
 */

var START = 0;
var GAME = 2;
var DEAD = 3;
var WIN = 4;
var BETWEEN = 5;

var currentState = START;

var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');

var scaledImageReady = false;

var scaledMap;

var xTiles = 13;
var yTiles = 13;

var started = false;

var map = new Image();
map.src = 'mvh.png';
map.onload = function () {
    scaledMap = resize(map, scale);
    scaledImageReady = true;
    init();
    started = true;

    Music.init();
};

var startLayer = [];
var deadLayer = [];
var winLayer = [];
var betweenLevelsLayer = [];

var backgroundLayer = [];
var foregroundLayer = [];
var gameObjects = [];
var walls = [];
var eggs = [];
var doors = [];
var rocks = [];
var chest;
var knights = [];
var swords = [];

var hero;


var init = function () {

    loadStart();
    loadDead();
    loadWin();
    loadBetweenLevels();

    loadLevel();

    var scanLines = new TiledBackground(ctx,scaledMap,11,tileSize);
    foregroundLayer.push(scanLines);
};

var reset = function () {
    backgroundLayer = [];
    foregroundLayer = [];
    gameObjects = [];
    walls = [];
    eggs = [];
    doors = [];
    rocks = [];
    chest = null;
    knights = [];
    swords = [];

    hero = null;
};

var update = function (dt) {

    if (currentState == GAME) {
        updateLevel(dt);
    }

};

var updateLevel = function (dt) {
    if (started == false) return;

    if (hero.dead) {
        currentState = DEAD;
        Music.stop();
        reset();
        loadLevel();
        return;
    } else if (hero.completedLevel) {
        reset();
        currentLevel++;

        if (currentLevel >= levels.length) {
            currentState = WIN;
            return;
        }

        loadLevel();
        currentState = BETWEEN;
        Music.stop();
        return;
    }

    gameObjects.forEach(function(o) {
        o.update(dt);
    });

    knights.forEach(function(o) {
        o.update(dt);
    });

    swords.forEach(function(o) {
        o.update(dt);
    });

    if (eggs.length == 0) {
        chest.openChest();
        knights.forEach(function(k) {
            k.unlock();
        });
    }

    if (chest.hasKey == false) {
        doors.forEach(function(d) {
            d.openDoor();
        });

        knights.forEach(function(k) {
            k.seal();
        });
    }

    var s = [];
    swords.forEach(function(o){
        if (o.alive){
            s.push(o);
        }
    });

    swords = s;
};

var loadStart = function() {
    var background = new TiledBackground(ctx,scaledMap,darkTile,tileSize);
    var hero = new Hero(ctx,scaledMap, tileSize, tileSize, 190, 300);
    startLayer.push(background);
    startLayer.push(hero);
};

var loadDead = function() {
    var background = new TiledBackground(ctx,scaledMap,darkTile,tileSize);
    var hero = new Hero(ctx,scaledMap, tileSize, tileSize, 190, 300);
    deadLayer.push(background);
    deadLayer.push(hero);
};

var loadWin = function() {
    var background = new TiledBackground(ctx,scaledMap,darkTile,tileSize);
    var hero = new Hero(ctx,scaledMap, tileSize, tileSize, 190, 300);
    winLayer.push(background);
    winLayer.push(hero);
};

var loadBetweenLevels = function() {
    var background = new TiledBackground(ctx,scaledMap,darkTile,tileSize);
    var hero = new Hero(ctx,scaledMap, tileSize, tileSize, 190, 300);
    betweenLevelsLayer.push(background);
    betweenLevelsLayer.push(hero);
};

var loadLevel = function() {

    var level = levels[currentLevel];

    var background = new TiledBackground(ctx,scaledMap,ee,tileSize);
    backgroundLayer.push(background);

    hero = new Hero(ctx, scaledMap, tileSize, tileSize, level.x, level.y);
    gameObjects.push(hero);


    for (var j = 0; j < yTiles; j++) {
        for (var i = 0; i < xTiles; i++) {
            var o = level.world[j][i];

            if (o >= 0 && o <= 10) {
                var path = new Sprite(ctx,
                    scaledMap, o, tileSize, tileSize, i*tileSize, j*tileSize);
                backgroundLayer.push(path);
            }
            else if (o >= 12 && o <= 20) {
                var wall = new Wall(ctx,
                    scaledMap, o, tileSize, tileSize, i*tileSize, j*tileSize);
                walls.push(wall);
            }
            else if (o == DD) {
                var door = new Door(ctx, scaledMap, o, tileSize, tileSize, i*tileSize, j*tileSize);
                doors.push(door);
            }
            else if (o == o_) {
                var egg = new Egg(ctx, scaledMap, o, tileSize, tileSize, i*tileSize, j*tileSize);
                eggs.push(egg);
            }
            else if (o == r_) {
                var rock = new Rock(i*tileSize, j*tileSize);
                rocks.push(rock);
            }
            else if (o == c_) {
                chest = new Chest(ctx, scaledMap, o, tileSize, tileSize, i*tileSize, j*tileSize);
            }
            else if (o == ku || o == kd) {
                var k = new Knight(i*tileSize, j*tileSize, o);
                knights.push(k);
            }
        }
    }

    rocks.forEach(function(r) {
        r.eggCollisionGroup = eggs;
        r.addGroupToCollisionGroup(walls);
        r.addGroupToCollisionGroup(doors);
        r.addItemToCollisionGroup(chest);
        r.addRocksToCollisionGroup(rocks);
        r.addGroupToCollisionGroup(knights);
    });

    hero.addRocksCollisionGroup(rocks);
    hero.eggCollisionGroup = eggs;
    hero.doorCollisionGroup = doors;
    hero.addChest(chest);
    hero.addCollisionGroup(walls);
    hero.knightCollisionGroup = knights;
};

//---------------------------------
//  RENDER
//---------------------------------
var render = function () {
    ctx.clearRect(0,0,canvas.width, canvas.height);

    if (!scaledImageReady) return;

    if (currentState == GAME) {
        renderLevel();
    }
    else if (currentState == START) {
        renderStart();

    }
    else if (currentState == DEAD) {
        renderDead();
    }
    else if (currentState == WIN) {
        renderWin();
    }
    else if (currentState == BETWEEN) {
        renderBetween();
    }
};

var renderLevel = function() {
    backgroundLayer.forEach(function(o) {
        o.render();
    });

    walls.forEach(function(o) {
        o.render();
    });

    eggs.forEach(function(o) {
        o.render();
    });

    doors.forEach(function(o) {
        o.render();
    });

    chest.render(function(o) {
        o.render();
    });

    rocks.forEach(function(o) {
        o.render();
    });

    knights.forEach(function(o) {
        o.render();
    });

    swords.forEach(function(o) {
        o.render();
    });

    gameObjects.forEach(function(o) {
        o.render();
    });

    // TODO: draw order according to y distance
    draw('r to restart level', 2, 140, 396);
};

var renderStart = function() {
    startLayer.forEach(function(o){
        o.render();
    });

    draw('Fantastic', 5, 120, 150);
    draw('monster', 5, 130, 190);
    draw('chronicles', 5, 110, 230);
    draw('ehtd presents', 2, 160, 100);
    draw('Z to start', 2, 170, 350);
};

var renderDead = function () {
    deadLayer.forEach(function(o){
        o.render();
    });

    draw('not today', 5, 120, 150);
    draw('What do we say to the god of death?', 2, 70, 100);
    draw('Z to revive', 2, 160, 350);
};

var renderWin = function () {
    winLayer.forEach(function(o){
        o.render();
    });

    draw('fantastic', 5, 120, 150);
    draw('Game completed ', 2, 150, 100);
    draw('You are ', 2, 180, 120);
};

var renderBetween = function () {
    betweenLevelsLayer.forEach(function(o){
        o.render();
    });

    var level = levels[currentLevel];
    draw(level.p1, 5, 120, 150);
    draw(level.p2, 2, 50, 230);
    draw(level.p3, 2, 50, 250);
    draw(level.p4, 2, 50, 270);
    //draw('You are ', 2, 180, 120);
    draw('X to start chapter', 2, 140, 350);
};

//---------------------------------
//  GAME LOOP
//---------------------------------
var timestamp = function () {
    if (window.performance && window.performance.now)
        return window.performance.now();
    else
        return new Date().getTime();
};

var fps  = 60,
    step = 1/fps,
    dt   = 0,
    now, last = timestamp();

var loop = function () {
    now = timestamp();
    dt = dt + Math.min(1, (now - last) / 1000);
    while(dt > step) {
        dt = dt - step;
        update(step);
    }
    render(ctx, dt);
    last = now;
    requestAnimationFrame(loop);
};

//---------------------------------
//  INPUT
//---------------------------------
document.addEventListener('keydown', function(ev) { return onkey(ev, ev.keyCode, true);  }, false);
document.addEventListener('keyup',   function(ev) { return onkey(ev, ev.keyCode, false); }, false);

var KEY = { SPACE: 32, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40, Z:90, R:82, X:88};
var onkey = function (ev, key, down) {
    switch(key) {
        case KEY.LEFT:  hero.left  = down; return false;
        case KEY.RIGHT: hero.right = down; return false;
        case KEY.UP: hero.up  = down; return false;
        case KEY.DOWN: hero.down  = down; return false;
        case KEY.Z:
            changeState();
            return false;
        case KEY.R:
            restartLevel();
            return false;
        case KEY.X:
            beginLevel();
            return false;
    }
};

window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

var restartLevel = function () {
    if (currentState == GAME) {
        reset();
        loadLevel();
    }
};

var changeState = function() {
    if (currentState == START) {
        currentState = BETWEEN;
    } else if (currentState == DEAD) {
        currentState = GAME;
        Music.play();
    }
};

var beginLevel = function() {
    if (currentState == BETWEEN) {
        currentState = GAME;
        Music.play();
    }
};

//---------------------------------
//  UTILITIES
//---------------------------------
// http://phoboslab.org/log/2012/09/drawing-pixels-is-hard
var resize = function( img, scale ) {
    // Takes an image and a scaling factor and returns the scaled image

    // The original image is drawn into an offscreen canvas of the same size
    // and copied, pixel by pixel into another offscreen canvas with the
    // new size.

    var widthScaled = img.width * scale;
    var heightScaled = img.height * scale;

    var orig = document.createElement('canvas');
    orig.width = img.width;
    orig.height = img.height;
    var origCtx = orig.getContext('2d');
    origCtx.drawImage(img, 0, 0);
    var origPixels = origCtx.getImageData(0, 0, img.width, img.height);

    var scaled = document.createElement('canvas');
    scaled.width = widthScaled;
    scaled.height = heightScaled;
    var scaledCtx = scaled.getContext('2d');
    var scaledPixels = scaledCtx.getImageData( 0, 0, widthScaled, heightScaled );

    for( var y = 0; y < heightScaled; y++ ) {
        for( var x = 0; x < widthScaled; x++ ) {
            var index = (Math.floor(y / scale) * img.width + Math.floor(x / scale)) * 4;
            var indexScaled = (y * widthScaled + x) * 4;
            scaledPixels.data[ indexScaled ] = origPixels.data[ index ];
            scaledPixels.data[ indexScaled+1 ] = origPixels.data[ index+1 ];
            scaledPixels.data[ indexScaled+2 ] = origPixels.data[ index+2 ];
            scaledPixels.data[ indexScaled+3 ] = origPixels.data[ index+3 ];
        }
    }
    scaledCtx.putImageData( scaledPixels, 0, 0 );
    return scaled;
};

//---------------------------------
//  RUN
//---------------------------------
var w = window;
//requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;
if (!window.requestAnimationFrame) { // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
    window.requestAnimationFrame = window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback, element) {
            window.setTimeout(callback, 1000 / 60);
        }
}

reset();
loop();