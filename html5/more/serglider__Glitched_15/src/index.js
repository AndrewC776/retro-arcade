(function() {
    'use strict';

    CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
        if (w < 2 * r) {
            r = w / 2;
        }
        if (h < 2 * r) {
            r = h / 2;
        }
        this.beginPath();
        this.moveTo(x + r, y);
        this.arcTo(x + w, y, x + w, y + h, r);
        this.arcTo(x + w, y + h, x, y + h, r);
        this.arcTo(x, y + h, x, y, r);
        this.arcTo(x, y, x + w, y, r);
        this.closePath();
        return this;
    };

    var canvas = document.querySelector('canvas');
    var help = document.querySelector('.help-outer');
    help.style.display = 'none';
    var ctx = canvas.getContext('2d');
    var p = new Props();
    var game = new Game();
    var timer = new Timer(ctx, p);
    var glitch = new Glitch(ctx, p);
    var tiles;

    canvas.width = canvas.height = p.size;
    canvas.style.marginLeft = p.marginLeft + 'px';
    canvas.style.marginTop = p.marginTop + 'px';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    window.addEventListener('keyup', onSpecKeyUp, false);
    window.addEventListener('resize', onResize, false);
    initGame();

    function createTiles(nums, p) {
        var arr = [],
            i = 0,
            x, y;

        nums.forEach(function(n, i) {
            if (n) {
                x = p.gap + (i % 4) * (p.tile + p.gap);
                y = p.gap + (Math.floor(i / 4)) * (p.tile + p.gap);
                arr[i] = new Tile(ctx, n.toString(), x, y, p.tile, p.gap);
            }
        });
        return arr;
    }

    function drawStage() {
        ctx.clearRect(0, 0, p.size, p.size);
        tiles.forEach(function(tile) {
            tile.draw();
        });
        if (timer.stopped) {
            timer.draw();
        }
    }

    function setEventListeners() {
        canvas.addEventListener('mouseleave', onMouseLeave, false);
        canvas.addEventListener('click', onMouseClick, false);
        canvas.addEventListener('mousemove', onMouseMove, false);
        window.addEventListener('keyup', onKeyUp, false);
    }

    function removeEventListeners() {
        canvas.removeEventListener('mouseleave', onMouseLeave);
        canvas.removeEventListener('click', onMouseClick);
        canvas.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('keyup', onKeyUp);
    }

    function initGame() {
        game.init();
        timer.start();
        tiles = createTiles(game.numbers, p);
        setEventListeners();
        drawStage();
    }

    function toggleHelp() {
        var hidden = help.style.display === 'none';
        help.style.display = (hidden) ? 'table' : 'none';
    }

    function move(dir, full) {
        var data = game.move(dir, full);
        if (data) {
            updateStage(data);
        }
    }

    function onResize() {
        p = new Props();
        canvas.width = canvas.height = p.size;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        canvas.style.marginLeft = p.marginLeft + 'px';
        canvas.style.marginTop = p.marginTop + 'px';
        game.numbers.forEach(function(n, i) {
            var gtile = game.tiles[n];
            var x, y;
            if (n) {
                x = p.gap + gtile.col * (p.tile + p.gap);
                y = p.gap + gtile.row * (p.tile + p.gap);
                tiles[i] = new Tile(ctx, n.toString(), x, y, p.tile, p.gap);
            }
        });
        drawStage();
    }

    function onSpecKeyUp(e) {
        switch (e.keyCode) {
            case 32:
                initGame();
                break;
            case 27:
                toggleHelp();
        }
    }

    function onKeyUp(e) {
        switch (e.keyCode) {
            case 87:
                move('up', true);
                break;
            case 38:
                move('up');
                break;
            case 83:
                move('down', true);
                break;
            case 40:
                move('down');
                break;
            case 68:
                move('right', true);
                break;
            case 39:
                move('right');
                break;
            case 65:
                move('left', true);
                break;
            case 37:
                move('left');
        }
    }

    function onMouseLeave() {
        for (var i = 0; i < 15; i++) {
            tiles[i].c = '#193441';
        }
        canvas.style.cursor = 'auto';
        drawStage();
    }

    function onMouseClick(e) {
        var mouse = getMousePosition(canvas, e);
        for (var i = 0; i < 15; i++) {
            if (pointInRect(mouse, tiles[i])) {
                var data = game.checkState(tiles[i].n);
                if (data) {
                    updateStage(data);
                }
                break;
            }
        }
    }

    function updateStage(d) {
        var arr = [];
        tiles.forEach(function(tile) {
            if (d.arr.indexOf(tile.n) !== -1) {
                arr.push(tile);
            }
        });
        var animTime = 160;
        var startTime;
        var rAF = requestAnimationFrame(animateStage);

        function animateStage(time) {
            startTime = startTime || time;
            var dT = (time - startTime) / animTime;
            if (dT >= 1) {
                arr.forEach(function(tile) {
                    tile.update(d.move, 1);
                });
                cancelAnimationFrame(rAF);
                if (d.completed) {
                    onComplete();
                }
                drawStage();
                initGlitch();
            } else {
                arr.forEach(function(tile) {
                    tile.update(d.move, dT);
                    tile.c = '#193441';
                });
                drawStage();
                rAF = requestAnimationFrame(animateStage);
            }

        }
    }

    function initGlitch() {
        if (Math.random() > 0.9) {
            removeEventListeners();
            glitch.draw(setEventListeners);
        }
    }

    function onComplete() {
        removeEventListeners();
        for (var j = 0; j < 15; j++) {
            tiles[j].c = '#FCFFF5';
        }
        canvas.style.cursor = 'auto';
        timer.stop();
    }

    function updateTiles(d) {
        tiles.forEach(function(tile) {
            if (d.arr.indexOf(tile.n) !== -1) {
                tile.move(d.move);
            }
        });
    }

    function onMouseMove(e) {
        var mouse = getMousePosition(canvas, e);
        var cursor = 'auto';
        for (var i = 0; i < 15; i++) {
            if (pointInRect(mouse, tiles[i]) && game.checkLine(tiles[i].n)) {
                tiles[i].c = '#3E606F';
                cursor = 'pointer';
            } else {
                tiles[i].c = '#193441';
            }
        }
        canvas.style.cursor = cursor;
        drawStage();
    }

    function getMousePosition(c, e) {
        var bcr = c.getBoundingClientRect();
        return {
            x: e.pageX - bcr.left,
            y: e.pageY - bcr.top
        };
    }

    function pointInRect(point, rect) {
        return inRange(point.x, rect.x, rect.x + rect.s) && inRange(point.y, rect.y, rect.y + rect.s);
    }

    function inRange(value, min, max) {
        return value >= Math.min(min, max) && value <= Math.max(min, max);
    }
})();
