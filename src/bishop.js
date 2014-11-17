var $h = require("../lib/headOn.js");
var Piece = require("./piece.js");

function Bishop(team, x, y){
  Piece.apply(this, arguments);
}
$h.inherit(Piece, Bishop);
//Returns an array of all possible x,y pairs the Bishop can move
Bishop.prototype.calcMoves = function(board){
   var squares = [];
  //Go up

 
  squares = squares.concat(this.checkDiagUpLeft(7));
  squares = squares.concat(this.checkDiagUpRight(7));
  squares = squares.concat(this.checkDiagDownLeft(7));
  squares = squares.concat(this.checkDiagDownRight(7));
  this.validSquares = squares;
};

module.exports = Bishop;