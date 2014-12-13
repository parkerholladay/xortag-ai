'use strict';

(function(ai) {
	var up = 0;
	var down = 1;
	var left = 2;
	var right = 3;
	var look = 4;

	var config = require('./config');

	ai.getNextMove = function (player) {
		var command = look;

		if (!player.isIt) {
			command = moveAwayFromOtherPlayers(player);
			command = command === look ? moveAwayFromEdges(player) : command;
		} else {
			command = Math.floor((Math.random() * 4));
		}

		return command;
	};

	var moveAwayFromOtherPlayers = function (player) {
		if (isOtherPlayerNearby(player)) {
			player.players.forEach(function (p) {
				if (p.x) {
				}
			});
		}

		//return Math.floor((Math.random() * 4));
		return look;
	};

	var moveAwayFromEdges = function (player) {
		if (isPlayerNearTopObject(player.y, 0)) {
			return down;
		} else if (isPlayerNearBottomObject(player.y, player.mapHeight)) {
			return up;
		} else if (isPlayerNearLeftObject(player.x, 0)) {
			return right;
		} else if (isPlayerNearRightObject(player.x, player.mapWidth)) {
			return left;
		} else {
			return look;
		}
	};

	var isOtherPlayerNearby = function (player) {
		return player.players.length > 0;
	};

	var isPlayerNearRightObject = function (x, objectX) {
		return x + config.proximityBuffer >= objectX;
	};

	var isPlayerNearLeftObject = function (x, objectX) {
		return x - config.proximityBuffer < objectX;
	};

	var isPlayerNearBottomObject = function (y, objectY) {
		return y + config.proximityBuffer >= objectY;
	};

	var isPlayerNearTopObject = function (y, objectY) {
		return y - config.proximityBuffer < objectY;
	};

})(module.exports);