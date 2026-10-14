function Timer(ctx, p) {
    var startTime;
    var text;
    var center = p.size / 2;
    this.stopped = false;

    this.start = function() {
        this.stopped = false;
        startTime = Date.now();
    };

    this.stop = function() {
        this.stopped = true;
        var now = Date.now();
        text = msToHMS(now - startTime);
    };

    this.draw = function() {
        var fs = p.size / 6;

        ctx.save();
        ctx.globalAlpha = 0.8;
        ctx.fillStyle = '#193441';
        ctx.fillRect(0, 0, p.size, p.size);
        ctx.restore();

        ctx.lineWidth = 1;
        ctx.strokeStyle = '#193441';
        ctx.font = '700 ' + fs + 'px fantasy';

        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.fillText(text, center, center);
        ctx.restore();

        ctx.strokeText(text, center, center);
    };

    function msToHMS(ms) {
        var sec = parseInt((ms / 1000) % 60);
        var min = parseInt((ms / (1000 * 60)) % 60);
        var hours = parseInt((ms / (1000 * 60 * 60)) % 24);
        hours = (hours < 10) ? '0' + hours : hours;
        min = (min < 10) ? '0' + min : min;
        sec = (sec < 10) ? '0' + sec : sec;
        return hours + ':' + min + ':' + sec;
    }

}
