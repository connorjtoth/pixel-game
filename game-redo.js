var DefaultConfiguration = {
  
  ACTIVE_COLOR      : draw.colors.SCOOTER,
  INACTIVE_COLOR    : draw.colors.LIGHTTURQUOISE,
  GOAL_COLOR        : draw.colors.LIMA,
  ACTIVE_GOAL_COLOR : draw.colors.MINERGREEN,

  scaling           : 3,
  squareSize        : 15,
  gameSquareSize    : 8,
  numPixels         : 30,
  sizeOfGoal        : new Vector2(2,2)
};

var game;



function Pixel ()
{
  this.location = Vector2.zero();
  this.bearing = Vector2.zero();
  this.speed = 0;
  this.frozen = false;
  this.game = game;
}


function Game (config)
{
  console.log('Game is started!');
  var ACTIVE_COLOR        = config.ACTIVE_COLOR;
  var INACTIVE_COLOR      = config.INACTIVE_COLOR;
  var GOAL_COLOR          = config.GOAL_COLOR;
  var ACTIVE_GOAL_COLOR   = config.ACTIVE_GOAL_COLOR;
  var scaling             = config.scaling;
  var squareSize          = config.squareSize;
  var gameSquareSize      = config.gameSquareSize;
  var numPixels           = config.numPixels;
  var sizeOfGoal          = config.sizeOfGoal;


//var adjSquareSize = scaling * squareSize;
  var adjSquareSize = Math.ceil(canvasSize / gameSquareSize);
  var positionOfGoal = new Vector2(
    generateBoundedInteger(0, gameSquareSize - sizeOfGoal.x),
    generateBoundedInteger(0, gameSquareSize - sizeOfGoal.y) );


  // utilities
  var gridActive = {};
  var pixels     = [];
  var constFlag  = false;

  // create grids
  for (var gameSquareX = 0; gameSquareX < gameSquareSize; gameSquareX++)
  {
    gridActive[gameSquareX] = {};
    for (var gameSquareY = 0; gameSquareY < gameSquareSize; gameSquareY++)
    {
      gridActive[gameSquareX][gameSquareY] = false;
    }
  }

  // create pixels
  for (var pixelIt = 0; pixelIt < numPixels; pixelIt++)
  {
    var p = new Pixel(game);
    p.location =  generateRandomCoords ( 0 , adjSquareSize * gameSquareSize );
    p.bearing = (new Vector2(Math.random()*2-1,Math.random()*2-1)).unit();
    p.speed = 7;
    pixels.push(p);
  }

  // setup click boundings
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
  };


  var drawGrids = function ( )
  {
    for (var gameSquareX = 0; gameSquareX < gameSquareSize; gameSquareX++)
    {
      var newX = (gameSquareX + .5) * adjSquareSize;

      // X,Y bounds are newX,newY +/- squareSize/2
      for (var gameSquareY = 0; gameSquareY < gameSquareSize; gameSquareY++)
      {
        var newY = (gameSquareY + .5) * adjSquareSize;
        var color = INACTIVE_COLOR;
        if (gameSquareX >= positionOfGoal.x && gameSquareX < positionOfGoal.x + sizeOfGoal.x
         && gameSquareY >= positionOfGoal.y && gameSquareY < positionOfGoal.y + sizeOfGoal.y)
        {
          if (gridActive[gameSquareX][gameSquareY])
            color = ACTIVE_GOAL_COLOR;
          else
            color = GOAL_COLOR;
        }
        else if (gridActive[gameSquareX][gameSquareY])
        {
          color = ACTIVE_COLOR;
        }
        draw.square(newX, newY, adjSquareSize, {x:1,y:0}, color); // currently draws circles
      }
    }
  };



  var loop = function ( iteration )
  {
    draw.clear();
    if (constFlag)
    {
      updateConstants();
    }
    drawGrids();
    for (var pixelIt = 0; pixelIt < numPixels; pixelIt++)
    {
      pixels[pixelIt].propogate();
      pixels[pixelIt].draw();
    }
  };


  this.start = function ( )
  {
    drawGrids();
    this.interval = setInterval(loop, 30);
  };


  Pixel.prototype.propogate = function(distleft)
  {
    if ( distleft == undefined ) {
      distleft = this.speed;
    }

    if (!this.frozen) {
      var currentBlockX = Math.floor(this.location.x/adjSquareSize);
      var currentBlockY = Math.floor(this.location.y/adjSquareSize);
      var nextBlockX = (this.bearing.x > 0) ? currentBlockX + 1 : currentBlockX;
      var nextBlockY = (this.bearing.y > 0) ? currentBlockY + 1 : currentBlockY;
      var nextIntersection;

      var willReflectX = false; // else will reflectY

      var tx = (nextBlockX*adjSquareSize-this.location.x)/this.bearing.x+.00001;
      var ty = (nextBlockY*adjSquareSize-this.location.y)/this.bearing.y+.00001;
      var distToTravel = Math.min(tx, ty);
      if (tx < ty) {
        willReflectX = true;
      }
      nextIntersection = Vector2.from(this.location).add(Vector2.from(this.bearing).unit().times(distToTravel));

      distToTravel = Math.min(distToTravel, distleft);

      //draw.circleV2(nextIntersection, scaling, draw.colors.SHUTTLEGRAY);

      this.location.add(Vector2.from(this.bearing).times(distToTravel));

      var newCurrentBlockX = Math.floor(this.location.x/adjSquareSize);
      var newCurrentBlockY = Math.floor(this.location.y/adjSquareSize);

      if (newCurrentBlockY < 0 || newCurrentBlockY > gameSquareSize - 1) {
        this.bearing.y = -this.bearing.y;
      }
      else if (newCurrentBlockX < 0 || newCurrentBlockX > gameSquareSize - 1) {
        this.bearing.x = -this.bearing.x;
      }
      else if ( gridActive[newCurrentBlockX][newCurrentBlockY] ) {
        if (willReflectX) {
          this.bearing.x = -this.bearing.x;
        }
        else { // reflectY
          this.bearing.y = -this.bearing.y;
        }
      }

      distleft -= distToTravel;
      if (!approx(distleft, 0, .001)) {
        this.propogate(distleft);
      }
    }
  };

  Pixel.prototype.draw = function ( )
  {
    draw.circleV2(this.location, scaling, draw.colors.BLACK);
  };
}

var constFlag = false;
var game;

document.getElementById('gridSizeRange').oninput = function () {
  document.getElementById('gridSizeDisp').innerHTML = this.value;
  constFlag = true;
}

document.getElementById('scalingRange').oninput = function () {
  document.getElementById('scalingDisp').innerHTML = this.value;
  constFlag = true;
}

document.getElementById('numPixelsRange').oninput = function () {
  document.getElementById('numPixelsDisp').innerHTML = this.value;
  constFlag = true;
}

var outerLoop, outerInterval;

document.getElementById('gridSizeDisp').innerHTML = document.getElementById('gridSizeRange').value;
document.getElementById('scalingDisp').innerHTML = document.getElementById('scalingRange').value;
document.getElementById('numPixelsDisp').innerHTML = document.getElementById('numPixelsRange').value;


outerLoop = function ( )
{
  if (constFlag) {
    clearInterval(game.interval);
    delete game;
    constFlag = false;
    
    // show regenerating message
    clearInterval(outerInterval);
    var debounce;
    debounce = setInterval(function ( ) {
      if (constFlag) {
        constFlag = false;
      }
      else {
        clearInterval(debounce);
        // get on with it
        DefaultConfiguration.gameSquareSize = document.getElementById('gridSizeRange').value;
        DefaultConfiguration.scaling = document.getElementById('scalingRange').value;
        DefaultConfiguration.numPixels = document.getElementById('numPixelsRange').value;
        game = new Game(DefaultConfiguration);
        game.start();
        outerInterval = setInterval(outerLoop, 1000);
      }
    }, 499);
  }
};

game = new Game(DefaultConfiguration);
game.start();
outerInterval = setInterval(outerLoop, 1000);
