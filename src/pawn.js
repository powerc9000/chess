var $h = require("../lib/headOn.js");
var Piece = require("./piece.js");

function Pawn(team, x, y){
  Piece.call(this, team, x, y);
}
$h.inherit(Piece, Pawn);
//Returns an array of all possible x,y pairs the Pawn can move
Pawn.prototype.moves = function(board){
  //Go up
  //Go down
  //Go left
};

module.exports = Pawn;