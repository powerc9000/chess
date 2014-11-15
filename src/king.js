var $h = require("../lib/headOn.js");
var Piece = require("./piece.js");

function King(team, x, y){
  Piece.call(this, team, x, y);
}
$h.inherit(Piece, King);
//Returns an array of all possible x,y pairs the queen can move
King.prototype.moves = function(board){
  //Go up
  //Go down
  //Go left
};

module.exports = King;