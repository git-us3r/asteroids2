// Uses vector2d.js

/// INCOMPLETE .. IN PROGRESS...



GAME.events = {

	shipDestroyed : 'SHIP_DESTROYED',
	enemyShipDestroyed : 'ENEMY_SHIP_DESTROYED',
	enemyProjectileDestroyed : 'ENEMY_PROJECTILE_DESTROYED',
	asteroidDestroyed : 'ASTEROID_DESTROYED'

};		// not exhaustive.



GAME.CollisionStrategy = (function(){
	
	var that = {},
		eventName = '',
		collisionCenter = {x:null, y:null};


	that.handleCollision = function(ntt1, ntt2){

		collisionCenter = Vector2d.midpoint(ntt1, ntt2);


		if(ntt1.name === 'FRIENDLY_SHIP' || ntt2.name === 'FRIENDLY_SHIP'){

			eventName = GAME.events.shipDestroyed;
			event_shipDestroyed();

		}
		else if (ntt1.name === 'ENEMY_SHIP' || ntt2.name === 'ENEMY_SHIP'){

			eventName = GAME.events.enemyShipDestroyed;
			event_enemyShipDestroyed();
		}
		else if (ntt1.name === 'ENEMY_PROJECTILE' || ntt2.name === 'ENEMY_PROJECTILE'){

			eventName = GAME.events.enemyProjectileDestroyed;
			event_enemyProjectileDestroyed();
		}
		else {

			eventName = GAME.events.asteroidDestroyed;
			event_asteroidDestroyed();
		}
	};


	function event_shipDestroyed(){

		// TODO
		// GAME.ScoreManager.updateScore(eventName);
		// GAME.ViewsManager(eventName);
		// GAME.DisplayManager(eventName);

		// hide nttts
	}

	function event_enemyShipDestroyed(){

		// TODO
		// notify the menus

	}

	function event_enemyProjectileDestroyed(){

		// TODO
	}

	function event_asteroidDestroyed(){

		// TODO
	}


	return that;

});