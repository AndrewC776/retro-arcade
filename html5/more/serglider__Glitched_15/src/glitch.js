function Glitch(ctx, p) {
    var s = p.size;
    var center = s / 2;
    var gCanvas = document.createElement('canvas');
    var gCtx = gCanvas.getContext('2d');
    gCanvas.width = gCanvas.height = s;

    this.draw = function(onComplete) {
        var idata = ctx.getImageData(0, 0, s, s);
        var dir = Math.random() > 0.5 ? 1 : -1;
        var speed = dir * (0.2 + Math.random() * 0.3);
        gCtx.putImageData(idata, 0, 0);
        animateGlitch(speed, onComplete);
    };

    function draw(a) {
        ctx.clearRect(0, 0, s, s);
        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(a);
        ctx.drawImage(gCanvas, -center, -center);
        ctx.restore();
    }

    function animateGlitch(speed, onComplete) {
        var endAngle = Math.PI * 2;
        var angle = 0;
        var rAF = requestAnimationFrame(animate);

        function animate() {
            angle += speed;
            if (Math.abs(angle) >= endAngle) {
                cancelAnimationFrame(rAF);
                draw(0);
                onComplete();
            } else {
                draw(angle);
                rAF = requestAnimationFrame(animate);
            }
        }
    }
}
