(function(){
  "use strict";
  var count = 0;
  var $h = require("../lib/headOn.js");
  var defaults = {
    "white": "white",
    "black": "black"
  };
  function Piece(team, x, y, pieces, color){
    this.team = team;
    this.color = color || pieces.getTeamColor(team);
    this.position = $h.Vector(x,y);
    this._active = false;
    this.pieces = pieces;
    this.validSquares = [];
    this._alive = true;
    this.takenBy = null;
    this.attacksOrtho = false;
    this.attacksDiag = false;
    this.attacksKnight = false;
    this.attacksPawn = false;
    count++;
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
  Piece.prototype.checkUp = function(range, squares){
    var p = null;
    var tile = this.position.y + 1;
    var dist = 1;
    var king = this.pieces.getKing(this.team);
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
    return p;
  };
  //In: range out: squares
  //Returns the piece hit, if there is one
  Piece.prototype.checkDown = function(range, squares, check){
    var p = null;
    var tile = this.position.y - 1;
    var dist = 1;
    var king = this.pieces.getKing(this.team);
    var underAttack;
    console.log("here", check)
    while(tile >= 0 && dist <= range){
      p = this.pieces.at(this.position.x, tile);
      if(!p){
        if(!check){
          underAttack = king.underAttack([this.position.x, this.position.y], [this.position.x, tile]);
        }
        if(!underAttack){
          squares.push([this.position.x, tile]);
        }else{
          break;
        }
        

      }else{
        if(p.team != this.team){
          squares.push([this.position.x, tile]);
        }
        break;
      }
      tile--;
      dist++;
    }
    return p;
  };
  
  Piece.prototype.checkRight = function(range, squares, check){
    var p = null;
    var tile = this.position.x + 1;
    var dist = 1;
    var king = this.pieces.getKing(this.team);
    var underAttack;
    while(tile < 8 && dist <= range){
      p = this.pieces.at(tile, this.position.y);
      if(!p){
        if(check){
          underAttack = king.underAttack([this.position.x, this.position.y], [tile, this.position.y]);
        }
        if(!underAttack){
          squares.push([tile, this.position.y]);
        }else{
          break;
        }
      }else{
        if(p.team != this.team){
          squares.push([tile, this.position.y]);
        }
        break;
      }
      tile++;
      dist++;
    }
    return p;
  };
  Piece.prototype.checkLeft = function(range, squares){
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
    return p;
  };
  Piece.prototype.checkDiagUpLeft = function(range, squares, check){
    var p = null;
    var tilex = this.position.x - 1;
    var tiley = this.position.y + 1;
    var dist = 1;
    if(check){
      printBoard();
    }
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
    return p;
  };

  Piece.prototype.checkDiagUpRight = function(range, squares){
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
    return p;
  };
  Piece.prototype.checkDiagDownRight = function(range, squares){
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
    return p;
  };
  Piece.prototype.checkDiagDownLeft = function(range, squares){
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
    return p;
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
  Piece.prototype.taken = function(piece){
    this._alive = false;
    this.takenBy = piece;
  };
  
  Piece.prototype.draw = function(canvas, flip){
    //If we are a taken piece dont draw us
    //Will probably will set to have it draw to the side of the screen
    if(!this._alive) return;
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
      if(this.image){
        canvas.drawImage(this.image, this.position.x * squareSize, y * squareSize);
      }else{
        canvas.drawSquare(this.position.x * squareSize, y * squareSize, squareSize - 10, this.color);
      }
      
    }
  };


  module.exports = Piece;
}());
