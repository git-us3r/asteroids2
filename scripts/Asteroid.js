//////////////////////////////////////////////////////////////////////////////////////
//
//	Asteroid : EXTENDS Inert : REQUIRES Vector2d.js
//
/////////////////
//
//	The Asteroid class represent a simple asteroid.
// 	Floats around the canvas, with predefined speed, rotation, etc.
//	Wraps around canvas.
//
////	INTERFACE
//
//	The Asteroid class exposes a single function:
//
//	public AsteroidObject  create(_image, _width, _height, _center, _rotation, _rotationRate, _speed, _direction, _visible)
//
//
///// The return value of create is an Asteroid object, which exposes the following interface:
//
///////// public void update(elapsedTime, canvasDim)
//
//////////////////////////////////////////////////////////////////////////////////////


var Asteroid = (function(){

	var that = {},
		uniqueId = 0;

	////
	// FUNCTIONS
	///////
	function create(_image, _width, _height, _center, _rotation, _rotationRate, _speed, _direction, _visible){

		var ast = Inert.create(_image, _width, _height, _center, _rotation, _rotationRate, _speed, _direction, _visible);

		ast.id = uniqueId;
		uniqueId++;

		ast.direction = _direction;								// vector
		ast.motionVector = {x:0, y:0};
		ast.speed = _speed;										// used to control motion
		ast.rotateRate = _rotationRate;							// worked in the past ...	.341											
		ast.lifespan = null;
		ast.age = null;
		ast.visible = _visible;
		ast.rotation = _rotation;



		function move(elapsedTime, canvasDim){

			ast.center = Vector2d.add(ast.center, Vector2d.scale((elapsedTime * ast.speed), ast.direction));
			if(ast.IsOutOfBounds(canvasDim)){

				ast.Wrap(canvasDim);
			}

		}


		ast.update = function(elapsedTime, canvasDim){

			ast.rotation += ast.rotateRate;
			move(elapsedTime, canvasDim);

		}

		return ast;
		
	}


	// Expose the create function only .. for now
	return {create : create};
	
}());