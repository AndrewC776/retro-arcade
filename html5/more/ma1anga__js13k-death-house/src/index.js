const levelSize = vec2(10);
const mainTileLayer = new TileLayer(vec2(), levelSize);

function gameInit()
{
    // called once after the engine starts up
    // setup the game

    initTileCollision(levelSize);

    debugPoint(levelSize, "#FF0000", 1000);
    debugPoint(vec2(), "#FF0000", 1000);

    this.renderRoof();
    this.renderFloor();
    this.renderRightWall();
    this.renderLeftWall();

    new Player(vec2(5), vec2(1), 0);
    // createTestEmmiter();
    // cameraPos = levelSize;
    cameraScale = 30;
    gravity = -.01;
}

function renderRoof() {

    for(let x = levelSize.x; x--;){
        // debugPoint(vec2(x, 0), "#FF0000", 1000);
        setTileCollisionData(vec2(x, 0), 1);

        // create tile layer data with tile index 1 and random orientation and color
        const tileIndex = 1;
        const data = new TileLayerData(tileIndex);

        mainTileLayer.setData(vec2(x, 0), data);
    }

    mainTileLayer.redraw();
}

function renderFloor(){
    for(let x = levelSize.x; x--;){
        debugPoint(vec2(x, levelSize.y), "#FF0000", 1000);
        setTileCollisionData(vec2(x, levelSize.y - 1), 1);

        // create tile layer data with tile index 0 and random orientation and color
        const tileIndex = 1;
        const data = new TileLayerData(tileIndex);

        mainTileLayer.setData(vec2(x, levelSize.y - 1), data);
    }

    mainTileLayer.redraw();
}

function renderLeftWall() {
    for(let y = levelSize.y; y--;){
        debugPoint(vec2(0, y), "#FF0000", 1000);
        setTileCollisionData(vec2(0, y), 1);

        // create tile layer data with tile index 0 and random orientation and color
        const tileIndex = 1;
        const data = new TileLayerData(tileIndex);

        mainTileLayer.setData(vec2(0, y - 1), data);
    }

    mainTileLayer.redraw();
}

function renderRightWall() {
    for(let y = levelSize.y; y--;){
        debugPoint(vec2(levelSize.x, y), "#FF0000", 1000);
        setTileCollisionData(vec2(levelSize.x - 1, y), 1);

        // create tile layer data with tile index 0 and random orientation and color
        const tileIndex = 1;
        const data = new TileLayerData(tileIndex);

        mainTileLayer.setData(vec2(levelSize.x - 1, y), data);
    }

    mainTileLayer.redraw();
}



function createTestEmmiter() {
      // create particle emitter
     const center = vec2(7,7)
     particleEmiter = new ParticleEmitter(
         center, 0, 1, 0, 500, PI, // pos, angle, emitSize, emitTime, emitRate, emiteCone
         0, vec2(16),                            // tileIndex, tileSize
         new Color(1,1,1),   new Color(0,0,0),   // colorStartA, colorStartB
         new Color(1,1,1,0), new Color(0,0,0,0), // colorEndA, colorEndB
         2, .2, .2, .1, .05,     // particleTime, sizeStart, sizeEnd, particleSpeed, particleAngleSpeed
         .99, 1, 1, PI, .05,     // damping, angleDamping, gravityScale, particleCone, fadeRate, 
         .5, 1, 1                // randomness, collide, additive, randomColorLinear, renderOrder
     );
     particleEmiter.elasticity = .3; // bounce when it collides
     particleEmiter.trailScale = 2;  // stretch in direction of motion
}

function gameUpdate()
{

    cameraScale = clamp(cameraScale*(1-mouseWheel/10), 1, 1e3);

    // if (mousePosScreen.x)
    //     particleEmiter.pos = mousePos;
    // called every frame at 60 frames per second
    // handle input and update the game state
}

function gameUpdatePost()
{
    // called after physics and objects are updated
    // setup camera and prepare for render
}

function gameRender()
{
    // called before objects are rendered
    // draw any background effects that appear behind objects
}

function gameRenderPost()
{
    // called after objects are rendered
    // draw effects or hud that appear above all objects
}

// startup LittleJS with your game functions after the tile image is loaded
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, 'tiles.png');