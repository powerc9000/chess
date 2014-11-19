var $h = require("../lib/headOn.js");
var Piece = require("./piece.js");

function Knight(team, x, y){
  Piece.apply(this, arguments);
}
$h.inherit(Piece, Knight);
//Returns an array of all possible x,y pairs the Knight can move
Knight.prototype.calcMoves = function(board){
  "use strict";
  
  var squares = [];
  var x       = this.position.x;
  var y       = this.position.y;
  var newx;
  var newy;
  var p;
  var angle = 0;
  var sin;
  var cos;
  var coord1;
  var coord2;
  for(var i = 0; i<4; i++, angle+=Math.PI/2){
    sin = Math.round(Math.sin(angle));
    cos = Math.round(Math.cos(angle));
    //Go around the cirle starting at 0 degrees
    //Check 0, 90, 180, 270

    //If sin === 0 that means we are at 0 or 180 degrees
    //x goes over 2 and y goes up or down 1
    if(sin === 0){
      newx = x + cos * 2;
      coord1 = [newx, y+1];
      coord2 = [newx, y-1];
    }else{//We are at 90 or 270 degrees y goes up or down 2 and x goes up or down 1
      newy = y + sin * 2;
      coord1 = [x-1, newy];
      coord2 = [x+1, newy];
    }
    //Check for collisions and if we are in bounds
    p = this.pieces.at(coord1[0], coord1[1]);
    if(this.inBounds(coord1[0], coord1[1]) && (!p || p.team != this.team)){
      squares.push(coord1);
    }
    p = this.pieces.at(coord2[0], coord2[1]);
    if(this.inBounds(coord2[0], coord2[1]) && (!p || p.team != this.team)){
      squares.push(coord2);
    }
    
  }
  console.log(squares);
  this.validSquares = squares;
};

module.exports = Knight;