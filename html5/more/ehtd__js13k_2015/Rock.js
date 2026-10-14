
var Rock = function(x, y) {
    this.ctx = ctx;
    this.image = scaledMap;
    this.tileId = r_;
    this.width = tileSize;
    this.height = tileSize;
    this.x = x;
    this.y = y;
    this.collisionGroup = [];
    this.eggCollisionGroup = [];
};

Rock.prototype = new Sprite();
Rock.prototype.constructor = Rock;

Rock.prototype.addItemToCollisionGroup = function(item) {
    this.collisionGroup.push(item);
};

Rock.prototype.addGroupToCollisionGroup = function(group) {

    for (var i = 0; i < group.length; i++) {
        this.addItemToCollisionGroup(group[i]);
    }
};

Rock.prototype.addRocksToCollisionGroup = function(group) {

    for (var i = 0; i < group.length; i++) {
        var rock = group[i];
        if ((rock.x == this.x) && (rock.y == this.y)) {
            continue;
        }
        this.addItemToCollisionGroup(rock);
    }
};

Rock.prototype.canMove = function(dx, dy) {

    var mask = this.newCollisionMask(this.x+dx+5,
        this.y+dy+5,
        this.width-10,
        this.height-10);

    var collided = this.collided(this.collisionGroup, mask)
        || this.collided(this.eggCollisionGroup,mask);

    if (collided) {
        return false;
    }
    else {
        this.x += dx;
        this.y += dy;

        return true;
    }
};
