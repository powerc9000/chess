var $h = require("../lib/headOn.js");
var Piece = require("./piece.js");

function Queen(team, x, y){
  console.log(arguments);
  Piece.apply(this, arguments);
}
$h.inherit(Piece, Queen);
//Returns an array of all possible x,y pairs the queen can move
Queen.prototype.calcMoves = function(){
  //Valid squares
  var squares = [];
  //Go up

  squares = squares.concat(this.checkUp(7));
  squares = squares.concat(this.checkLeft(7));
  squares = squares.concat(this.checkDown(7));
  squares = squares.concat(this.checkRight(7));
  squares = squares.concat(this.checkDiagUpLeft(7));
  squares = squares.concat(this.checkDiagUpRight(7));
  squares = squares.concat(this.checkDiagDownLeft(7));
  squares = squares.concat(this.checkDiagDownRight(7));
  this.validSquares = squares;
};



module.exports = Queen;