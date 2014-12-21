'use strict';

(function(ai) {
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

		var obstacle = {
			player: player.players.first(function (p) {
				return p.isIt;
			}),
			blocked: []
		};

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

	var getBlockedDirections = function (deltas, player, obstacle, blocked) {
		if (!player.isIt) {
			if (deltas.x === 1 && deltas.y === 0) {
				if (player.x - obstacle.x > 0) {
					blocked.push(config.commands.left);
				} else {
					blocked.push(config.commands.right);
				}
			} else if (deltas.y === 1 && deltas.x === 0) {
				if (player.y - obstacle.y > 0) {
					blocked.push(config.commands.up);
				} else {
					blocked.push(config.commands.down);
				}
			}
		}
	};

	var getVisibleObstaclesOnMap = function (player, includeBorders) {
		var obstacles = player.players.slice(0);
		if (includeBorders) {
			if (player.y <= config.proximityBuffer) obstacles.push({x: player.x, y: -1, isBorder: true});
			if (player.mapHeight - player.y <= config.proximityBuffer) obstacles.push({x: player.x, y: player.mapHeight, isBorder: true});
			if (player.x <= config.proximityBuffer) obstacles.push({x: -1, y: player.y, isBorder: true});
			if (player.mapWidth - player.x <= config.proximityBuffer) obstacles.push({x: player.mapWidth, y: player.y, isBorder: true});
		}

		return obstacles;
	};

	function getDeltas(player, obstacle) {
		return player.isIt && obstacle.isBorder ? {x: player.mapWidth, y: player.mapHeight} : {x: Math.abs(player.x - obstacle.x), y: Math.abs(player.y - obstacle.y)};
	}

	var getPossibleMoves = function (player, obstacles) {
		var commands = Object.keys(config.commands).map(function (key) {
			return config.commands[key];
		});

		if ((!player.isIt && isObstacleAbovePlayer(player.y, obstacles.player.y)) || isBlocked(config.commands.up, obstacles.blocked)) {
			commands.remove(config.commands.up);
		}
		if ((!player.isIt && isObstacleBelowPlayer(player.y, obstacles.player.y)) || isBlocked(config.commands.down, obstacles.blocked)) {
			commands.remove(config.commands.down);
		}
		if ((!player.isIt && isObstacleToTheLeftOfPlayer(player.x, obstacles.player.x)) || isBlocked(config.commands.left, obstacles.blocked)) {
			commands.remove(config.commands.left);
		}
		if ((!player.isIt && isObstacleToTheRightOfPlayer(player.x, obstacles.player.x)) || isBlocked(config.commands.right, obstacles.blocked)) {
			commands.remove(config.commands.right);
		}
		if (player.isIt) {
			commands.remove(config.commands.look);
		}

		return commands;
	};

	var moveAwayFromObstacle = function (player, obstacle, commands) {
		if (obstacle) {
			if (isObstacleAbovePlayer(player.y, obstacle.y) && commands.contains(config.commands.down)) {
				return config.commands.down;
			} else if (isObstacleBelowPlayer(player.y, obstacle.y) && commands.contains(config.commands.up)) {
				return config.commands.up;
			} else if (isObstacleToTheLeftOfPlayer(player.x, obstacle.x) && commands.contains(config.commands.right)) {
				return config.commands.right;
			} else if (isObstacleToTheRightOfPlayer(player.x, obstacle.x) && commands.contains(config.commands.left)) {
				return config.commands.left;
			} else {
				return commands[0];
			}
		} else {
			return getRandomMove(commands);
		}
	};

	var moveTowardPlayer = function (player, target, commands) {
		if (isObstacleAbovePlayer(player.y, target.y) && commands.contains(config.commands.up)) {
			return config.commands.up;
		} else if (isObstacleBelowPlayer(player.y, target.y) && commands.contains(config.commands.down)) {
			return config.commands.down;
		} else if (isObstacleToTheLeftOfPlayer(player.x, target.x) && commands.contains(config.commands.left)) {
			return config.commands.left;
		} else if (isObstacleToTheRightOfPlayer(player.x, target.x) && commands.contains(config.commands.right)) {
			return config.commands.right;
		} else {
			return getRandomMove(commands);
		}
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

	var getRandomMove = function (commands) {
		var command;
		do {
			command = Math.floor(Math.random() * config.commands.look);
		} while (!commands.contains(command));

		return command;
	};

	Array.prototype.first = function (selector) {
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