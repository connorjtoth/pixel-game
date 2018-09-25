
/* generateBoundedInteger
   returns an integer between min and max (inclusive)
   Preconditions: min <= max
*/
function generateBoundedInteger(min, max)
{
  if (min > max)
  {
    throw 'min must be less than max';
  }

	var range = max - min + 1;
	var value = Math.floor(Math.random() * range);
	value += min;
	return value;
}


function generateRandomGraphCoords ( )
{
	var x = generateBoundedInteger(0, GRID_NUMBER);
	var y = generateBoundedInteger(0, GRID_NUMBER);
	return new Vector2(x, y);
}


function generateRandomCoords (min, max)
{
	var x = generateBoundedInteger(min, max);
	var y = generateBoundedInteger(min, max);
	return new Vector2(x, y);
}

function floorV2( v2 )
{
  return new Vector2(Math.floor(v2.x), Math.floor(v2.y));
}

function diff(x1, x2)
{
	return Math.abs(x1 - x2);
}

function dist(p1, p2)
{
	return Math.sqrt(Math.pow(horizontalDist(p1, p2), 2) + Math.pow(verticalDist(p1, p2), 2));
}

function verticalDist(p1, p2)
{
	return Math.abs(p1.y - p2.y);
}

function horizontalDist(p1, p2)
{
	return Math.abs(p1.x - p2.x);
}

function approx(n, m, error)
{
	if (error == undefined)
		error = 0;
	return (Math.abs(n-m) <= error);
}

/* between
   returns true if a <= c <= b or b <= c <= a
*/
function between(a, b, c)
{
  if (a <= b)
  {
    return (a <= c) && (c <= b);
  }
  else
  {
    return (b <= c) && (c <= a);
  }
}