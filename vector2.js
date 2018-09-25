/*
	Author: Connor J. Toth
	File: vector2.js
	Version: 0.06
	Date: May 21, 2017
	Description: This is a Vector2 class for easy 2d calculations
*/

// -----------------------------------------------------------------------------
// ----- Constructors
// -----------------------------------------------------------------------------

// constructor
function Vector2(xval, yval)
{
  // defaults to a zero vector
	if (!xval) xval = 0;
  if (!yval) yval = 0;

	this.x = xval;
	this.y = yval;
}

// .from(v)
// Creates a vector2 from an object that has x,y properties
// Preconditions: v.x and v.y must exist as arithmetically operable types
// Postconditions: returns a vector2 object where x,y properties correspond
//                 to those in the original object
Vector2.from = function ( v )
{
	return new Vector2(v.x, v.y);
}

// .zero()
// Returns a zero vector
// Postconditions: a new zero vector is returned
Vector2.zero = function ( )
{
  return new Vector2(0, 0);
}



// -----------------------------------------------------------------------------
// ----- Arithmetic Operators
// -----------------------------------------------------------------------------

// .add(v)
// Use vector addition to add vector v to a vector
// Postconditions: the vector has changed and is returned
Vector2.prototype.add = function ( v )
{
	this.x += v.x;
	this.y += v.y;
	return this;
}

// .minus(v)
// Use vector subtraction to subtract vector v from a vector
// Postconditions: the vector has changed and is returned
Vector2.prototype.minus = function ( v )
{
	this.x -= v.x;
	this.y -= v.y;
	return this;
}

// .times(v)
// Use scalar multiplication to multiply a vector by scalar s
// Postconditions: the vector has changed and is returned
Vector2.prototype.times = function ( s )
{
	this.x *= s;
	this.y *= s;
	return this;
}

// .divideBy(s)
// Use scalar multiplication to divide a vector by scalar s
// Preconditions: s cannot equal 0
// Postconditions: the vector has changed and is returned
Vector2.prototype.divideBy = function ( s )
{
	if ( s == 0 )
	{
		throw "Cannot divide by 0!";
	}
	else
	{
		this.x /= s;
		this.y /= s;
		return this;
	}
}

// .opposite()
// Changes the vector direction to be opposite of what it is
// Postconditions: the vector has changed and is returned
Vector2.prototype.opposite = function ( )
{
	this.x = -this.x;
	this.y = -this.y;
	return this;
}

// .perpendicular()
// Calculates a vector of equal magnitude in a perpendicular direction
// Postconditions: returns a new vector
Vector2.prototype.perpendicular = function ( )
{
  return new Vector2(-this.y, this.x);
}

// .unit()
// Changes the vector to keep its direction with a magnitude of 1
// Preconditions: the vector cannot be a zero vector
// Postconditions: the vector is changed and is returned
Vector2.prototype.unit = function ( )
{
  if (this.length == 0)
  {
    throw "Cannot find direction of 0 vector!";
  }

  this.divideBy(this.length());
  return this;
}

// .innerProduct(v)
// Calculates the inner (dot) product of the vector and vector v
// Postconditions: returns a scalar value
Vector2.prototype.innerProduct = function ( v )
{
  return this.x * v.x + this.y * v.y;
}

// -----------------------------------------------------------------------------
// ----- Properties
// -----------------------------------------------------------------------------

// .length()
// Calculates the euclidean length of the vector
// Postconditions: returns a scalar value
Vector2.prototype.length = function ( )
{
	return Math.sqrt( Math.pow(this.x, 2) + Math.pow(this.y, 2) );
}

// .direction()
// Calculates the angle in radians the vector points relative to the +X Ray
// Preconditions: the vector cannot be a zero vector
// Postconditions: returns a scalar value
Vector2.prototype.direction = function ( )
{
  if (this.length == 0)
    throw "Cannot find direction of 0 vector!";

	return Math.atan2(this.y, this.x);
}