
////////////////////////////////////////////////////////////////////////////////////////
//
// Inert.js
//
//
// Base Class Inert : Extends Spec.js
//	
// Represents objects that move without user-control,
// e.g., asteroids and missiles.
//
/////////////////////////////////////////////////////////////////////////////////
//
// INTERFACE
//
// Inert exposes one function:
//
// public InertElement create(_image, _width, _height, _center, _rotation, _rotationRate, _speed, _direction, _visible)
//
/////// The object returned from create (the inert element) exposes the following interface:
//
//////////////// boolean IsOutOfBounds(canvasDim)
//
//////////////// void Wrap (canvasDim)
//
//////////////// void update(elapsedTime, canvasDim)
//
//////////////////////////////////////////////////////////////////////////////////////////////

var Inert = (function(){

	var that = {},
		uniqueId = 0;

	////
	// FUNCTIONS
	///////

	function create(_image, _width, _height, _center, _rotation, _rotationRate, _speed, _direction, _visible){

		var spec = Spec.create(_image, _width, _height, _center, _rotation);

		spec.id = uniqueId;
		uniqueId++;

		spec.direction = _direction;
		spec.motionVector = {x:0, y:0};
		spec.speed = _speed;		
		spec.rotateRate = _rotationRate;
		spec.lifespan = null;
		spec.age = null;
		spec.visible = _visible;



		function IsOutOfBounds(canvasDim){

			// check bounds
			// This clusterf8*4 evaluates to a boolean
			// that is true if the object is out of bounds
			return (
						spec.center.x > (canvasDim.x + spec.width) ||
						(spec.center.x < (-spec.width)) ||
						(spec.center.y > (canvasDim.y + spec.height)) ||
						(spec.center.y < (-spec.width))
					);
		}
		spec.IsOutOfBounds = IsOutOfBounds;




		function Wrap (canvasDim){

			// check for bounds
			if(spec.center.x > (canvasDim.x + spec.width)) {

				spec.center.x = 0;

			}
			else if(spec.center.x < (-spec.width)) {

				spec.center.x = canvasDim.x;

			}


			if(spec.center.y > (canvasDim.y + spec.height)) {

				spec.center.y = 0;

			}
			else if(spec.center.y < (-spec.width)) {

				spec.center.y = canvasDim.y;

			}

		}
		
		// Expose adjustBounds
		spec.Wrap = Wrap;



		function update(elapsedTime, canvasDim){

			// Hardcoded works fine for now
			spec.rotation += spec.rotateRate;
			spec.center = Vector2d.add(spec.center, Vector2d.scale((elapsedTime * spec.speed), spec.direction));

			if(spec.IsOutOfBounds(canvasDim))
			{
				spec.Wrap(canvasDim);
			}

		}

		// Expose update
		spec.update  = update;



		return spec;
		
	}


	// Expose the create function only .. for now
	return {create : create};

}());