(function(){
  "use strict";
  var $h = require("../lib/headOn.js");
  var defaults = {
    "white": "white",
    "black": "black"
  };
  function Piece(team, x, y, pieces, color){
    console.log(team, x, y, color);
    this.team = team;
    this.color = color || pieces.getTeamColor(team);
    this.position = $h.Vector(x,y);
    this._active = false;
    this.pieces = pieces;
    this.validSquares = [];
  }

  Piece.prototype.getTeam = function(){
    return this.team;
  };

  Piece.prototype.isActive = function(){
    return this._active;
  };
  Piece.prototype.calcMoves = function(){};
  Piece.prototype.setActive = function(){
    this.calcMoves();
    this._active = true;
  };

  Piece.prototype.setInactive = function(){
    this._active = false;
  };
  Piece.prototype.checkUp = function(range){
    var squares = [];
    var p = null;
    var tile = this.position.y + 1;
    var dist = 1;
    while(tile < 8 && dist <= range){
      p = this.pieces.at(this.position.x, tile);
      if(!p){
        squares.push([this.position.x, tile]);
      }else{
        if(p.team != this.team){
          squares.push([this.position.x, tile]);
        }
        break;
      }
      tile++;
      dist++;
    }
    return squares;
  };
  Piece.prototype.checkDown = function(range){
    var squares = [];
    var p = null;
    var tile = this.position.y - 1;
    var dist = 1;
    while(tile >= 0 && dist <= range){
      p = this.pieces.at(this.position.x, tile);
      if(!p){
        squares.push([this.position.x, tile]);
      }else{
        if(p.team != this.team){
          squares.push([this.position.x, tile]);
        }
        break;
      }
      tile--;
      dist++;
    }
    return squares;
  };
   Piece.prototype.checkRight = function(range){
    var squares = [];
    var p = null;
    var tile = this.position.x + 1;
    var dist = 1;
    while(tile < 8 && dist <= range){
      p = this.pieces.at(tile, this.position.y);
      if(!p){
        squares.push([tile, this.position.y]);
      }else{
        if(p.team != this.team){
          squares.push([tile, this.position.y]);
        }
        break;
      }
      tile++;
      dist++;
    }
    return squares;
  };
  Piece.prototype.checkLeft = function(range){
    var squares = [];
    var p = null;
    var tile = this.position.x - 1;
    var dist = 1;
    while(tile >= 0 && dist <= range){
      p = this.pieces.at(tile, this.position.y);
      if(!p){
        squares.push([tile, this.position.y]);
      }else{
        if(p.team != this.team){
          squares.push([tile, this.position.y]);
        }
        break;
      }
      tile--;
      dist++;
    }
    return squares;
  };
  Piece.prototype.checkDiagUpLeft = function(range){
    var squares = [];
    var p = null;
    var tilex = this.position.x - 1;
    var tiley = this.position.y + 1;
    var dist = 1;
    while(tilex >= 0 && tiley < 8 && dist <= range){
      p = this.pieces.at(tilex, tiley);
      if(!p){
        squares.push([tilex, tiley]);
      }else{
        if(p.team != this.team){
          squares.push([tilex, tiley]);
        }
        break;
      }
      tilex--;
      tiley++;
      dist++;
    }
    return squares;
  };

  Piece.prototype.checkDiagUpRight = function(range){
    var squares = [];
    var p = null;
    var tilex = this.position.x + 1;
    var tiley = this.position.y + 1;
    var dist = 1;
    while(tilex < 8 && tiley < 8 && dist <= range){
      p = this.pieces.at(tilex, tiley);
      if(!p){
        squares.push([tilex, tiley]);
      }else{
        if(p.team != this.team){
          squares.push([tilex, tiley]);
        }
        break;
      }
      tilex++;
      tiley++;
      dist++;
    }
    return squares;
  };
  Piece.prototype.checkDiagDownRight = function(range){
    var squares = [];
    var p = null;
    var tilex = this.position.x + 1;
    var tiley = this.position.y - 1;
    var dist = 1;
    while(tilex < 8 && tiley >= 0 && dist <= range){
      p = this.pieces.at(tilex, tiley);
      if(!p){
        squares.push([tilex, tiley]);
      }else{
        if(p.team != this.team){
          squares.push([tilex, tiley]);
        }
        break;
      }
      tilex++;
      tiley--;
      dist++;
    }
    return squares;
  };
  Piece.prototype.checkDiagDownLeft = function(range){
    var squares = [];
    var p = null;
    var tilex = this.position.x - 1;
    var tiley = this.position.y - 1;
    var dist = 1;
    while(this.inBounds(tilex, tiley) && dist <= range){
      p = this.pieces.at(tilex, tiley);
      if(!p){
        squares.push([tilex, tiley]);
      }else{
        if(p.team != this.team){
          squares.push([tilex, tiley]);
        }
        break;
      }
      tilex--;
      tiley--;
      dist++;
    }
    return squares;
  };
  Piece.prototype.translate = function(val, flip){
    return (flip) ? val : (val - 7) * -1;
  };
  Piece.prototype.inBounds = function(x, y){
    var xValid = (x >= 0 && x < 8);
    var yValid = (y >= 0 && y < 8);
    return xValid && yValid;
  };
  //Check if a piece can move to a square.
  //Will need to add a provision for testing if we will be in check
  Piece.prototype.canMoveTo = function(x, y){
    //Array.some return true if inside the loop you return true 
    //It then termitates
    //Or else it returns false if we never return true
    return this.validSquares.some(function(s){
      if(s[0] === x && s[1] === y){
        return true;
      }
    });
  };
  //Moves a piece to a space pice will check if it can move there
  //Returns if it moved successfully
  Piece.prototype.moveTo = function(x, y){
    if(this.canMoveTo(x,y)){
      this.position.x = x;
      this.position.y = y;
      return true;
    }else{
      return false;
    }
  };
  Piece.prototype.draw = function(canvas, flip){
    var that = this;
    //Canvas x,y starts at the top left but chess x,y starts at the bottom left
    //So if the board isnt flipped we need to flip the y position of the piece to print in properly
    var y = (flip) ? this.position.y : (this.position.y - 7) * -1;
    var squareSize = $h.constants("squareSize");
    //If the piece is currently selected highlight it and its moves
    //Else just draw it normal
    if(this.isActive()){
      canvas.drawSquare(this.position.x * squareSize, y * squareSize, squareSize - 10, "red");
      this.validSquares.forEach(function(s){
        canvas.drawSquare(s[0] * squareSize, that.translate(s[1], flip) * squareSize, squareSize, "rgba(46, 96, 197, 0.7)");
      });
    }else{
      canvas.drawSquare(this.position.x * squareSize, y * squareSize, squareSize - 10, this.color);
    }
  };


  module.exports = Piece;
}());
