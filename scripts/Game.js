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



// Eventually, all configuration paramters should be moved
// here. Particularly, those concerning the properties of 
// the entities; e.g., asteroid speed, missile speed, missile firing rate, etc.
EXPD.GameParameters = {

	firingRate : 5,
	timeSinceLastMissile : 2.998,
	flashUniqueId : 0
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




	// Only 4 for now ... args can be used to changed that.
	(function initializeAsteroids(numberOfAsteroids){

		EXPD.asteroids = {};

		for (var i = 0; i < numberOfAsteroids; i++){

			//Asteroid(_image, _width, _height, _center, _rotation)
			var image = EXPD.images['images/cartoonishBigRockBlue.png'],
				width = 50,
				height = 50,
				//
				// Random is bad: what if there is a collision at time t = 0?
				// TODO: fix.
				center = {
					x: Random.nextRange(width, EXPD.canvas.width - width), 
					y: Random.nextRange(height, EXPD.canvas.height - height)
				},
				rotation = 0,
				rotationRate = 0.014,
				speed = Random.nextGaussian(50, 20),
				direction = Vector2d.vectorFromAngle(Random.nextGaussian(Math.PI, Math.PI)),
				visible = true;

			var	ast = Asteroid.create(image, width, height, center, rotation, rotationRate, speed, direction, visible);
			ast.type = EXPD.Entities.ASTEROID_MED;
				

			EXPD.asteroids[ast.id] = ast;
		}
	}(4));


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


	// READY?, SET?, GO!
	EXPD.elapsedTime = 0;
	EXPD.lastTimeStamp = performance.now();
	requestAnimationFrame(EXPD.EXPDLoop);

};	// END EXPD.initialize



EXPD.flashes = {};

EXPD.setExplosionFlash = function(args) {

	var id = EXPD.GameParameters.flashUniqueId;
	EXPD.flashes.id = Spec.create(EXPD.images['images/plasmaCenterFlash.png'], 400, 400, args.midpoint, 0);
	EXPD.GameParameters.flashUniqueId++;
};




EXPD.initializeExplosion = function(args){

	// INTERFACE:
	// ImageSet(_fire, _smoke, _plasma, _debryBase, _debryShip, _debryEnemyShip, _debryMissiles)
	///////
	var imgs = ExplosionFactory.ImageSet(

		EXPD.images['images/fireBig.png'],
		EXPD.images['images/smoke.png'],
		EXPD.images['images/plasma.png'],
		EXPD.images['images/cartoonishBubble.png'],
		EXPD.images['images/commet.png'],
		null
	);

	// Initialize explosion, tag, and bag.
	var exp = ExplosionFactory.create(ExplosionFactory.ExplosionType.baseExplosion, imgs, EXPD.graphics, 2, args.midpoint);
	EXPD.explosions[exp.id] = exp;

	/// TODO : other explosions ... also, this one is pretty crappy.
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

		if(ntt1.type === 'asteroid_medium'){
			ntt1.visible = false;
		}
		else{
			ntt2.visible = false;
		}


		// If the ntts are here, (1) they collide, (2) they are visible.
		EXPD.setExplosionFlash({midpoint : Vector2d.midPoint(ntt1.center, ntt2.center)});
		EXPD.initializeExplosion({midpoint : Vector2d.midPoint(ntt1.center, ntt2.center)});

	}


	function collisionStrategy_exp2()
	{
		// test simultaneous exps
		EXPD.initializeExplosion({midpoint : {x: 100, y:100}});
		EXPD.initializeExplosion({midpoint : {x: 200, y:200}});
		EXPD.initializeExplosion({midpoint : {x: 300, y:300}});
		EXPD.initializeExplosion({midpoint : {x: 400, y:400}});
	}



	// CollisionDetector.js
	CollisionDetector.detectCollisions(EXPD.ship, EXPD.asteroids, collisionStrategy_exp);
	CollisionDetector.detectCollisions(EXPD.friendlyMissles, EXPD.asteroids, collisionStrategy_exp);

};



EXPD.update = function(elapsedTime, canvasDim){

	EXPD.keyboard.update(elapsedTime, canvasDim);
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