(function(){
  "use strict";
  var $h = require("../lib/headOn.js");
  var canvasSize = 800;
  var gameRunner = require("./game_runner.js");
  var board = require("./board.js");
  var pieces = require("./pieces.js");
  var camera = new $h.Camera(canvasSize, canvasSize);
  var canvas = $h.canvas.create("main", canvasSize, canvasSize, camera);
  var gameHTMLNode = document.getElementById("game");
  var TEAMS = {white:{}, black:{}};
  //Make an enum of the teams kind of hacky but it will work
  Object.freeze(TEAMS);
  window.TEAMS = TEAMS;
  window.assert = function assert(condition, message){
    if(!condition){
      message = message || "Assertion failed";
      if(typeof Error !== "undefined"){
        throw new Error(message);
      }
      //Fallback;
      throw message;
    }
  };
  $h.constants("squareSize", canvasSize/8);
  canvas.append("#game");
  board.setSquareSize($h.constants("squareSize"));
  gameHTMLNode.style.width = canvasSize;
  gameHTMLNode.style.height = canvasSize;
  board.setWhiteColor("#440663");
  board.setBlackColor("#CCCCCC");


  pieces.init();
  gameRunner.init(pieces);
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

