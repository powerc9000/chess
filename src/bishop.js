var $h = require("../lib/headOn.js");
var Piece = require("./piece.js");

function Bishop(team, x, y){
  Piece.apply(this, arguments);
  this.attacksDiag = true;
}
$h.inherit(Piece, Bishop);
//Returns an array of all possible x,y pairs the Bishop can move
Bishop.prototype.calcMoves = function(board){
   var squares = [];
  //Go up

 
  this.checkDiagUpLeft(7, squares);
  this.checkDiagUpRight(7, squares);
  this.checkDiagDownLeft(7, squares);
  this.checkDiagDownRight(7, squares);
  this.validSquares = squares;
};

module.exports = Bishop;