function Keyboard() {
    var _this = this;

    this.keys = {
        isPressed: {}
    }

    this.onKeyDown = function (e) {
        if (!_this.keys.isPressed[e.keyCode]) {
            _this.keys.isPressed[e.keyCode] = true;

            switch (e.keyCode) {
                case 82:
                    if ($.player.isActive) {
                        $.g *= -1;
                        $.player.shoot();
                    }
                    break;
            }
        }
    }
    this.onKeyUp = function (e) {
        _this.keys.isPressed[e.keyCode] = false;
        switch (e.keyCode) {
            case 82:
                if ($.player.isActive) {
                    $.g *= -1;
                    $.player.shoot();
                } else {
                    if ($.timeNow - $.timeDeath > 1500) {
                        $.gui.restart();
                    }
                }
                break;
        }
    }
}