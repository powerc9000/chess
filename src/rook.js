var $h = require("../lib/headOn.js");
var Piece = require("./piece.js");

function Rook(team, x, y){
  Piece.apply(this, arguments);
}
$h.inherit(Piece, Rook);
//Returns an array of all possible x,y pairs the Rook can move
Rook.prototype.calcMoves = function(){
   var squares = [];
  //Go up

  squares = squares.concat(this.checkUp(7));
  squares = squares.concat(this.checkLeft(7));
  squares = squares.concat(this.checkDown(7));
  squares = squares.concat(this.checkRight(7));
  
  this.validSquares = squares;
};

module.exports = Rook;