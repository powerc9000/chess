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
  if(this.team === TEAMS.white){
    squares = squares.concat(this.checkUp(range));
  }else{
    squares = squares.concat(this.checkDown(range));
  }
  
  
  this.validSquares = squares;
};
Pawn.prototype.moveTo = function(x, y){
  this.moved = true;
  return Piece.prototype.moveTo.call(this, x, y);
};

module.exports = Pawn;