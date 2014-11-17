(function(){
  "use strict";
  var $h = require("../lib/headOn.js");
  var canvasSize = 800;
  var board = require("./board.js");
  var pieces = require("./pieces.js");
  var camera = new $h.Camera(canvasSize, canvasSize);
  var canvas = $h.canvas.create("main", canvasSize, canvasSize, camera);
  var gameHTMLNode = document.getElementById("game");
  $h.constants("squareSize", canvasSize/8);
  board.setSquareSize($h.constants("squareSize"));
  canvas.append("#game");
  gameHTMLNode.style.width = canvasSize;
  gameHTMLNode.style.height = canvasSize;
  board.setWhiteColor("#440663");
  board.setBlackColor("#CCCCCC");
  pieces.init();
  registerClicks(canvas, board);
  $h.render(function(){
    board.draw(canvas);
    pieces.draw(canvas, board.isFlipped());
  });
  $h.update(function(){

  });
  $h.run();
  //Sets up event listeners for clicks on the canvas
  //Turns those into what square was clicked on
  //Fire an event saying as much
  function registerClicks(canvas, board){
    var domObject = canvas.canvas.canvas;
    var squareSize = $h.constants("squareSize");
    domObject.addEventListener("mouseup", function(e){
      var x = Math.floor(e.offsetX/ squareSize);
      var y = Math.floor(e.offsetY/ squareSize);
      y = (board.isFlipped()) ? y : (y - 7) * -1;

      $h.events.trigger("squareclick", x, y);
    });
  }
}());

