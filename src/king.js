var $h = require("../lib/headOn.js");
var Piece = require("./piece.js");

function King(team, x, y){
  Piece.apply(this, arguments);
  this.attacksKing = true;
}
$h.inherit(Piece, King);
//Returns an array of all possible x,y pairs the queen can move
King.prototype.calcMoves = function(){
  var squares = [];
  this.checkUp(1, squares);
  this.checkLeft(1, squares);
  this.checkDown(1, squares);
  this.checkRight(1, squares);
  this.checkDiagUpLeft(1, squares);
  this.checkDiagUpRight(1, squares);
  this.checkDiagDownLeft(1, squares);
  this.checkDiagDownRight(1, squares);
  this.validSquares = squares;
};

King.prototype.underAttack = function(startPos, endPos){
  var squares = [];
  var piece;
  var attacked = false;
  this.position.x = endPos[0];
  this.position.y = endPos[1];
  this.pieces.useIntermediateBoard(startPos, endPos);
  piece = this.checkUp(7, squares, true);
  if(piece && piece.getTeam() === this.team && piece.attacksOrtho){
    console.log("up", piece);
    attacked = true;
  }
  piece = this.checkLeft(7, squares, true);
  if(!attacked && piece && piece.getTeam() === this.team && piece.attacksOrtho){
    console.log("left", piece);
    attacked = true;
  }
  piece = this.checkDown(7, squares, true);
  if(!attacked && piece && piece.getTeam() === this.team && piece.attacksOrtho){
    console.log("down", piece);
    attacked = true;
  }
  piece = this.checkRight(7, squares, true);
  if(!attacked && piece && piece.getTeam() === this.team && piece.attacksOrtho){
    console.log("right", piece);
    attacked = true;
  }
  piece = this.checkDiagUpLeft(7, squares, true);
  console.log(piece);
  if(!attacked && piece && piece.getTeam() === this.team && piece.attacksDiag){
    console.log("diag", piece);
    attacked = true;
  }
  piece = this.checkDiagUpRight(7, squares, true);
  if(!attacked && piece && piece.getTeam() === this.team && piece.attacksDiag){
    console.log("diag", piece);
    attacked = true;
  }
  piece = this.checkDiagDownLeft(7, squares, true);
  if(!attacked && piece && piece.getTeam() === this.team && piece.attacksDiag){
    console.log("diag", piece);
    attacked = true;
  }
  piece = this.checkDiagDownRight(7, squares, true);
  if(!attacked && piece && piece.getTeam() === this.team && piece.attacksDiag){
    console.log("diag", piece);
    attacked = true;
  }
  this.position.x = startPos[0];
  this.position.y = startPos[1];
  this.pieces.useActualBoard();
  return attacked;
};

module.exports = King;