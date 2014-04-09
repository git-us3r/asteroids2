// The EXPD variable exists since loader was executed.

EXPD.Entities = {

	SHIP_FRIENDLY : 'SHIP',
	ASTEROID_LRG : 'ASTEROID_LRG',
	ASTEROID_MED : 'ASTEROID_MED',
	ASTEROID_SML : 'ASTEROID_SML',
	MISSLE_FRIENDLY : 'MISSLE_FRIENDLY',
	MISSLE_ENEMY : 'MISSLE_ENEMY',
	SHIP_ENEMY : 'SHIP_ENEMY'
};


EXPD.Flash = {

	baseFlash : "BASE_FLASH",
	friendlyShipExplosionFlash : "FRIENDLY_EXP_FLASH"

};



// Eventually, all configuration paramters should be moved
// here. Particularly, those concerning the properties of 
// the entities; e.g., asteroid speed, missile speed, missile firing rate, etc.
EXPD.GameParameters = {

	shipIsSafe : true,
	safetyPeriodDurationLimit : 3,
	safetyPeriodCountDown : -99,

	maxLives : 3,
	currentLife : 3,

	firingRate : 5,
	timeSinceLastMissile : 2.998,

	numberOfLargeAsteroids : 5,
	sizeOfLargeAsteroids : 80,
	large2MedRatio : 3,

	numberOfMedAsteroids : 4,
	sizeOfMedAsteroids : 50,
	med2Smallratio : 4,

	sizeOfSmallAsteroids : 20,

	flashUniqueId : 0
};





EXPD.gameOver = function(){

	// TODO

};





EXPD.makeShipSafe = function(){

	// TODO

	EXPD.GameParameters.shipIsSafe = true;
	EXPD.GameParameters.safetyPeriodCountDown = EXPD.GameParameters.safetyPeriodDurationLimit;

	// NOTE: EXPD.update will validate safety period and terminate it when appropriate.

}





EXPD.breakAsteroid = function(_AstType, _location) {

	switch(_AstType){

		case EXPD.Entities.ASTEROID_LRG:

			for(var i = 0; i < EXPD.GameParameters.large2MedRatio; i++) {

				var tempAst = EXPD.setAsteroid(EXPD.Entities.ASTEROID_MED, _location);
				EXPD.asteroids[tempAst.id] = tempAst;
			}

		break;

		case EXPD.Entities.ASTEROID_MED:

			for(var i = 0; i < EXPD.GameParameters.med2Smallratio; i++) {

				var tempAst = EXPD.setAsteroid(EXPD.Entities.ASTEROID_SML, _location);
				EXPD.asteroids[tempAst.id] = tempAst;
			}

			
		break;

		default:
			break;		// Nothing to do if its small.

	}

};





EXPD.EXPDLoop = function(time){


	EXPD.elapsedTime = time - EXPD.lastTimeStamp;
	EXPD.lastTimeStamp = time;

	EXPD.update(EXPD.elapsedTime / 1000, {x: EXPD.canvas.width, y: EXPD.canvas.height}); // cut the lines below ... TODO
	// EXPD.keyboard.update(EXPD.elapsedTime / 1000);
	// EXPD.updateShip(EXPD.elapsedTime / 1000, {x: EXPD.canvas.width, y: EXPD.canvas.height}); // elapsedTime is now in seconds.

	EXPD.graphics.clear();
	EXPD.render(EXPD.context);

	requestAnimationFrame(EXPD.EXPDLoop);

};



EXPD.initialize = function(){

	//EXPD.velements = {};
	EXPD.canvas = document.getElementById('canvas');
	EXPD.context = EXPD.canvas.getContext('2d');
	
	
	(function initializeGraphics(){

		function _clear(){
	
		EXPD.context.save();
		EXPD.context.setTransform(1, 0, 0, 1, 0, 0);
		EXPD.context.clearRect(0, 0, canvas.width, canvas.height);
		EXPD.context.restore();
		}

		function _drawImage(spec) {
			
			EXPD.context.save();
			
			EXPD.context.translate(spec.center.x, spec.center.y);
			EXPD.context.rotate(spec.rotation);
			EXPD.context.translate(-spec.center.x, -spec.center.y);
			
			EXPD.context.drawImage(
				spec.image, 
				spec.center.x - spec.width/2, 
				spec.center.y - spec.height/2,
				spec.width, spec.height);
			
			EXPD.context.restore();
		}



		// Expose a graphics object to the particles.
		EXPD.graphics = {

			clear : _clear,
			drawImage : _drawImage

		};

	}());



	(function initializeKeyboard(){

		var kb = Keyboard(KeyEvent.DOM_VK_E, KeyEvent.DOM_VK_SPACE);		// hacky .. todo: integrate into keyboard.registerCommand
		EXPD.keyboard = kb;

	}());



	// var Ship = function( _image, _width, _height, _center, _rotation, _visible, _maxThrustRate, _rotationRate,)	
	(function initializeShip(){

		EXPD.ship = {};

		var image = EXPD.images['images/ship.png'],
		width = 100,
		height = 100,
		center = {x: 100, y: 100},
		rotation = 0,
		visible = true,
		maxThrustRate = 10,
		rotationRate = 4,
		speed = 0,
		direction = {x: 0, y: 0},
		ship = Ship(image, width, height, center, rotation, rotationRate, speed, direction,  visible, maxThrustRate);
		//_image, _width, _height, _center, _rotation,  _rotationRate, _speed, _direction, _visible, _maxThrustRate

		ship.type = EXPD.Entities.SHIP_FRIENDLY;
		EXPD.ship[0] = ship;
	}());



	EXPD.asteroids = {};


	// Only 4 for now ... args can be used to changed that.
	(function initializeAsteroids(){	

		// Initialize Large Asteroids.
		for (var i = 0; i < EXPD.GameParameters.numberOfLargeAsteroids; i++){

			var ast = EXPD.setAsteroid(EXPD.Entities.ASTEROID_LRG);
			EXPD.asteroids[ast.id] = ast;
		}
	}());



	(function initializeKeyboard(){

		// There needs to be a function to do this with client requests.
		EXPD.keyboard.registerKey(KeyEvent.DOM_VK_E, EXPD.ship[0].thrustAction);
		EXPD.keyboard.registerKey(KeyEvent.DOM_VK_S, EXPD.ship[0].rotateLeft);
		EXPD.keyboard.registerKey(KeyEvent.DOM_VK_F, EXPD.ship[0].rotateRight);
		EXPD.keyboard.registerKey(KeyEvent.DOM_VK_SPACE, EXPD.fireFriendlyMissile);
	}());


	// set up explosions object
	EXPD.explosions = {};

	// set up friendly missles object
	EXPD.friendlyMissles = {};

	// set up flashes
	EXPD.flashes = {};


	// READY?, SET?, GO!
	EXPD.elapsedTime = 0;
	EXPD.lastTimeStamp = performance.now();
	requestAnimationFrame(EXPD.EXPDLoop);

};	// END EXPD.initialize



EXPD.setAsteroid = function (_entitySize, _location){

	var tempLocation = _location || null;

	switch(_entitySize){

		case EXPD.Entities.ASTEROID_LRG:
			//Asteroid(_image, _width, _height, _center, _rotation)
			var image = EXPD.images['images/cartoonishBigRockPurp.png'],
				width = EXPD.GameParameters.sizeOfLargeAsteroids,
				height = EXPD.GameParameters.sizeOfLargeAsteroids,
				rotation = 0,
				rotationRate = 0.014,
				speed = Random.nextGaussian(50, 20),
				direction = Vector2d.vectorFromAngle(Random.nextGaussian(Math.PI, Math.PI)),
				visible = true,
				ast = {},
				center = {};

				if(tempLocation !== null) {

					center = _location;

				}
				else {

					//
					// Random is bad: what if there is a collision at time t = 0?
					// TODO: fix.
					center = {
						x: Random.nextRange(width, EXPD.canvas.width - width), 
						y: Random.nextRange(height, EXPD.canvas.height - height)
					};
				}
				

			ast = Asteroid.create(image, width, height, center, rotation, rotationRate, speed, direction, visible);
			ast.type = EXPD.Entities.ASTEROID_LRG;

			return ast;
			break;				// superfluous

		case EXPD.Entities.ASTEROID_MED:
			//Asteroid(_image, _width, _height, _center, _rotation)
			var image = EXPD.images['images/cartoonishMedRockPurp.png'],
				width = EXPD.GameParameters.sizeOfMedAsteroids,
				height = EXPD.GameParameters.sizeOfMedAsteroids,
				rotation = 0,
				rotationRate = 0.014,
				speed = Random.nextGaussian(50, 20),
				direction = Vector2d.vectorFromAngle(Random.nextGaussian(Math.PI, Math.PI)),
				visible = true,
				ast = {},
				center = {};

				if(tempLocation !== null) {

					center = _location;

				}
				else {

					//
					// Random is bad: what if there is a collision at time t = 0?
					// TODO: fix.
					center = {
						x: Random.nextRange(width, EXPD.canvas.width - width), 
						y: Random.nextRange(height, EXPD.canvas.height - height)
					};
				}
				

			ast = Asteroid.create(image, width, height, center, rotation, rotationRate, speed, direction, visible);
			ast.type = EXPD.Entities.ASTEROID_MED;

			return ast;
			break;				// superfluous

		case EXPD.Entities.ASTEROID_SML:
			//Asteroid(_image, _width, _height, _center, _rotation)
			var image = EXPD.images['images/cartoonishSmallRockPurp.png'],
				width = EXPD.GameParameters.sizeOfSmallAsteroids,
				height = EXPD.GameParameters.sizeOfSmallAsteroids,
				rotation = 0,
				rotationRate = 0.014,
				speed = Random.nextGaussian(50, 20),
				direction = Vector2d.vectorFromAngle(Random.nextGaussian(Math.PI, Math.PI)),
				visible = true,
				ast = {},
				center = {};

				if(tempLocation !== null) {

					center = _location;

				}
				else {

					//
					// Random is bad: what if there is a collision at time t = 0?
					// TODO: fix.
					center = {
						x: Random.nextRange(width, EXPD.canvas.width - width), 
						y: Random.nextRange(height, EXPD.canvas.height - height)
					};
				}
				

			ast = Asteroid.create(image, width, height, center, rotation, rotationRate, speed, direction, visible);
			ast.type = EXPD.Entities.ASTEROID_SML;

			return ast;
			break;				// superfluous
	}
}



EXPD.setExplosionFlash = function(_flashType, _flashCenter) {


	switch(_flashType){

		case EXPD.Flash.baseFlash:

			var id = EXPD.GameParameters.flashUniqueId;
			EXPD.flashes[id] = Spec.create(EXPD.images['images/plasmaCenterFlash.png'], 400, 400, _flashCenter, 0);
			EXPD.GameParameters.flashUniqueId++;
			break;

		case EXPD.Flash.friendlyShipExplosionFlash:

			var id = EXPD.GameParameters.flashUniqueId;
			EXPD.flashes[id] = Spec.create(EXPD.images['images/friendlyExplosionFlash.png'], 800, 800, _flashCenter, 0);
			EXPD.GameParameters.flashUniqueId++;
			break;

	}
};




EXPD.initializeExplosion = function(explosionType, explposionCenter){

	// INTERFACE:
	// ExplosionType : { baseExplosion, friendlyShipExplosion, enemyShipExplosion, enemyMissileExplosion }
	// ImageSet(_fire, _smoke, _plasma, _debryBase, _debryShip, _debryEnemyShip, _debryMissiles)
	///////
	var imgs = {},
		exp;

	switch(explosionType){

		case ExplosionFactory.ExplosionType.baseExplosion:
			
			imgs = ExplosionFactory.ImageSet(

				EXPD.images['images/fireBig.png'],
				EXPD.images['images/smoke.png'],
				EXPD.images['images/plasma.png'],
				EXPD.images['images/cartoonishBubble.png'],
				null,
				null
			);

			// Initialize explosion, tag, and bag.
			exp = ExplosionFactory.create(ExplosionFactory.ExplosionType.baseExplosion, imgs, EXPD.graphics, 2, explposionCenter);
			EXPD.explosions[exp.id] = exp;
			break;

		case ExplosionFactory.ExplosionType.friendlyShipExplosion:

			imgs = ExplosionFactory.ImageSet(

				EXPD.images['images/fireBig.png'],
				EXPD.images['images/smoke.png'],
				EXPD.images['images/plasma.png'],
				EXPD.images['images/cartoonishBubble.png'],
				EXPD.images['images/commet.png'],
				null
			);

			// Initialize explosion, tag, and bag.
			exp = ExplosionFactory.create(ExplosionFactory.ExplosionType.friendlyShipExplosion, imgs, EXPD.graphics, 2, explposionCenter);
			EXPD.explosions[exp.id] = exp;
			break;

		// TODO: more

	}

	
};





EXPD.fireFriendlyMissile = function(_elapsedTime, _code){

	if(_code !== -1){

		if(EXPD.GameParameters.timeSinceLastMissile >=  (1 / EXPD.GameParameters.firingRate)){

		var image = EXPD.images['images/FireBall.png'],
		width = 30,
		height = 30,

		center = EXPD.ship[0].center,
		rotation = EXPD.ship[0].rotation,
		rotationRate = 0;
		speed = 360,
		direction = EXPD.ship[0].direction,
		visible = true;

		var	msl = Missile.create(image, width, height, center, rotation, rotationRate, speed, direction, visible);
		msl.type = EXPD.Entities.MISSLE_FRIENDLY;
					

		// Insert.
		EXPD.friendlyMissles[msl.id] = msl;
		EXPD.GameParameters.timeSinceLastMissile = 0;

		}
		else{

			EXPD.GameParameters.timeSinceLastMissile += _elapsedTime;
		}
	}
	else if (EXPD.GameParameters.timeSinceLastMissile < (1/ EXPD.GameParameters.firingRate)){

		EXPD.GameParameters.timeSinceLastMissile = (1/ EXPD.GameParameters.firingRate) - 0.05;
	}
};





EXPD.collisionDetection = function(){

	// Collision handling function : dumb
	function collisionStrategy_log(ntt1, ntt2){

		var mp = Vector2d.midPoint(ntt1.center, ntt2.center);
		console.log("collision at " + "< " + mp.x + ", " + mp.y + " >");
	}




	// kill the asteroid ... temporarily, of course. ... with an exp .. testing
	function collisionStrategy_exp(ntt1, ntt2){

		var tempAst = {};

		if(ntt1.type === EXPD.Entities.MISSLE_FRIENDLY){
			
			tempAst = ntt2;
		}
		else{

			tempAst = ntt1;
		}

		// Remove elements (kindda)
		ntt1.visible = false;
		ntt2.visible = false;


		// Visual effects (flash, explosion).
		EXPD.setExplosionFlash(EXPD.Flash.baseFlash, Vector2d.midPoint(ntt1.center, ntt2.center));
		EXPD.initializeExplosion(ExplosionFactory.ExplosionType.baseExplosion, Vector2d.midPoint(ntt1.center, ntt2.center));


		// Process asteroid to determine if new asteroids must be added to the set.
		EXPD.breakAsteroid(tempAst.type, tempAst.center);

	}





	////
	// Interface: ntt element has the following data members: .width, .height, .center
	///
	function collisionStrategy_shipCrash(ntt1, ntt2) {
		// 	if this is last life
		//		then 
		//			gameOver
		//	else if there are more than one life remaining 
		//		then 
		//			shipCrash : Menu : TODO
		//			make safe

		// TODO: make the ship temporarily invisible

		var tempShip = {};
		if(ntt1.type = EXPD.Entities.SHIP_FRIENDLY){

			tempShip = ntt1;
		}
		else {

			tempShip = ntt2;
		}


		if(EXPD.GameParameters.currentLife === 'fixThisLogic'){

			EXPD.gameOver();
		}
		else {

			EXPD.GameParameters.currentLife--;


			EXPD.setExplosionFlash(EXPD.Flash.friendlyShipExplosionFlash, { x : tempShip.center.x, y : tempShip.center.y - tempShip.height});
			EXPD.initializeExplosion(ExplosionFactory.ExplosionType.friendlyShipExplosion, Vector2d.midPoint(ntt1.center, ntt2.center));
			
			EXPD.makeShipSafe();
		}


	}


	//////
	//
	// Requires : CollisionDetector.js
	//
	//////


	// if ship is not safe, check for collisions.

	// NOTE: wron logic for debuggin ............ TODO: NEGATE
	if(!EXPD.GameParameters.shipIsSafe){
		
		CollisionDetector.detectCollisions(EXPD.ship, EXPD.asteroids, collisionStrategy_shipCrash);
	}


	// Always check for friendly missiles collisions with asteroids.
	CollisionDetector.detectCollisions(EXPD.friendlyMissles, EXPD.asteroids, collisionStrategy_exp);

};





EXPD.update = function(elapsedTime, canvasDim){

	EXPD.keyboard.update(elapsedTime, canvasDim);


	// Update ship status
	if(EXPD.GameParameters.shipIsSafe){

		if (EXPD.GameParameters.safetyPeriodCountDown > 0){

			EXPD.GameParameters.safetyPeriodCountDown -= elapsedTime;			
		}
		else {

			EXPD.GameParameters.shipIsSafe = false;
		}

	}


	// Udate ship movement
	EXPD.ship[0].update(elapsedTime, canvasDim);


	// Update elements before collision detection.
	// NOTE: to move out of here, add parameters, and done.
	/////
	(function preCollisionUpdate(){

		// update asteroids
		for(var ast in EXPD.asteroids){

			EXPD.asteroids[ast].update(elapsedTime, canvasDim);

		}

		// update friendly missiles
		for(var msl in EXPD.friendlyMissles){

			EXPD.friendlyMissles[msl].update(elapsedTime, canvasDim);
		}

	}());



	// detect collisions. NOTE: Modifies the state of elements.
	EXPD.collisionDetection();



	// Update elements (including explposions) after collision detection.
	/////
	(function postCollisionUpdate(){

		// Delete destroyed asteroids.
		for(var ast in EXPD.asteroids){

			if(!EXPD.asteroids[ast].visible){

					delete EXPD.asteroids[ast];
			}
		}



		// Delete destroyed missiles
		for(var msl in EXPD.friendlyMissles){

			if(!EXPD.friendlyMissles[msl].visible){

					delete EXPD.friendlyMissles[msl];
			}
		}	





		// update explosions.
		for(var exp in EXPD.explosions){

			EXPD.explosions[exp].update(elapsedTime, canvasDim);

			if(!EXPD.explosions[exp].visible){

				delete EXPD.explosions[exp];
			}
		}
	}());

};


EXPD.render = function(ctx){

	// render ship
	EXPD.graphics.drawImage(EXPD.ship[0]);

	// render asteroids
	for(var ast in EXPD.asteroids){

		EXPD.graphics.drawImage(EXPD.asteroids[ast]);
	}



	// render friendly missiles
	for(var mis in EXPD.friendlyMissles){

		EXPD.graphics.drawImage(EXPD.friendlyMissles[mis]);
	}



	// Flashes
	for (var flash in EXPD.flashes){

		EXPD.graphics.drawImage(EXPD.flashes[flash]);
		delete EXPD.flashes[flash];
	}


	// render explosions
	for(var exp in EXPD.explosions){

			EXPD.explosions[exp].render();
	}	

};