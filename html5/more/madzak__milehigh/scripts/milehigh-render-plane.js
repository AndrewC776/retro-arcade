/*globals MileHigh */
/*jshint unused: false */
'use strict';

MileHigh.prototype.renderPlane = function (ctx, boardWidth, boardHeight) {

  var PIECE_SIZE = 25;    // 20 pixels high and wide

  function renderImageData (row, col, img) {
    var y = row * PIECE_SIZE;
    var x = col * PIECE_SIZE;
    ctx.drawImage(img, x, y);
  }

  function renderSeat (row, col) {
    renderImageData(row, col, window.imgSeat);
  }

  function renderWall (row, col) {
    MileHigh.renderSimpleSquare(ctx, row, col, '#888');
  }

  function renderIsle (row, col) {
    //renderImageData(row, col, window.imgFloor);//this happens in dom
  }

  ctx.clearRect(0, 0, boardWidth, boardHeight);

  var layoutArray = this.world.planeLayout.arrayForRender();

  for (var row = 0; row < layoutArray.length; row++) {
    for (var col = 0; col < layoutArray[0].length; col++) {
      switch (layoutArray[row][col]) {
      case 'O':
        renderSeat(row, col);
        break;
      case ' ':
        renderIsle(row, col);
        break;
      case '+':
        MileHigh.renderLavatory(ctx, row, col, '#ffb45e');
        break;
      default:
        renderWall(row, col);
        break;
      }
    }
  }
};
