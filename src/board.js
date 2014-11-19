var $h = require("../lib/headOn.js");
module.exports = {
  squareSize:10,
  flipped:false,
  _whiteColor: "white",
  _blackColor: "black",
  flip:function(){
    this.flipped = !this.flipped;
  },
  isFlipped: function(){
    return this.flipped;
  },
  setSquareSize: function(size){
    this.squareSize = size;
  },
  //lets you set the color for white squares
  //default is white
  setWhiteColor: function(color){
    this._whiteColor = color;
  },
  //sets the color for black squares
  //defualt is black
  setBlackColor: function(color){
    this._blackColor = color;
  },
  // Draw a chess board using a supplied canvas
  // Also take into account whether or not the board should be flipped
  draw: function(canvas){
    //whiteOrBlack is the negation of what flipped currently is
    var whiteOrBlack = this.flipped;
    var color;
    //Loop to draw all the squares
    for(var i = 0; i<8; i++){
      for(var j = 0; j<8; j++){
        //if whiteOrBlack is true color is white
        //else color is black
        color = whiteOrBlack ? this._whiteColor : this._blackColor;
        //Place to draw the square is the x,y (j,i) tile number multiplied by the size of tiles
        canvas.drawRect(this.squareSize, this.squareSize, j*this.squareSize, i*this.squareSize, color);
        //alterante color
        whiteOrBlack = !whiteOrBlack;
      }

      //The start of a new row always has the same color as the end of the previous row
      //Flip whiteOrBlack to reflect that
      whiteOrBlack = !whiteOrBlack;
    }
    
    //Draw the boarder for the board
    canvas.drawRect(canvas.width, canvas.height, 0,0, "transparent", {color:"black", width:5});
  },


};