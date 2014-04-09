/*jslint browser: true, white: true, plusplus: true */
/*global EXPD */
EXPD.screens['about'] = (function() {
	'use strict';
	
	function initialize() {
		document.getElementById('id-about-back').addEventListener(
			'click',
			function() { EXPD.game.showScreen('main-menu'); },
			false);
	}
	
	function run() {
		//
		// I know this is empty, there isn't anything to do.
	}
	
	return {
		initialize : initialize,
		run : run
	};
}());
