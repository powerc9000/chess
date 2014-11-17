var $h = require("../lib/headOn.js");
var Piece = require("./piece.js");

function Pawn(team, x, y){
  Piece.apply(this, arguments);
  this.moved = false;
}
$h.inherit(Piece, Pawn);
//Returns an array of all possible x,y pairs the Pawn can move
Pawn.prototype.calcMoves = function(){
  var squares = [];
  //Go up
  var range = (!this.moved) ? 2 : 1;
  if(this.team === "white"){
    squares = squares.concat(this.checkUp(range));
  }else{
    squares = squares.concat(this.checkDown(range));
  }
  
  
  this.validSquares = squares;
};

module.exports = Pawn;