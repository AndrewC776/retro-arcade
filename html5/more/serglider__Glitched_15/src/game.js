function Game() {
    var tiles;

    this.init = function() {
        this.numbers = getNumbers();
        tiles = {};
        this.numbers.forEach(function(n, i) {
            tiles[n] = getCoords(i);
        });
        this.tiles = tiles;
    };

    this.move = function(dir, full) {
        var hole = tiles['0'],
            keys = Object.keys(tiles),
            arr = [],
            i = 0,
            temp = 0,
            tile, completed;
        if (dir === 'up') {
            if (hole.row === 3) {
                return;
            }
            for (; i < 16; i++) {
                tile = tiles[keys[i]];
                if (tile.col === hole.col && tile.row > hole.row) {
                    if (full) {
                        tile.row -= 1;
                        temp += 1;
                        arr.push(keys[i]);
                    } else {
                        if (tile.row === hole.row + 1) {
                            tile.row -= 1;
                            temp += 1;
                            arr.push(keys[i]);
                            break;
                        }
                    }
                }
            }
            hole.row += temp;
        } else if (dir === 'down') {
            if (hole.row === 0) {
                return;
            }
            for (; i < 16; i++) {
                tile = tiles[keys[i]];

                if (tile.col === hole.col && tile.row < hole.row) {
                    if (full) {
                        tile.row += 1;
                        temp -= 1;
                        arr.push(keys[i]);
                    } else {
                        if (tile.row === hole.row - 1) {
                            tile.row += 1;
                            temp -= 1;
                            arr.push(keys[i]);
                            break;
                        }
                    }
                }
            }
            hole.row += temp;
        } else if (dir === 'left') {
            if (hole.col === 3) {
                return;
            }
            for (; i < 16; i++) {
                tile = tiles[keys[i]];
                if (tile.row === hole.row && tile.col > hole.col) {
                    if (full) {
                        tile.col -= 1;
                        temp += 1;
                        arr.push(keys[i]);
                    } else {
                        if (tile.col === hole.col + 1) {
                            tile.col -= 1;
                            temp += 1;
                            arr.push(keys[i]);
                            break;
                        }
                    }
                }
            }
            hole.col += temp;
        } else if (dir === 'right') {
            if (hole.col === 0) {
                return;
            }
            for (; i < 16; i++) {
                tile = tiles[keys[i]];
                if (tile.row === hole.row && tile.col < hole.col) {
                    if (full) {
                        tile.col += 1;
                        temp -= 1;
                        arr.push(keys[i]);
                    } else {
                        if (tile.col === hole.col - 1) {
                            tile.col += 1;
                            temp -= 1;
                            arr.push(keys[i]);
                            break;
                        }
                    }
                }
            }
            hole.col += temp;
        }
        completed = isCompleted();
        return {
            move: dir,
            arr: arr,
            completed: completed
        };
    };

    this.checkLine = function(n) {
        return (tiles[n].col === tiles['0'].col) || (tiles[n].row === tiles['0'].row);
    };

    this.checkState = function(n) {
        var hole = tiles['0'];
        var arr = [];
        var keys = Object.keys(tiles);
        var move, steps;
        if (tiles[n].col === hole.col) {
            steps = hole.row - tiles[n].row;
            move = (steps > 0) ? 'down' : 'up';
            keys.forEach(function(key) {
                if (+key && (tiles[key].col === hole.col)) {
                    if (move === 'down') {
                        if (tiles[key].row >= tiles[n].row && tiles[key].row < hole.row) {
                            tiles[key].row += 1;
                            arr.push(key);
                        }
                    } else {
                        if (tiles[key].row <= tiles[n].row && tiles[key].row > hole.row) {
                            tiles[key].row -= 1;
                            arr.push(key);
                        }
                    }
                }
            });
            hole.row -= steps;
        } else if (tiles[n].row === hole.row) {
            steps = hole.col - tiles[n].col;
            move = (steps > 0) ? 'right' : 'left';
            keys.forEach(function(key) {
                if (+key && (tiles[key].row === hole.row)) {
                    if (move === 'right') {
                        if (tiles[key].col >= tiles[n].col && tiles[key].col < hole.col) {
                            tiles[key].col += 1;
                            arr.push(key);
                        }
                    } else {
                        if (tiles[key].col <= tiles[n].col && tiles[key].col > hole.col) {
                            tiles[key].col -= 1;
                            arr.push(key);
                        }
                    }
                }
            });
            hole.col -= steps;

        } else {
            return;
        }
        var completed = isCompleted();
        return {
            move: move,
            arr: arr,
            completed: completed
        };
    };

    function isCompleted() {
        var keys = Object.keys(tiles);
        return keys.every(function(key) {
            if (key === '0') {
                return true;
            }
            var coords = getCoords((+key - 1));
            return (coords.col === tiles[key].col) && (coords.row === tiles[key].row);
        });
    }

    function getCoords(i) {
        return {
            col: i % 4,
            row: Math.floor(i / 4)
        };
    }

    function getNumbers(pool, nums, temp) {
        pool = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        nums = pool.sort(rndSort).concat(0);

        // var pool1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 13, 0];
        // nums = pool1;

        if (!isSolvable(nums)) {
            temp = nums[0];
            nums[0] = nums[1];
            nums[1] = temp;
        }

        return nums;

        function rndSort() {
            return Math.random() - 0.5;
        }

        function isSolvable(a, i, j, len, dis, t) {
            for (dis = 0, i = 1, len = a.length - 1; i < len; i++) {
                for (j = i - 1; j >= 0; j--) {
                    if (a[j] > a[i]) {
                        dis++;
                    }
                }
            }
            t = dis % 2;
            return !t;
        }
    }
}
