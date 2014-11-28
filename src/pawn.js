var $h = require("../lib/headOn.js");
var Piece = require("./piece.js");

function Pawn(team, x, y){
  Piece.apply(this, arguments);
  this.moved = false;
  this.attacksPawn = true;
}
$h.inherit(Piece, Pawn);
//Returns an array of all possible x,y pairs the Pawn can move
Pawn.prototype.calcMoves = function(){
  var squares = [];
  //Go up
  var range = (!this.moved) ? 2 : 1;
  var dx;
  var tiley;
  var tilex;
  var pieceAt;
  if(this.team === TEAMS.white){
      dx = 1;
  }else{
    dx = -1;
  }
  //Move the correct direction to look at the tile
  tiley = this.position.y + dx;
  //Go however many squares we can look forward and select valid spaces
  for(var i = 1; i<=range; i++){
    //If there isnt a piece blocking us add it to our valid list
    if(!this.pieces.at(this.position.x, tiley)){
      squares.push([this.position.x, tiley]);
    }else{//we can go no farther just break out;
      break;
    }
    tiley += dx;
  }
  
  //Now we check the diagnals
  tiley = this.position.y + dx;
  tilex = this.position.x;
  pieceAt = this.pieces.at(tilex+1, tiley);
  if(pieceAt && pieceAt.getTeam() !== this.team){
    squares.push([tilex+1, tiley]);
  }
  pieceAt = this.pieces.at(tilex-1, tiley);
  if(pieceAt && pieceAt.getTeam() !== this.team){
    squares.push([tilex-1, tiley]);
  }
  this.validSquares = squares;
};
Pawn.prototype.moveTo = function(x, y){
  
  if(Piece.prototype.moveTo.call(this, x, y)){
    this.moved = true;
    return true;
  }else{
    return false;
  }
};

module.exports = Pawn;