function World() {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    const FPS_INTERVAL = 0.3;
    let objects = [];
    let staticObjects = [];
    let isStopped = true;
    const bounds = {
        w: window.innerWidth,
        h: window.innerHeight
    };
    const callbacks = [];
    let tickTime = performance.now();
    let lastTicks = 0;
    canvas.width = bounds.w;
    canvas.height = bounds.h;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    this.centerX = bounds.w / 2;
    this.centerY = bounds.h / 2;
    this.width = bounds.w;
    this.height = bounds.h;

    this.add = obj => {
        if (obj.isStatic) {
            staticObjects.push(obj);
        } else {
            objects.push(obj);
        }
    };

    this.stop = () => {
        isStopped = true;
    };

    this.isStopped = () => {
        return isStopped;
    };

    this.reset = () => {
        isStopped = false;
        objects = [];
        staticObjects = [];
        tickTime = performance.now();
        lastTicks = 0;
        loop(tickTime);
    };

    this.addCallback = cb => {
        callbacks.push(cb);
    };

    this.spawn = obj => {
        const data = getData();
        data.ctx = ctx;
        data.bounds = bounds;
        obj.setData(data);
        this.add(obj);
    };

    function getData() {
        const posIndex = getRandomInt(0, 3);
        let x, y, vx, vy;
        switch (posIndex) {
            case 0:
                x = getRandomInt(0, bounds.w);
                y = 0;
                vx = getRandomInt(-5, 5);
                vy = getRandomInt(-5, -1);
                break;
            case 1:
                x = bounds.w;
                y = getRandomInt(0, bounds.h);
                vx = getRandomInt(1, 5);
                vy = getRandomInt(-5, 5);
                break;
            case 2:
                x = getRandomInt(0, bounds.w);
                y = bounds.h;
                vx = getRandomInt(-5, 5);
                vy = getRandomInt(1, 5);
                break;
            case 3:
                x = 0;
                y = getRandomInt(0, bounds.h);
                vx = getRandomInt(-5, -1);
                vy = getRandomInt(-5, 5);
                break;
        }
        return {x, y, vy, vx};
    }

    function loop(t) {
        if (lastTicks > 3) return;
        const elapsed = t - tickTime;
        update();
        if (elapsed > FPS_INTERVAL) {
            tickTime = t;
            clear();
            render();
            notify();
        }
        if (isStopped) lastTicks++;
        requestAnimationFrame(loop);
    }

    function notify() {
        const size = objects.length;
        callbacks.forEach(cb => cb(size));
    }

    function clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    function update() {
        for (let i = objects.length - 1; i >= 0; i--) {
            let obj = objects[i];
            if (!obj.isAlive) {
                objects.splice(i, 1);
                obj = null;
            } else {
                handleCollisions();
                obj.update();
            }
        }
    }

    function handleCollisions() {
        objects.forEach(chekcOtherObjects);
    }

    function chekcOtherObjects(obj, i) {
        if (obj.done || obj.isYoung) return;
        objects.forEach((el, j) => {
            if (j <= i || el.done || el.isYoung) return;
            const boom = obj.intersects(el);
            if (boom) {
                const vx = obj.vx;
                const vy = obj.vy;
                obj.bump(el.id, el.vx, el.vy, el.data.isCorrect);
                el.bump(obj.id, vx, vy, obj.data.isCorrect);
            }
        });
    }

    function render() {
        objects.forEach(obj => obj.render());
        staticObjects.forEach(obj => obj.render());
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
