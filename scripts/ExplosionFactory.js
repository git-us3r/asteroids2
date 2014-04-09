// ExplosionFactory.js


// rank should correspond the number of images intended
// Usage: create an array of image-rank associations.
// then pass the array as parameter to the ExplosionFactoryImageSet
// 

var ExplosionFactory = (function(){


	that = {};

	// kind of an enum
	var ImageType = (function(){

		return {
			fire : 'FIRE',
			smoke : 'SMOKE',
			plasma : 'PLASMA',
			debryBase : 'DEBRY_BASE',
			debryMissiles : 'DEBRY_MISSILES',
			debryEnemyShip : 'DEBRY_ENEMY_SHIP',
			debryShip : 'DEBRY_SHIP'
		};

	}());




	function ImageFactory(_ImageType, _image, _center){


		////////////////////////// TEMPLATES ////////////////////

		// Add a new parameter to determine how many particles should
		// be regenerated during update.

		function fire(_image, _center){

			return {
				image : _image,
				width : 200,
				height : 200,
				center : _center,
				speed_std : 20,
				speed_mean : 180,
				lifetime_mean : .5,
				lifetime_std : .1,
				genRate : 400
			};
		}



		function smoke(_image, _center){

			return {
				image : _image,
				width : 20,
				height : 20,
				center : _center,
				speed_std : 80,
				speed_mean : 100,
				lifetime_mean : .8,
				lifetime_std : .1,
				genRate : 900
			};
		}



		function plasma(_image, _center){

			return {
				image : _image,
				width : 20,
				height : 20,
				center : _center,
				speed_std : 2,
				speed_mean : 10,
				lifetime_mean : .7,
				lifetime_std : 1,
				genRate : 80
			};
		}



		function debryBase(_image, _center){

			return {
				image : _image,
				width : 40,
				height : 40,
				center : _center,
				speed_std : 50,
				speed_mean : 500,
				lifetime_mean : .9,
				lifetime_std : 1,
				genRate : 20
			};
		}


		function debryFlash(_image, _center){

			return {
				image : _image,
				width : 30,
				height : 30,
				center : _center,
				speed_std : 30,
				speed_mean : 3,
				lifetime_mean : 2,
				lifetime_std : 1,
				genRate : 2
			};
		}


		function debryShip(_image, _center){

			return {
				image : _image,
				width : 300,
				height : 300,
				center : _center,
				speed_std : 3,
				speed_mean : 800,
				lifetime_mean : .9,
				lifetime_std : 1,
				genRate : 3
			};
		}


		function debryMissiles(_image, _center){

			return {
				image : _image,
				width : 30,
				height : 30,
				center : _center,
				speed_std : 30,
				speed_mean : 3,
				lifetime_mean : 2,
				lifetime_std : 1,
				genRate : 2
			};
		}

		function debryEnemyShip(_image, _center){

			return {
				image : _image,
				width : 30,
				height : 30,
				center : _center,
				speed_std : 30,
				speed_mean : 3,
				lifetime_mean : 2,
				lifetime_std : 1,
				genRate : 2
			};
		}

		////////////////////////// END TEMPLATES ////////////////////

		switch(_ImageType){
			case ImageType.fire:
				return fire(_image, _center);
				break;
			case ImageType.smoke:
				return smoke(_image, _center)
				break;
			case ImageType.plasma:
				return plasma(_image, _center);
				break;
			case ImageType.debryBase:
				return debryBase(_image, _center);
				break;
			case ImageType.debryShip:
				return debryShip(_image, _center);
				break;
			case ImageType.debryMissiles:
				return debryMissiles(_image, _center);
				break;	
				
			case ImageType.debryEnemyShip:
				return debryEnemyShip(_image, _center);
				break;


		}
	}




	// Another enum ... kindda
	var ExplosionType = (function(){

		return {

			baseExplosion : 'BASE_EXPLOSION',
			friendlyShipExplosion : 'FRIENDLY_SHIP_EXPLOSION',
			enemyShipExplosion : 'ENEMY_SHIP_EXPLOSION',
			enemyMissileExplosion : 'ENEMY_MISSILE_EXPLOSION'
		};
	}());



	// stores images.
	function ImageSet(_fire, _smoke, _plasma, _debryBase, _debryShip, _debryEnemyShip, _debryMissiles){

		
		return {
			
			fire : _fire || null,
			smoke :  _smoke || null,
			plasma :  _plasma || null,
			debryBase : _debryBase || null,
			debryShip :  _debryShip || null,
			debryEnemyShip : _debryEnemyShip || null,
			debryMissiles :  _debryMissiles || null
		
		}
	}



	//
	// USAGE:
	// s
	function create(_ExplosionType, _ImageSet, _graphics, _duration, _center){	

		function baseImageSet(){

			return [

				ImageFactory(ImageType.fire, _ImageSet.fire, _center),
				ImageFactory(ImageType.smoke, _ImageSet.smoke, _center),
				ImageFactory(ImageType.plasma, _ImageSet.plasma, _center),
				ImageFactory(ImageType.debryBase, _ImageSet.debryBase, _center)
			];
		}	



		//////////////////////////// EXPLOSION PROTOTYPES //////////////////////////
		//
		// There are four types of explosions:
		// friendlyShip vs whatever : FS
		// friendlyMissile vs Asteroid: BE (base)
		// friendlyMissile vs EnemyShip: ES
		// friendlyMissile vs EnemyMissile EM
		///
		function BE()
		{
			var pics = baseImageSet(),			
				xparam = Explosion.explosionParameters(pics, _graphics, _duration),
				exp = Explosion.setExplosion(xparam);


			return exp;
		}




		function FS(){


			var pics = baseImageSet(),
				xparam = null,
				exp = null;

			pics.push(ImageFactory(ImageType.debryShip, _ImageSet.debryShip, _center));
			//pics.push(ImageFactory(ImageType.debryMissiles, _ImageSet[ImageType.debryMissiles], _center));

			xparam = Explosion.explosionParameters(pics, _graphics, _duration);
			exp = Explosion.setExplosion(xparam);

			return exp;
		}

		

		function ES(){

			var pics = baseImageSet(),
				xparam = null,
				exp = null;

			pics.push(ImageFactory(ImageType.debryMissiles, _ImageSet.debryMissiles, _center));
			xparam = Explosion.explosionParameters(pics, _graphics, _duration);
			exp = Explosion.setExplosion(xparam);

			return exp;
		}
		


		function EM(){


			var pics = baseImageSet(),
				xparam = null,
				exp = null;

			pics.push(ImageFactory(ImageType.debryMissiles, _ImageSet.debryMissiles, _center));
			xparam = Explosion.explosionParameters(pics, _graphics, _duration);
			exp = Explosion.setExplosion(xparam);

			return exp;
		}

		//////////////////////////// END EXPLOSION PROTOTYPES //////////////////////////


		// Production
		switch(_ExplosionType){

			case ExplosionType.baseExplosion:
				return BE();
				break;


			case ExplosionType.friendlyShipExplosion:
				return FS();
				break;

			case ExplosionType.enemyShipExplosion:
				return ES();
				break;

			case ExplosionType.enemyMissileExplosion:
				return EM();
				break;
		}
	}



	that.ExplosionType = ExplosionType;
	that.ImageSet = ImageSet;
	that.create = create;
	return that;


}());



