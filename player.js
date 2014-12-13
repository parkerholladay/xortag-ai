'use strict';

(function(player) {
	var game = require('./game');
	var ai = require('./ai');

	player.play = function() {
		game.start(move);
	};

	var move = function (player) {
		switch(ai.getNextMove(player)) {
			case 0:
				game.moveUp(player.id, move);
			break;
			case 1:
				game.moveDown(player.id, move);
			break;
			case 2:
				game.moveLeft(player.id, move);
			break;
			case 3:
				game.moveRight(player.id, move);
			break;
			case 4:
				game.look(player.id, move);
			break;
		}
	};

})(module.exports);