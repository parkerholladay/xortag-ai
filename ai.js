'use strict';

(function(ai) {
	var up = 0;
	var down = 1;
	var left =2;
	var right = 3;
	var look = 4;

	var config = require('./config');

	ai.getNextMove = function(player) {
		var command = look;

		if(!player.isIt) {
			command = moveAwayFromOtherPlayers(player);
			command = command === look ? moveAwayFromEdges(player) : command;
		} else {
			command = Math.floor((Math.random() * 5));
		}

		return command;
	};

	function moveAwayFromOtherPlayers(player) {
		if(isOtherPlayerNearby(player)) {
			player.players.forEach(function(p) {
				if(p.x) {}
			});
		}

		//return Math.floor((Math.random() * 4));
		return look;
	};

	function moveAwayFromEdges(player) {
		if(isPlayerNearTopObject(player.y, 0)){
			return down;
		} else if(isPlayerNearBottomObject(player.y, player.mapHeight)) {
			return up;
		} else if(isPlayerNearLeftObject(player.x, 0)) {
			return right;
		} else if(isPlayerNearRightObject(player.x, player.mapWidth)) {
			return left;
		} else {
			return look;
		}
	};

	function isOtherPlayerNearby(player) {
		return player.players.length > 0;
	};

	function isPlayerNearRightObject(x, objectX) {
		return x + config.proximityBuffer >= objectX;
	};

	function isPlayerNearLeftObject(x, objectX) {
		return x - config.proximityBuffer < objectX;
	};

	function isPlayerNearBottomObject(y, objectY) {
		return y + config.proximityBuffer >= objectY;
	};

	function isPlayerNearTopObject(y) {
		return y - config.proximityBuffer < 0;
	};

})(module.exports);