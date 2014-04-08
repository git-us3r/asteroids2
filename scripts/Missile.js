
// Missile : Inert
var Missile = (function(){


	var that = {};

	function create(_image, _width, _height, _center, _rotation, _rotationRate, _speed, _direction, _visible){

		var	missile = Inert.create(_image, _width, _height, _center, _rotation, _rotationRate, _speed, _direction, _visible);

		
		missile.update = function (_elapsedTime, _canvasDim){

			missile.rotation += missile.rotateRate;

			missile.center = Vector2d.add(missile.center, Vector2d.scale((_elapsedTime * missile.speed), missile.direction));
			
			if(missile.IsOutOfBounds(_canvasDim)){

				missile.visible = false;
			}

		}
		

		return missile;

	}

	that.create = create;
	return that;


}());