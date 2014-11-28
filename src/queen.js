var $h = require("../lib/headOn.js");
var Piece = require("./piece.js");

function Queen(team, x, y){
  Piece.apply(this, arguments);
  this.attacksOrtho = true;
  this.attacksDiag = true;
  // if(this.team === TEAMS.black){
  //   this.image = $h.images("black_queen");
  // }else{
  // }
}
$h.inherit(Piece, Queen);
//Returns an array of all possible x,y pairs the queen can move
Queen.prototype.calcMoves = function(){
  //Valid squares
  var squares = [];
  var king = this.pieces.getKing(this.team);
  //Go up

  this.checkUp(7, squares);
  this.checkLeft(7, squares);
  this.checkDown(7, squares);
  this.checkRight(7, squares);
  this.checkDiagUpLeft(7, squares);
  this.checkDiagUpRight(7, squares);
  this.checkDiagDownLeft(7, squares);
  this.checkDiagDownRight(7, squares);


  this.validSquares = squares;
};



module.exports = Queen;