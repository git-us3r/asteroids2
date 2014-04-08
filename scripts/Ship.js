/////////////////
//
// Ship : EXTENDS Inert : REQUIERES Vector2d.js
//
//
///// INTERFACE
//
// The Ship class exposses a constructor, control functions (used by keyboard and), and update:
//
//	public Ship ( _image, _width, _height, _center, _rotation,  _rotationRate, _speed, _direction, _visible, _maxThrustRate)
//
//	void rotateRight(elapsedTime, code)
//
//	void rotateLeft(elapsedTime, code)
//
//	void thrustAction(elapsedTime, code)
//
//	void update(elapsedTime, canvasDim)
//
///////////////////////////////////////////////////



var Ship = function( _image, _width, _height, _center, _rotation,  _rotationRate, _speed, _direction, _visible, _maxThrustRate){
	
	var that = Inert.create(_image, _width, _height, _center, _rotation),
		inertiaVector = {x: 0, y: 0},			// points in the direction of motion. Updated with motion.
		thrustVector = {x: 0, y: 0},
		accelerationVector = {x: 0, y: 0},
		thrustRate = 0,
		speed = _speed,
		maxAcceleration = 350,
		minAcceleration = 1.6;

	that.direction = _direction;
	that.visible = _visible;						// false isn't true	
	that.rotationRate = _rotationRate;	
	that.maxThrustRate = _maxThrustRate;
	that.firingRate = 3; 							// burst ;)



	function truRotation(){

		return that.rotation - Math.PI/2;

	}


	function getThrustRate(){

		return that.thrustRate;
	}


	function setDirectionVector(){			// Unit vector

		directionVector = Vector2d.vectorFromAngle(truRotation());

	}


	

	function setThrustVector(){

		thrustVector = Vector2d.scale( Math.abs(thrustRate), directionVector);

	}



	

	function setAccelerationVector(){

		accelerationVector = Vector2d.add(inertiaVector, thrustVector);
		
		// Cap acceleration to smooth game play (not too fast please)
		if (Vector2d.magnitude(accelerationVector) > maxAcceleration){

			accelerationVector = Vector2d.scale(maxAcceleration, Vector2d.getDirection(accelerationVector));
		}
		
	}




	function move(timeElapsed, canvasDim){


		// change in velocity ... fix
		var velocity = Vector2d.scale(timeElapsed, accelerationVector);

		//that.speed = Math.sqrt(Math.pow(dx,2 ) + Math.pow(dy, 2));
		speed = Vector2d.magnitude(velocity);

		
		// move
		that.center = Vector2d.add(that.center, velocity);


		// Wrapping
		/*
		(function wrapAroundCanvas(){

			// Horizontal Wrap
			if(that.center.x > (canvasDim.x + that.width)) {

			that.center.x = 0;

			}
			else if(that.center.x < (-that.width)) {

				that.center.x = canvasDim.x;

			}


			// Vertical Wrap
			if(that.center.y > (canvasDim.y + that.height)) {

				that.center.y = 0;

			}
			else if(that.center.y < (-that.width)) {

				that.center.y = canvasDim.y;

			}

		}());
		*/
		if (that.IsOutOfBounds(canvasDim)){

			that.Wrap(canvasDim);
		}




		// Now, the iniertia vector points in the direction of current motion.
		inertiaVector = accelerationVector;
	}



	////
	// KEYBOARD OBJECT INTERFACE
	///

	that.rotateRight = function(elapsedTime, code) {
			
			that.rotation += that.rotationRate * elapsedTime;
	};



		
	that.rotateLeft = function (elapsedTime, code) {

			that.rotation -= that.rotationRate * elapsedTime;

	};





	function thrustAction(elapsedTime, code){

		if(code !== -1){

			thrustRate = that.maxThrustRate;

		}else {
			thrustRate = 0;
			// friction ?? 
		}
	}

	// Hackitty hack
	that.thrustAction = thrustAction;



	function update(elapsedTime, canvasDim){

		//set vectors
		setDirectionVector();
		setThrustVector();
		setAccelerationVector();
		move(elapsedTime, canvasDim);
		that.direction = directionVector;
	}
	that.update = update;


	return that;
};




