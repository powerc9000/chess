(function(){
  "use strict";
  var $h = require("../lib/headOn.js");
  var gameRunner = {
    init: function(pieces){
      this.pieces = pieces;
      $h.events.listen("squareclick", this.handleSquareClick.bind(this));
    },
    //See if the the square click event clicks on a piece.
    handleSquareClick: function(x, y){
      var piece = this.pieces.at(x,y);
      //If there is a pice at that square
      if(piece){
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
        this.pieces.move(this.currentActive, x, y);
        this.currentActive.setInactive();
        this.currentActive = null;
      }
    }
  };

  module.exports = gameRunner;
}());
