var $h = require("../lib/headOn.js");
var Piece = require("./piece.js");

function Rook(team, x, y){
  Piece.call(this, team, x, y);
}
$h.inherit(Piece, Rook);
//Returns an array of all possible x,y pairs the Rook can move
Rook.prototype.moves = function(board){
  //Go up
  //Go down
  //Go left
};

module.exports = Rook;