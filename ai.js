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
			var obstacle = getClosestObject(player, true);
			command = moveAwayFromObstacle(player, obstacle);
		} else {
			command = Math.floor((Math.random() * 4));
		}

		return command;
	};

	var getClosestObject = function (player) {
		var closestObject = {};
		var closestX = player.mapWidth;
		var closestY = player.mapHeight;

		var nearby = getNearbyObjects(player, true);
		nearby.forEach(function (n) {
			var absoluteX = getAbsoluteDistance(player.x, n.x);
			var absoluteY = getAbsoluteDistance(player.y, n.y);
			if ((absoluteX < closestX && absoluteY <= closestY) || (absoluteY < closestY && absoluteX <= closestY)){
				closestX = absoluteX;
				closestY = absoluteY;
				closestObject = n;
			}
		});

		return closestObject;
	};

	var getNearbyObjects = function (player, includeBorders) {
		var objects = player.players.slice(0);
		if (includeBorders) {

			objects.push({x: player.x, y: -1});
			objects.push({x: player.x, y: player.mapHeight});
			objects.push({x: -1, y: player.y});
			objects.push({x: player.mapWidth, y: player.y});
		}

		return objects;
	};

	function getAbsoluteDistance(dot, objectDot) {
		return Math.abs(dot - objectDot);
	}

	var moveAwayFromObstacle = function (player, obstacle) {
		if (isObstacleAbovePlayer(player.y, obstacle.y)) {
			return down;
		} else if (isObstacleBelowPlayer(player.y, obstacle.y)) {
			return up;
		} else if (isObstacleToTheLeftOfPlayer(player.x, obstacle.x)) {
			return right;
		} else if (isObstacleToTheRightOfPlayer(player.x, obstacle.x)) {
			return left;
		}
	};

	var isObstacleToTheRightOfPlayer = function (x, objectX) {
		return x < objectX && x + config.proximityBuffer >= objectX;
	};

	var isObstacleToTheLeftOfPlayer = function (x, objectX) {
		return x > objectX && x - config.proximityBuffer <= objectX;
	};

	var isObstacleBelowPlayer = function (y, objectY) {
		return y < objectY && y + config.proximityBuffer >= objectY;
	};

	var isObstacleAbovePlayer = function (y, objectY) {
		return y > objectY && y - config.proximityBuffer <= objectY;
	};

})(module.exports);