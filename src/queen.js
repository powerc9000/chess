var $h = require("../lib/headOn.js");
var Piece = require("./piece.js");

function Queen(team, x, y){
  Piece.call(this, team, x, y);
}
$h.inherit(Piece, Queen);
//Returns an array of all possible x,y pairs the queen can move
Queen.prototype.moves = function(board){
  //Go up
  //Go down
  //Go left
};

module.exports = Queen;