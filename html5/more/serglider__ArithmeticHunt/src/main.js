const help = document.querySelector('.help-outer');
let isHelpShown = true;

const colorGen = new ColorGenerator();
const generator = new Generator();
const game = new Game(generator, colorGen, Ball);
const world = new World();
const player = new Player(game, world.centerX, world.centerY);

const scoreText = new Textfield({
    x: world.centerX,
    y: 30,
    color: '#DDDCC5',
    fontSize: 36
});
const timerText = new Textfield({
    x: world.width - 40,
    y: 30,
    color: '#DDDCC5',
    fontSize: 36,
    text: '12'
});

const toolbar = new Rect({
    x: 0,
    y: 0,
    w: world.width,
    h: 60,
    color: 'rgba(29,35,38,0.7)'
});

window.onkeyup = e => {
    if (world.isStopped()) {
        if (e.keyCode === 32) {
            if (isHelpShown) toggleHelp();
            init();
        } else if (e.keyCode === 27) {
            toggleHelp();
        }
    }
};

game.setTextfields(scoreText, timerText);
game.start(world);

function init() {
    generator.reset();
    player.reset();
    game.reset();
    world.reset();
    world.spawn(player);
    world.spawn(toolbar);
    world.spawn(scoreText);
    world.spawn(timerText);
}

function toggleHelp() {
    isHelpShown = !isHelpShown;
    help.style.display = isHelpShown ? 'table' : 'none';
}
