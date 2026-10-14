function Game(generator, colorGen, BallClass) {

    let score = 0;
    let timerCount = 15;
    let scoreText, timerText;
    let startTime = Date.now();
    let isCorrect = true;
    let ballsNumber = 8;
    let world;

    this.onCorrect = () => {
        startTime = Date.now();
        timerCount = 12;
        score++;
        scoreText.setText(`SCORE: ${score}`);
        if (score%10 === 0) generator.levelUp();
        ballsNumber = Math.floor(score / 15) + 8;
    };

    this.onFail = () => {
        world.stop();
        scoreText.setText(`WRONG! SCORE: ${score}`);
    };

    this.reset = () => {
        score = 0;
        timerCount = 12;
        startTime = Date.now();
        scoreText.setText('SCORE: 0');
    };

    this.start = w => {
        world = w;
        world.addCallback(onTick);
    };

    this.setTextfields = (tf1, tf2) => {
        scoreText = tf1;
        timerText = tf2;
        scoreText.setText('SCORE: 0');
        timerText.setText(timerCount);
    };

    function onTick(n) {
        const dt = Date.now() - startTime;
        const remaining = 12 - Math.round(dt / 1000);
        if (n < ballsNumber) createBall();
        if (remaining !== timerCount) {
            timerCount = remaining;
            timerText.setText(timerCount);
        }
        if (dt > 12000) {
            scoreText.setText(`TIME OUT! SCORE: ${score}`);
            world.stop();
        }
    }

    function createBall() {
        const id = getRandomID();
        isCorrect = !isCorrect;
        const expression = generator.getExpression(isCorrect);
        const colors = colorGen.getColors();
        const ball = new BallClass(id, expression, colors);
        world.spawn(ball);
    }

    function getRandomID() {
        const letters = '0123456789ABCDEF';
        let id = '';
        for (let i = 0; i < 10; i++) {
            id += letters[Math.floor(Math.random() * 16)];
        }
        return id;
    }
}
