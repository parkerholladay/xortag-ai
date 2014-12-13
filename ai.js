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
			command = moveAwayFromBoarders(player);
			command = command === look ? moveAwayFromPlayers(player) : command;
		} else {
			command = Math.floor((Math.random() * 4));
		}

		return command;
	};

	var moveAwayFromPlayers = function (player) {
		var command = look;
		if (isOtherPlayerNearby(player)) {
			player.players.forEach(function (p) {
				//TODO when they are in close proximity but not on the exact same x or y
				if (isPlayerNearTopObject(player.y, p.y)) {
					command = down;
				} else if (isPlayerNearBottomObject(player.y, p.y)) {
					command = up;
				} else if (isPlayerNearLeftObject(player.x, p.x)) {
					command = right;
				} else if (isPlayerNearRightObject(player.x, p.x)) {
					command = left;
				}
			});
		}

		return command;
	};

	var moveAwayFromBoarders = function (player) {
		if (isPlayerNearTopObject(player.y, -1)) {
			return down;
		} else if (isPlayerNearBottomObject(player.y, player.mapHeight)) {
			return up;
		} else if (isPlayerNearLeftObject(player.x, -1)) {
			return right;
		} else if (isPlayerNearRightObject(player.x, player.mapWidth)) {
			return left;
		}

		return look;
	};

	var isOtherPlayerNearby = function (player) {
		return player.players.length > 0;
	};

	var isPlayerNearRightObject = function (x, objectX) {
		return x < objectX && x + config.proximityBuffer >= objectX;
	};

	var isPlayerNearLeftObject = function (x, objectX) {
		return x > objectX && x - config.proximityBuffer <= objectX;
	};

	var isPlayerNearBottomObject = function (y, objectY) {
		return y < objectY && y + config.proximityBuffer >= objectY;
	};

	var isPlayerNearTopObject = function (y, objectY) {
		return y > objectY && y - config.proximityBuffer <= objectY;
	};

})(module.exports);