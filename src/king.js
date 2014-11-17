var $h = require("../lib/headOn.js");
var Piece = require("./piece.js");

function King(team, x, y){
  Piece.apply(this, arguments);
}
$h.inherit(Piece, King);
//Returns an array of all possible x,y pairs the queen can move
King.prototype.calcMoves = function(){
   var squares = [];
  //Go up
  squares = squares.concat(this.checkUp(1));
  squares = squares.concat(this.checkLeft(1));
  squares = squares.concat(this.checkDown(1));
  squares = squares.concat(this.checkRight(1));
  squares = squares.concat(this.checkDiagUpLeft(1));
  squares = squares.concat(this.checkDiagUpRight(1));
  squares = squares.concat(this.checkDiagDownLeft(1));
  squares = squares.concat(this.checkDiagDownRight(1));
  this.validSquares = squares;
};

module.exports = King;