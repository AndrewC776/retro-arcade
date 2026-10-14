var c = document.getElementById("c");
var f = document.getElementById("f");
var ctx = c.getContext("2d");
var img = ctx.getImageData(0, 0, 256, 240);
var buf = new ArrayBuffer(img.data.length);
var b8 = new Uint8ClampedArray(buf);
var b32 = new Uint32Array(buf);

var a = 0;
var p = 0;
var L = [];
var R = [];
var s = 0;
var n = 0;
var t = 0;
var u = 0;
var sx = 64;
var sy = 24;

function audioInit() {
  if (!a) {
    var AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    a = new AC();
    p = a.createScriptProcessor(512, 0, 2);
    p.connect(a.destination);
    p.onaudioprocess = function (e) {
      if (L.length >= s + 512) {
        for (var i = 0; i < 512; i++) {
          e.outputBuffer.getChannelData(0)[i] = L[s];
          e.outputBuffer.getChannelData(1)[i] = R[s];
          s++;
        }
      }
    };
  }
  if (a && a.state === "suspended") a.resume();
}

function drawUI() {
  ctx.fillStyle = "#bdbdbd";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = "#888";
  ctx.fillRect(sx - 6, sy - 6, 268, 252);
  ctx.fillStyle = "#000";
  ctx.fillRect(sx, sy, 256, 240);
  var x = sx - 44,
    y = sy + 84;
  ctx.fillStyle = "#222";
  ctx.fillRect(x, y, 16, 16);
  ctx.fillRect(x, y - 16, 16, 16);
  ctx.fillRect(x, y + 16, 16, 16);
  ctx.fillRect(x - 16, y, 16, 16);
  ctx.fillRect(x + 16, y, 16, 16);
  ctx.fillStyle = "#555";
  u & 16 && ctx.fillRect(x, y - 16, 16, 16);
  u & 32 && ctx.fillRect(x, y + 16, 16, 16);
  u & 64 && ctx.fillRect(x - 16, y, 16, 16);
  u & 128 && ctx.fillRect(x + 16, y, 16, 16);
  ctx.fillStyle = u & 2 ? "#f55" : "#c33";
  ctx.fillRect(sx + 270, sy + 70, 18, 18);
  ctx.fillStyle = u & 1 ? "#f55" : "#c33";
  ctx.fillRect(sx + 270, sy + 100, 18, 18);
}

function renderFrame(frame) {
  drawUI();
  for (var y = 0; y < 240; y++) {
    for (var x = 0; x < 256; x++) {
      var i = (y * 256) + x;
      b32[i] = 0xff000000 | frame[i];
    }
  }
  img.data.set(b8);
  ctx.putImageData(img, sx, sy);
}

function startRom(data) {
  if (t) clearInterval(t);
  L = [];
  R = [];
  s = 0;
  audioInit();

  n = new jsnes.NES({
    onFrame: renderFrame,
    onAudioSample: function (l, r) {
      if (!p) return;
      L.push(l);
      R.push(r);
    },
  });

  n.loadROM(data);
  t = setInterval(n.frame, 16);
}

drawUI();

f.onchange = function () {
  audioInit();
  var file = this.files[0];
  if (!file) return;
  var r = new FileReader();
  r.readAsBinaryString(file);
  r.onload = function () {
    startRom(r.result);
  };
};

onkeydown = onkeyup = function (e) {
  audioInit();
  if (!n) return;
  var k = { 37: 6, 38: 4, 39: 7, 40: 5, 90: 0, 88: 1, 27: 2, 13: 3 }[
    e.keyCode
  ];
  if (k == null) return;
  u = e.type[5] ? u | (1 << k) : u & ~(1 << k);
  n.controllers[1].state[k] = e.type[5] ? 65 : 64;
};
