(function(){
  "use strict";
  var $h = require("../lib/headOn.js");
  var gameRunner = {
    init: function(pieces){
      this.pieces = pieces;
      $h.events.listen("squareclick", this.handleSquareClick.bind(this));
      this.turn = TEAMS.white;
    },
    //See if the the square click event clicks on a piece.
    handleSquareClick: function(x, y){
      var piece = this.pieces.at(x,y);
      //If there is a pice at that square
      //and It's that pieces teams turn
      if(piece && piece.getTeam() === this.turn){
        //Check that currentActive is intialized
        if(this.currentActive){
          //Set whatever is active as inactive 
          this.currentActive.setInactive();
        }
        //Set the new active piece
        this.currentActive = piece;
        //Set is as active
        piece.setActive();
      }else if(this.currentActive){
        //If we moved successfully. It's the next player's turn
        if(this.pieces.move(this.currentActive, x, y)){
          this.nextPlayerTurn();
        }
        //If we off click or it is the next player's turn
        //We dont have an active piece anymore
        this.currentActive.setInactive();
        this.currentActive = null;
      }
    },
    nextPlayerTurn: function(){
      //Remeber to add break statements for your fucking cases
      switch(this.turn){
        case TEAMS.white:
          this.turn = TEAMS.black;
          break;
        case TEAMS.black:
          this.turn = TEAMS.white;
          break;
        default:
          assert(false, "Invalid team");
      }
    }
  };

  module.exports = gameRunner;
}());
