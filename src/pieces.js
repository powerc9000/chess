(function(){
  "use strict";

  var $h = require("../lib/headOn.js");
  var Queen = require("./queen.js");
  var King = require("./king.js");
  var Bishop = require("./bishop.js");
  var Knight = require("./knight.js");
  var Rook = require("./rook.js");
  var Pawn = require("./pawn.js");
  module.exports = {
    //Initializes all the pices to their propper place on the board
    _pieces: [],
    teamColor:{white:"white", black:"black"},
    init: function(){
      //represent the board as a 2d array
      this.board = [];
      //set up the board propper we can put stuff in it.
      for(var i = 0; i<8; i++){
        for(var j = 0; j<8; j++){
          this.board[i] = [];
        }
      }
      //2 Queens
      this._initQueens();
      //2 kings
      this._initKings();
      //4 bishops
      this._initBishops();
      //4 knights
      this._initKnights();
      //4 rooks
      this._initRooks();
      //16 pawns
      this._initPawns();

      $h.events.listen("squareclick", this.checkSquareClick.bind(this));

    },
    checkSquareClick: function(x, y){
      var piece = this.at(x,y);

      if(piece){
        if(this.currentActive){
          this.currentActive.setInactive();
        }
        this.currentActive = piece;
        piece.setActive();
      }
    },
    //returns the piece if there is a piece there otherwise null
    at: function(x, y){
      //if it is outside the range [0,7] in either x or y
      //return null as in nothing is there.
      if(x > 7 || x < 0 || y > 7 || y < 0){
        return null;
      }
      return this.board[y][x] || null;
    },
    //Draw the pieces to the board
    //gets the current canvas to draw to and whether or not the board is flipped
    draw: function(canvas, flip){
      var squareSize = $h.constants("squareSize");
      var that = this;

      this._pieces.forEach(function(p){
        
        p.draw(canvas, flip);
       
        
      });
    },
    flipPos: function(pos){
      return (pos - 7) * -1;
    },
    _initQueens: function(){
      var q1 = new Queen("white", 3, 0);
      var q2 = new Queen("black", 3, 7);
      this._pieces.push(q1,q2);
      this.board[0][3] = q1;
      this.board[7][3] = q2;
    },
    _initKings: function(){
      var k1 = new King("white", 4, 0);
      var k2 = new King("black", 4, 7);
      this._pieces.push(k1, k2);
      this.board[0][4] = k1;
      this.board[7][4] = k2;
    },
    _initBishops: function(){
      var b;
      var x1 = 2;
      var x2 = 5;
      var y = 0;
      var color;
      for(var i=0; i<2; i++){
        color = (i === 0) ? "white" : "black";
        b = new Bishop(color, x1, y);
        this._pieces.push(b);
        this.board[y][x1] = b;
        b = new Bishop(color, x2, y);
        this._pieces.push(b);
        this.board[y][x2] = b;
        y = 7;
      }
    },
    _initKnights: function(){
      var b;
      var x1 = 1;
      var x2 = 6;
      var y = 0;
      var color;
      for(var i=0; i<2; i++){
        color = (i === 0) ? "white" : "black";
        b = new Knight(color, x1, y);
        this._pieces.push(b);
        this.board[y][x1] = b;
        b = new Knight(color, x2, y);
        this._pieces.push(b);
        this.board[y][x2] = b;
        y = 7;
      }
    },
    _initRooks: function(){
      var b;
      var x1 = 0;
      var x2 = 7;
      var y = 0;
      var color;
      for(var i=0; i<2; i++){
        color = (i === 0) ? "white" : "black";
        b = new Rook(color, x1, y);
        this._pieces.push(b);
        this.board[y][x1] = b;
        b = new Rook(color, x2, y);
        this._pieces.push(b);
        this.board[y][x2] = b;
        y = 7;
      }
    },
    _initPawns: function(){
      var row = 1;
      var team = "white";
      var p;
      for(var i=0; i<2; i++){
        for(var j=0; j<8; j++){
          p = new Pawn(team, j, row);
          this._pieces.push(p);
          this.board[row][j] = p;
        }
        row = 6;
        team = "black";
      }
    }
  };
}());