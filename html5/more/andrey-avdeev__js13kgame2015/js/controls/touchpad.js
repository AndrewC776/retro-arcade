function Touchpad() {
    this.onTouchStart = function (e) {
        if ($.player.isActive) {
            $.g *= -1;
            $.player.shoot();
        }
    }
    this.onTouchEnd = function (e) {
        if ($.player.isActive) {
            $.g *= -1;
            $.player.shoot();
        } else {
            if ($.timeNow - $.timeDeath > 1500) {
                $.gui.restart();
            }
        }
    }
}