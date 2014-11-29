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
    getTeamColor: function(team){
      switch(team){
        case TEAMS.white:
          return this.teamColor.white;
        case TEAMS.black:
          return this.teamColor.black;
      }
    },
    piecesTaken: [],
    board: [],
    boardBackup: [],

    _kings:{},
    init: function(){
      //represent the board as a 2d array
      this.board = [];
      //Pieces that have been taken and are no longer in play
      this.piecesTaken = [];
      //set up the board propper we can put stuff in it.
      for(var i = 0; i<8; i++){
        for(var j = 0; j<8; j++){
          this.board[i] = [false, false, false, false, false, false, false, false];
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
      //this._initPawns();

    },
    //Switches the pieces to run checks on an intermediate board instead of the real once
    useIntermediateBoard: function(startPos, endPos){
      var piece;
      
      this.boardBackup = this.board.map(function(arr){
        return arr.slice(0);
      });
      //Assert a piece is here
      piece = this.at(startPos[0], startPos[1]);
      assert(piece, "No piece to move for the intermediate board representation");
      this.board[startPos[1]][startPos[0]] = false;
      this.board[endPos[1]][endPos[0]] = piece;
      this.intermediatePiecePos = piece.position.copy();
      this.intermediatePiece = piece;
      piece.x = endPos[0];
      piece.y = endPos[1];
    },
    
    //Switches to use the actual board
    useActualBoard: function(){
      this.board = this.boardBackup.map(function(arr){
        return arr.slice(0);
      });
      this.intermediatePiece.position = this.intermediatePiecePos.copy();
    },
    print: function(){
      console.table(this.board);
    },
    //Gets the king for a specific team
    getKing: function(team){
      switch(team){
        case TEAMS.white:
          return this._kings.white;
        case TEAMS.black:
          return this._kings.black;
        default:
          assert(false, "team does not exist");
      }
    },
    //Moves a passed in piece to the square passed to it
    //Updates its board representation
    move: function(piece, x, y){
      var oldx = piece.position.x;
      var oldy = piece.position.y;
      var pieceAtMovementSpace;
      if(piece.moveTo(x,y)){
        //Check if we are taking another piece
        pieceAtMovementSpace = this.at(x, y);
        if(pieceAtMovementSpace){
          pieceAtMovementSpace.taken(piece);
          this.piecesTaken.push(pieceAtMovementSpace);
        }
        this.board[y][x] = piece;
        this.board[oldy][oldx] = false;
        return true;
      }else{
        return false;
      }
    },
    //returns the piece if there is a piece there otherwise null
    at: function(x, y){
      //if it is outside the range [0,7] in either x or y
      //return null as in nothing is there.
      if(x > 7 || x < 0 || y > 7 || y < 0){
        return false;
      }
      return this.board[y][x] || false;
    },
    copyBoard: function(){
      return this.board.slice(0);
    },
    //Draw the pieces to the board
    //gets the current canvas to draw to and whether or not the board is flipped
    draw: function(canvas, flip){
      this._pieces.forEach(function(p){
        p.draw(canvas, flip);
      });
    },
    flipPos: function(pos){
      return (pos - 7) * -1;
    },
    _initQueens: function(){
      console.log(TEAMS);
      var whiteQueen = new Queen(TEAMS.white, 3, 0, this);
      var blackQueen = new Queen(TEAMS.black, 3, 7, this);
      this._pieces.push(whiteQueen, blackQueen);
      this.board[0][3] = whiteQueen;
      this.board[7][3] = blackQueen;
    },
    _initKings: function(){
      var whiteKing = new King(TEAMS.white, 4, 0, this);
      var blackKing = new King(TEAMS.black, 4, 7, this);
      //Store the kings so pieces can use them later to see if king is in check.
      this._kings.white = whiteKing;
      this._kings.black = blackKing;
      this._pieces.push(whiteKing, blackKing);
      this.board[0][4] = whiteKing;
      this.board[7][4] = blackKing;
    },
    _initBishops: function(){
      var b;
      var x1 = 2;
      var x2 = 5;
      var y = 0;
      var color;
      for(var i=0; i<2; i++){
        color = (i === 0) ? TEAMS.white : TEAMS.black;
        b = new Bishop(color, x1, y, this);
        this._pieces.push(b);
        this.board[y][x1] = b;
        b = new Bishop(color, x2, y, this);
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
        color = (i === 0) ? TEAMS.white : TEAMS.black;
        b = new Knight(color, x1, y, this);
        this._pieces.push(b);
        this.board[y][x1] = b;
        b = new Knight(color, x2, y, this);
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
        color = (i === 0) ? TEAMS.white : TEAMS.black;
        b = new Rook(color, x1, y, this);
        this._pieces.push(b);
        this.board[y][x1] = b;
        b = new Rook(color, x2, y, this);
        this._pieces.push(b);
        this.board[y][x2] = b;
        y = 7;
      }
    },
    _initPawns: function(){
      var row = 1;
      var team = TEAMS.white;
      var p;
      for(var i=0; i<2; i++){
        for(var j=0; j<8; j++){
          p = new Pawn(team, j, row, this);
          this._pieces.push(p);
          this.board[row][j] = p;
        }
        row = 6;
        team = TEAMS.black;
      }
    }
  };
}());