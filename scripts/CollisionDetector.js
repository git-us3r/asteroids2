// Uses vector2d.js


// A small tool to detect collisions among
// elements in colliding arrays.
// That is, the elements in one array collide
// with the elements in the other array.
//
// Interface: ntt1 and ntt2 are array-like objects. So, they are objects with at least
// one property, which represents a visual element; e.g., ship, asteroid, etc.
////////
var CollisionDetector = (function(){
	
	var that = {};


	// private subroutine to detect collision between individual elements.
	function doCollide(ntt1, ntt2){

		var distanceFactor = .9,
			minDistance = Math.max(
			 		Math.max(ntt1.width * distanceFactor, ntt1.height * distanceFactor), 
			 		Math.max(ntt2.width * distanceFactor, ntt2.height * distanceFactor)),
			distance = Vector2d.distance(ntt1.center, ntt2.center);

		return (distance <= minDistance);
	}



	// Detects collisions and invokes action upon detection.
	// ntts1 and ntts2 are arrays of colliding elements; i.e.,
	// collisions between ntts1 and ntts2 are not trivial (like asteroid-asteroid collision).
	// 
	//	Interface: ntt element has the following data members: .width, .height, .center
	//////
	that.detectCollisions = function(ntts1, ntts2, action){

		for(var ntt1 in ntts1){

			for(var ntt2 in ntts2){

				if(doCollide(ntts1[ntt1], ntts2[ntt2])){

					action(ntts1[ntt1], ntts2[ntt2]);
				}

			}
		}
	};


	return that;

}());