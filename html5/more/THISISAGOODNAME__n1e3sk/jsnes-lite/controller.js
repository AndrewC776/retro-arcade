var Controller = function () {
  this.state = [64, 64, 64, 64, 64, 64, 64, 64];
};

Controller.prototype = {
  buttonDown: function (key) {
    this.state[key] = 65;
  },

  buttonUp: function (key) {
    this.state[key] = 64;
  },
};

