var $h = require("../lib/headOn.js");
var Piece = require("./piece.js");

function Knight(team, x, y){
  Piece.call(this, team, x, y);
}
$h.inherit(Piece, Knight);
//Returns an array of all possible x,y pairs the Knight can move
Knight.prototype.moves = function(board){
  //Go up
  //Go down
  //Go left
};

module.exports = Knight;