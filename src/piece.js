(function(){
  "use strict";
  var $h = require("../lib/headOn.js");
  var defaults = {
    "white": "white",
    "black": "black"
  };
  function Piece(team, x, y, color){
    this.team = team;
    this.color = color || defaults[team];
    this.position = $h.Vector(x,y);
    this._active = false;
  }

  Piece.prototype.getTeam = function(){
    return this.team;
  };

  Piece.prototype.isActive = function(){
    return this._active;
  };

  Piece.prototype.setActive = function(){
    this._active = true;
  };

  Piece.prototype.setInactive = function(){
    this._active = false;
  };
  Piece.prototype.draw = function(canvas, flip){
    //Canvas x,y starts at the top left but chess x,y starts at the bottom left
    //So if the board isnt flipped we need to flip the y position of the piece to print in properly
    var y = (flip) ? this.position.y : (this.position.y - 7) * -1;
    var squareSize = $h.constants("squareSize");
    //If the piece is currently selected highlight it and its moves
    //Else just draw it normal
    if(this.isActive()){
      canvas.drawSquare(this.position.x * squareSize, y * squareSize, squareSize - 10, "red");
    }else{
      canvas.drawSquare(this.position.x * squareSize, y * squareSize, squareSize - 10, this.color);
    }
  };


  module.exports = Piece;
}());
