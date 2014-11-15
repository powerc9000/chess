var $h = require("../lib/headOn.js");
var Piece = require("./piece.js");

function Bishop(team, x, y){
  Piece.call(this, team, x, y);
}
$h.inherit(Piece, Bishop);
//Returns an array of all possible x,y pairs the Bishop can move
Bishop.prototype.moves = function(board){
  //Go up
  //Go down
  //Go left
};

module.exports = Bishop;