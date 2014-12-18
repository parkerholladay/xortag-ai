'use strict';

(function(ai) {
	var up = 0;
	var down = 1;
	var left = 2;
	var right = 3;
	var look = 4;

	var config = require('./config');

	ai.getNextMove = function (player) {
		var obstacles = getObstacles(player);
		var commands = getPossibleMoves(player, obstacles);
		var command = !player.isIt ?
			moveAwayFromObstacle(player, obstacles.player, commands) :
			moveTowardPlayer(player, obstacles.player, commands);

		return command;
	};

	var getObstacles = function (player) {
		var isClosestFound = false;
		var closestX = player.mapWidth;
		var closestY = player.mapHeight;

		var obstacle = {player: player.players.first(isPlayerIt), blocked: []};
		if (!player.isIt && obstacle.player) {
			isClosestFound = true;
		} else {
			obstacle.player = {};
		}

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

	var isPlayerIt = function (player) {
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
			if (player.y - obstacle.y > 0) {
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
			if (player.mapHeight - player.y <= config.proximityBuffer) obstacles.push({
				x: player.x,
				y: player.mapHeight
			});
			if (player.x <= config.proximityBuffer) obstacles.push({x: -1, y: player.y});
			if (player.mapWidth - player.x <= config.proximityBuffer) obstacles.push({x: player.mapWidth, y: player.y});
		}

		return obstacles;
	};

	function getDeltas(player, obstacle) {
		return {x: Math.abs(player.x - obstacle.x), y: Math.abs(player.y - obstacle.y)};
	}

	var getPossibleMoves = function (player, obstacles) {
		var commands = [up, down, left, right, look];

		if ((!player.isIt && isObstacleAbovePlayer(player.y, obstacles.player.y)) || isBlocked(up, obstacles.blocked)) {
			commands.remove(up);
		}
		if ((!player.isIt && isObstacleBelowPlayer(player.y, obstacles.player.y)) || isBlocked(down, obstacles.blocked)) {
			commands.remove(down);
		}
		if ((!player.isIt && isObstacleToTheLeftOfPlayer(player.x, obstacles.player.x)) || isBlocked(left, obstacles.blocked)) {
			commands.remove(left);
		}
		if ((!player.isIt && isObstacleToTheRightOfPlayer(player.x, obstacles.player.x)) || isBlocked(right, obstacles.blocked)) {
			commands.remove(right);
		}
		if (player.isIt) {
			commands.remove(look);
		}

		return commands;
	};

	var moveAwayFromObstacle = function (player, obstacle, commands) {
		if (isObstacleAbovePlayer(player.y, obstacle.y) && commands.contains(down)) {
			return down;
		}
		if (isObstacleBelowPlayer(player.y, obstacle.y) && commands.contains(up)) {
			return up;
		}
		if (isObstacleToTheLeftOfPlayer(player.x, obstacle.x) && commands.contains(right)) {
			return right;
		}
		if (isObstacleToTheRightOfPlayer(player.x, obstacle.x) && commands.contains(left)) {
			return left;
		}

		return commands[0];
	};

	var moveTowardPlayer = function (player, obstacle, commands) {
		if (isObstacleAbovePlayer(player.y, obstacle.y) && commands.contains(up)) {
			return up;
		}
		if (isObstacleBelowPlayer(player.y, obstacle.y) && commands.contains(down)) {
			return down;
		}
		if (isObstacleToTheLeftOfPlayer(player.x, obstacle.x) && commands.contains(left)) {
			return left;
		}
		if (isObstacleToTheRightOfPlayer(player.x, obstacle.x) && commands.contains(right)) {
			return right;
		}

		return commands.sort(getRandomSort)[0];
	};

	var isObstacleToTheRightOfPlayer = function (x, obstacleX) {
		return x < obstacleX;
	};

	var isObstacleToTheLeftOfPlayer = function (x, obstacleX) {
		return x > obstacleX;
	};

	var isObstacleBelowPlayer = function (y, obstacleY) {
		return y < obstacleY;
	};

	var isObstacleAbovePlayer = function (y, obstacleY) {
		return y > obstacleY;
	};

	var isBlocked = function (direction, blocked) {
		return blocked.contains(direction);
	};

	var getRandomSort = function (a, b) {
		return (Math.floor(Math.random() * 3) % 3) - 1;
	};

	Array.prototype.first = function (selector) {
		if (typeof selector !== 'function') {
			return undefined;
		}

		for (var i = 0; i < this.length; i++) {
			if (i in this && selector(this[i])) return this[i];
		}

		return undefined;
	};

	Array.prototype.contains = function (selector) {
		return this.indexOf(selector) >= 0;
	};

	Array.prototype.remove = function (selector) {
		var index = this.indexOf(selector);
		if (index !== -1) {
			this.splice(index, 1);
		}
	};

})(module.exports);