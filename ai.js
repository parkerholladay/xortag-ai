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
			var obstacles = getClosestObject(player, true);
			console.log(JSON.stringify(player), obstacles);
			command = moveAwayFromObstacle(player, obstacles.player, obstacles.blocked);
		} else {
			command = Math.floor((Math.random() * 4));
		}

		return command;
	};

	var getClosestObject = function (player) {
		var isClosestFound = false;
		var closestX = player.mapWidth;
		var closestY = player.mapHeight;

		var obstacle = {player: player.players.first(isPlayerIt), blocked: []};
		isClosestFound = obstacle.player;

		var obstacles = getVisibleObstaclesOnMap(player, true);
		obstacles.forEach(function (o) {
			var deltas = getDeltas(player, o);
			getBlockedDirections(deltas, player, o, obstacle.blocked);

			if (!isClosestFound && (deltas.x + deltas.y < closestX + closestY)) {
				closestX = deltas.x;
				closestY = deltas.y;
				obstacle.player = o;
			}
		});

		return obstacle;
	};

	var isPlayerIt = function(player) {
		return player.isIt;
	};

	var getBlockedDirections = function (deltas, player, obstacle, blocked) {
		if (deltas.x === 1 && deltas.y === 0) {
			if (player.x - obstacle.x > 0) {
				blocked.push(left);
			} else {
				blocked.push(right);
			}
		} else if (deltas.y === 1 && deltas.x === 0) {
			if(player.y - obstacle.y > 0) {
				blocked.push(up);
			} else {
				blocked.push(down);
			}
		}
	};

	var getVisibleObstaclesOnMap = function (player, includeBorders) {
		var obstacles = player.players.slice(0);
		if (includeBorders) {
			if (player.y <= config.proximityBuffer) obstacles.push({x: player.x, y: -1});
			if (player.mapHeight - player.y <= config.proximityBuffer) obstacles.push({x: player.x, y: player.mapHeight});
			if (player.x <= config.proximityBuffer) obstacles.push({x: -1, y: player.y});
			if (player.mapWidth - player.x <= config.proximityBuffer) obstacles.push({x: player.mapWidth, y: player.y});
		}

		return obstacles;
	};

	function getDeltas(player, obstacle) {
		return {x: Math.abs(player.x - obstacle.x), y: Math.abs(player.y - obstacle.y)};
	}

	var moveAwayFromObstacle = function (player, obstacle, blocked) {
		if (isObstacleAbovePlayer(player.y, obstacle.y)) {
			return down;
		} else if (isObstacleBelowPlayer(player.y, obstacle.y)) {
			return up;
		} else if (isObstacleToTheLeftOfPlayer(player.x, obstacle.x)) {
			return right;
		} else if (isObstacleToTheRightOfPlayer(player.x, obstacle.x)) {
			return left;
		}

		return look;
	};

	var isObstacleToTheRightOfPlayer = function (x, obstacleX) {
		return x < obstacleX && x + config.proximityBuffer >= obstacleX;
	};

	var isObstacleToTheLeftOfPlayer = function (x, obstacleX) {
		return x > obstacleX && x - config.proximityBuffer <= obstacleX;
	};

	var isObstacleBelowPlayer = function (y, obstacleY) {
		return y < obstacleY && y + config.proximityBuffer >= obstacleY;
	};

	var isObstacleAbovePlayer = function (y, obstacleY) {
		return y > obstacleY && y - config.proximityBuffer <= obstacleY;
	};

	var canMove = function (direction, blocked) {
		return !blocked.contains(direction);
	};

	Array.prototype.first = function(selector) {
		if(typeof selector !== 'function') {
			return undefined;
		}

		for (var i = 0; i < this.length; i++) {
			if (i in this && selector(this[i])) return this[i];
		}

		return undefined;
	};

	Array.prototype.contains = function(selector) {
		return this.indexOf(selector) >= 0;
	}

})(module.exports);