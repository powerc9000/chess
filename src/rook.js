var $h = require("../lib/headOn.js");
var Piece = require("./piece.js");

function Rook(team, x, y){
  Piece.apply(this, arguments);
  this.attacksOrtho = true;
}
$h.inherit(Piece, Rook);
//Returns an array of all possible x,y pairs the Rook can move
Rook.prototype.calcMoves = function(){
   var squares = [];
  //Go up

  this.checkUp(7, squares);
  this.checkLeft(7, squares);
  this.checkDown(7, squares);
  this.checkRight(7, squares);
  
  this.validSquares = squares;
};

module.exports = Rook;