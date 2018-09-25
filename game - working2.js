var ACTIVE_COLOR = draw.colors.SCOOTER;
var INACTIVE_COLOR = draw.colors.LIGHTTURQUOISE;
var GOAL_COLOR = draw.colors.LIMA;

var gridActive = {};

var scaling = 3;
var squareSize = 15;
var gameSquareSize = 10;
var adjSquareSize = scaling * squareSize;
var numPixels = 50;
var pixels = [];

var sizeOfGoal = new Vector2(2,2);
var positionOfGoal = new Vector2(generateBoundedInteger(0, gameSquareSize-sizeOfGoal.x),generateBoundedInteger(0, gameSquareSize-sizeOfGoal.y));

// create grids
for (var gameSquareX = 0; gameSquareX < gameSquareSize; gameSquareX++)
{
  gridActive[gameSquareX] = {};
  for (var gameSquareY = 0; gameSquareY < gameSquareSize; gameSquareY++)
  {
    gridActive[gameSquareX][gameSquareY] = false;
  }
}


function drawGrids(squareSize, gameSquareSize, scaling)
{
  for (var gameSquareX = 0; gameSquareX < gameSquareSize; gameSquareX++)
  {
    var newX = (gameSquareX+.5) * adjSquareSize;

    // X,Y bounds are newX,newY +/- squareSize/2
    for (var gameSquareY = 0; gameSquareY < gameSquareSize; gameSquareY++)
    {
      var newY = (gameSquareY + .5) * adjSquareSize;
      var color = INACTIVE_COLOR;
      if (gridActive[gameSquareX][gameSquareY])
      {
        color = ACTIVE_COLOR;
      }

      if (gameSquareX >= positionOfGoal.x && gameSquareX < positionOfGoal.x+sizeOfGoal.x
       && gameSquareY >= positionOfGoal.y && gameSquareY < positionOfGoal.y+sizeOfGoal.y)
      {
        color = GOAL_COLOR;
      }
      draw.square(newX, newY, adjSquareSize, {x:1,y:0}, color); // currently draws circles
    }
  }
}


drawGrids(squareSize, gameSquareSize, scaling);



canvas.onclick = function (event)
{
  coords = canvas.getBoundingClientRect();
  var newX = (event.x - coords.x);
  var newY = (event.y - coords.y);
  
  //draw.circle(newX, newY, 5, draw.colors.CANDLELIGHT);
  var detX = Math.floor(newX/adjSquareSize);
  var detY = Math.floor(newY/adjSquareSize);

  // create the circle
  var adjX = (detX + .5) * adjSquareSize;
  var adjY = (detY + .5) * adjSquareSize;

  gridActive[detX][detY] = !gridActive[detX][detY];
  draw.circle(adjX, adjY, adjSquareSize/2, draw.colors.TANGO);


  // TODO: Freeze any pixels that are within the square
  for (var pixelIt = 0; pixelIt < numPixels; pixelIt++)
  {
    var currentBlockX = Math.floor(pixels[pixelIt].location.x/adjSquareSize);
    var currentBlockY = Math.floor(pixels[pixelIt].location.y/adjSquareSize);
    if (detX == currentBlockX && detY == currentBlockY)
    {
      pixels[pixelIt].frozen = gridActive[detX][detY];
    }
  }
}


function Pixel ( )
{
  this.location = Vector2.zero();
  this.bearing = Vector2.zero();
  this.speed = 0;
  this.frozen = false;
}

Pixel.prototype.propogate = function(distleft)
{
  if (distleft == undefined)
  {
    distleft = this.speed;
  }

  if (!this.frozen)
  {
    var currentBlockX = Math.floor(this.location.x/adjSquareSize);
    var currentBlockY = Math.floor(this.location.y/adjSquareSize);
    var nextBlockX = (this.bearing.x > 0) ? currentBlockX + 1 : currentBlockX;
    var nextBlockY = (this.bearing.y > 0) ? currentBlockY + 1 : currentBlockY;
    var nextIntersection;

    var willReflectX = false, willReflectY = false;

    var tx = (nextBlockX*adjSquareSize-this.location.x)/this.bearing.x+.00001;
    var ty = (nextBlockY*adjSquareSize-this.location.y)/this.bearing.y+.00001;
    var distToTravel;
    if (tx < ty)
    {
      nextIntersection = Vector2.from(this.location).add(Vector2.from(this.bearing).unit().times(tx));
      willReflectX = true;
      distToTravel = tx;
    }
    else
    {
      nextIntersection = Vector2.from(this.location).add(Vector2.from(this.bearing).unit().times(ty));
      willReflectY = true;
      distToTravel = ty;
    }

    distToTravel = Math.min(distToTravel, distleft);

    //draw.circleV2(nextIntersection, scaling, draw.colors.SHUTTLEGRAY);

    this.location.add(Vector2.from(this.bearing).times(distToTravel));

    var newCurrentBlockX = Math.floor(this.location.x/adjSquareSize);
    var newCurrentBlockY = Math.floor(this.location.y/adjSquareSize);

    if (newCurrentBlockY < 0 || newCurrentBlockY > gameSquareSize - 1)
    {
      this.bearing.y = -this.bearing.y;
    }
    else if (newCurrentBlockX < 0 || newCurrentBlockX > gameSquareSize - 1)
    {
      this.bearing.x = -this.bearing.x;
    }
    else if ( gridActive[newCurrentBlockX][newCurrentBlockY] )
    {
      if (willReflectX)
      {
        this.bearing.x = -this.bearing.x;
      }
      if (willReflectY)
      {
        this.bearing.y = -this.bearing.y;
      }

    }

    distleft -= distToTravel;
    if (!approx(distleft, 0, .001))
    {
      this.propogate(distleft);
    }
  }
};

Pixel.prototype.draw = function ( )
{
  draw.circleV2(this.location, scaling, draw.colors.BLACK);
};


for (var pixelIt = 0; pixelIt < numPixels; pixelIt++)
{
  var p = new Pixel();
  p.location =  generateRandomCoords ( 0 , adjSquareSize * gameSquareSize );
  p.bearing = (new Vector2(Math.random()*2-1,Math.random()*2-1)).unit();
  p.speed = 15;
  pixels.push(p);
}

function gameLoop ( iteration )
{
  draw.clear();
  drawGrids(squareSize, gameSquareSize, scaling);
  for (var pixelIt = 0; pixelIt < numPixels; pixelIt++)
  {
    pixels[pixelIt].propogate();
    pixels[pixelIt].draw();
  }
}

setInterval(gameLoop, 100);