/*
  Author: Connor J. Toth
  File: canvas.js
  Date: May 24, 2017
  Description: Simple functions to make drawing on the canvas easier
*/

function Draw ( canvas )
{
  // canvas is the canvas object in the HTML page that we will be drawing on
  this.canvas = canvas;

  // the context makes it so we can perform operations on the canvas
  this.context = canvas.getContext('2d');

  // obtain the origin of the canvas (useful for centering operations)
  this.center = new Vector2(canvas.width, canvas.height).divideBy(2);


  // Missouri S&T's branding pallete of colors
  this.colors = {
    LIMA:           '#78be20',
    APPLE:          '#509e2f',
    MINERGREEN:     '#007a33',
    CANDLELIGHT:    '#fdda24',
    ORIENT:         '#005f83',
    PESTO:          '#7d622e',
    TANGO:          '#e87722',
    LIGHTTURQUOISE: '#b1e4e3',
    SCOOTER:        '#2dccd3',
    CYPRUS:         '#003b49',
    SHUTTLEGRAY:    '#63666a',
    GOLD:           '#daaa00',
    SILVER:         '#dce3e4',
    BLACK:          '#000000',
    WHITE:          '#ffffff'
  };

  this.defaults = {
    circleFill: this.colors.CYPRUS,
    textFill: this.colors.WHITE,
    rectFill: this.colors.TANGO,
    connectorFill: this.colors.SHUTTLEGRAY,

    connectorWidth: 1,

    font: 'Arial',
    fontSize: '20px',
    subscriptSize: '10px',
    boxHeight: 30,

    bgColor: this.colors.WHITE,

  }

  this.margin = 10; // min pixels between objects

}

Draw.prototype.clear = function ( )
{
  this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
}

// draw a circle on the canvas
// (x, y): center of the circle
// r:      circle radius
// config has extra properties
Draw.prototype.circle = function( x, y, r, color )
{

  var context = this.context;

  if (color == undefined)
    color = this.defaults.circleFill;

  context.beginPath();
  context.arc(x, y, r, 0, 2 * Math.PI, false);
  context.fillStyle = color;
  context.fill();
  context.closePath();

  return true;
}

// draw a line to connect two points
// (startx,starty): starting point on canvas
// (endx, endy):    ending point on canvas
Draw.prototype.cxn = function ( startx, starty, endx, endy, width, color )
{

  var context = this.context;

  if ( color == undefined)
    color = this.defaults.connectorFill;

  if ( width == undefined)
    width = this.defaults.connectorWidth;


  // ensure we are drawing under objects not over them
  // for cleanliness
  //context.globalCompositeOperation = 'destination-over';

  //draw the line
  context.beginPath();
  context.lineWidth = width;
  context.strokeStyle = color;
  context.moveTo(startx, starty);
  context.lineTo(endx, endy);
  context.stroke();
  context.closePath();

  //return the globalCompositeOperation to default
  //context.globalCompositeOperation = 'source-over';
}


// draw text on the canvas with or without a background
// pre: subscript preceding the normal text
// mid: normal text centered betwee pre and post
// post: subscript succeeding the normal text
// (x,y): the bounding center of the text (not necessarily where mid is placed)
// background: the color of the box drawn behind the text
// text_color: the color of the text (if not default text color)
Draw.prototype.text = function (mid, x, y, bgColor, textColor)
{
  console.log(mid, x, y, bgColor, textColor);

  var context = this.context;

  // calculate the pixel width of the normal part of the text
  context.font = this.defaults.fontSize + ' ' + this.defaults.font;
  var midwidth = context.measureText(mid).width;

  console.log(midwidth);
  console.log(this.canvas.width);
  // find the total width of the text
  var totalwidth = midwidth;

  // find bounds of box in which text will reside on the canvas
  var leftbound = x - totalwidth/2;
  var rightbound = x + totalwidth/2;

  // add a box around and behind the text or clear any 
  // lines to/from it in its box
  if (bgColor == undefined)
    bgColor = this.defaults.bgColor;

  context.beginPath();
  context.fillStyle = bgColor;
  context.fillRect(leftbound-this.margin, y - this.defaults.boxHeight / 2 - this.margin, totalwidth + 2 * this.margin, this.defaults.boxHeight + 2 * this.margin)
  context.closePath();

  // draw the subscript part of the text
  context.beginPath();

  if (textColor == undefined)
    textColor == this.defaults.textFill;

  // draw the normal part of the text
  context.font = this.defaults.fontSize + ' ' + this.defaults.font;
  context.textAlign = 'left';
  context.textBaseline ='middle';
  context.fillText(mid, leftbound, y);
  context.closePath();
}

Draw.prototype.rect = function (x, y, width, height, direction, color)
{
  var context = this.context;


  if (color == undefined)
    color = this.defaults.rectColor;

	context.lineWidth = 0;
	context.beginPath();
	context.lineJoin = 'bevel';
	var locs = [];
	var v2 = new Vector2(x,y);

	var dir = Vector2.from(direction).unit().times(width/2);
	var dir2 = dir.perpendicular().unit().times(height/2);


	locs.push(Vector2.from(v2.add(dir).add(dir2)));
	locs.push(Vector2.from(v2.minus(dir).minus(dir)));
	locs.push(Vector2.from(v2.minus(dir2).minus(dir2)));
	locs.push(Vector2.from(v2.add(dir).add(dir)));
	locs.push(Vector2.from(v2.add(dir2).add(dir2)))


	context.moveTo(locs[0].x, locs[0].y);
	for (loc of locs)
	{
		context.lineTo(loc.x, loc.y);
	}
  context.fillStyle = color;
	context.fill();

  context.closePath();
}

Draw.prototype.square = function ( x, y, size, direction, color)
{
  return this.rect(x, y, size, size, direction, color);
}

Draw.prototype.rectV2 = function (pos, size, direction, color)
{
  return this.rect(pos.x, pos.y, size.x, size.y, direction, color);
}

Draw.prototype.cxnV2 = function (v1, v2, color)
{
  return this.cxn(v1.x, v1.y, v2.x, v2.y, color);
}

Draw.prototype.circleV2 = function (center, radius, color)
{
  return this.circle(center.x, center.y, radius, color);
}










/*

function getImageDataAbout(x, y, r)
{
  var redrawBounds = {xl: x - r, xr: x + r, yt: y - r, yb: y + r};
  for (val of ['xl','yt'])
  {
    redrawBounds[val] = Math.floor(redrawBounds[val]);
    if (redrawBounds[val] < BOUNDING_BOX[val])
      redrawBounds[val] = BOUNDING_BOX[val];
  }
  for (val of ['xr','yb'])
  {
    redrawBounds[val] = Math.ceil(redrawBounds[val]);
    if (redrawBounds[val] > BOUNDING_BOX[val])
      redrawBounds[val] = BOUNDING_BOX[val];
  }
  redrawBounds.xr -= redrawBounds.xl;// turn into a width
  redrawBounds.yb -= redrawBounds.yt;// turn into a height

  
  var lastImageData = cxt.getImageData(redrawBounds.xl, redrawBounds.yt, redrawBounds.xr, redrawBounds.yb);
  var lastBounds = redrawBounds;

  return {data: lastImageData, bounds: lastBounds};
}
*/

var canvas = document.getElementById('main_canvas');

var canvasSize = Math.min(window.innerWidth, window.innerHeight) * .7;
canvas.width = canvas.height = canvasSize;
console.log(canvas.width, canvas.height);
document.getElementById('wrapper').width = canvasSize;
var draw = new Draw(canvas);
var MARGIN = 10;

