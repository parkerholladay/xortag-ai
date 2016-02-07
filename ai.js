'use strict';

(function(ai) {
	var config = require('./config');

	ai.getNextMove = function (player) {
		var obstacles = getObstacles(player);
		var commands = getPossibleMoves(player, obstacles.closestObject, obstacles.blocked);
		var command = getBestMove(player, obstacles.closestObject, commands);

		return command;
	};

	var getObstacles = function (player) {
		var obstacles = {
			blocked: []
		};

		var closestDelta = {x: player.mapWidth, y: player.mapHeight};

		var objects = getVisibleObjectsOnMap(player);
		objects.forEach(function (o) {
			var objectDelta = getDelta(player, o);
            var blocked = getBlockedDirections(player, o, objectDelta);
			obstacles.blocked = obstacles.blocked.concat(blocked);

			if (isObjectCloser(player, o, objectDelta, obstacles.closestObject, closestDelta)) {
				closestDelta = objectDelta;
				obstacles.closestObject = o;
			}
		});

		return obstacles;
	};

	var getBlockedDirections = function (player, object, delta) {
        var blocked = [];
        
		if (!player.isIt || (player.isIt && object.isBorder)) {
			if (delta.x === 1 && delta.y === 0) {
				if (isObjectToTheLeftOfPlayer(player.x, object.x)) {
					blocked.push(config.commands.left);
				} else {
					blocked.push(config.commands.right);
				}
			} else if (delta.x === 0 && delta.y === 1) {
				if (isObjectAbovePlayer(player.y, object.y)) {
					blocked.push(config.commands.up);
				} else {
					blocked.push(config.commands.down);
				}
			}
		}
        
        return blocked;
	};

	var getVisibleObjectsOnMap = function (player) {
		var objects = player.players.slice();

        if (player.y <= config.proximityBuffer) objects.push(getBorder(player.x, -1));
        if (player.mapHeight - player.y <= config.proximityBuffer) objects.push(getBorder(player.x, player.mapHeight));
        if (player.x <= config.proximityBuffer) objects.push(getBorder(-1, player.y));
        if (player.mapWidth - player.x <= config.proximityBuffer) objects.push(getBorder(player.mapWidth, player.y));

		return objects;
	};

	var getPossibleMoves = function (player, object, blocked) {
		var commands = Object.keys(config.commands).map(function (key) {
			return config.commands[key];
		});

        console.log('object: ', object, 'blocked: ', blocked)
        if (!object)
            object = {};

		if ((!player.isIt && isObjectAbovePlayer(player.y, object.y)) || isBlocked(config.commands.up, blocked))
			commands.remove(config.commands.up);
		if ((!player.isIt && isObjectBelowPlayer(player.y, object.y)) || isBlocked(config.commands.down, blocked))
			commands.remove(config.commands.down);
		if ((!player.isIt && isObjectToTheLeftOfPlayer(player.x, object.x)) || isBlocked(config.commands.left, blocked))
			commands.remove(config.commands.left);
		if ((!player.isIt && isObjectToTheRightOfPlayer(player.x, object.x)) || isBlocked(config.commands.right, blocked))
			commands.remove(config.commands.right);
		if (player.isIt || object.isIt)
			commands.remove(config.commands.look);

		return commands;
	};
    
    var getBestMove = function (player, object, commands) {
        return player.isIt && object &&  !object.isBorder
			? moveTowardPlayer(player, object, commands)
            : moveAwayFromObject(player, object, commands);
    };

	var moveAwayFromObject = function (player, object, commands) {
        if (object) {
            if (isObjectAbovePlayer(player.y, object.y) && commands.contains(config.commands.down))
                return config.commands.down;
            else if (isObjectBelowPlayer(player.y, object.y) && commands.contains(config.commands.up))
                return config.commands.up;
            else if (isObjectToTheLeftOfPlayer(player.x, object.x) && commands.contains(config.commands.right))
                return config.commands.right;
            else if (isObjectToTheRightOfPlayer(player.x, object.x) && commands.contains(config.commands.left))
                return config.commands.left;
            else
                return commands[0];
        } else {
            return getRandomMove(commands);
        }
	};

	var moveTowardPlayer = function (player, target, commands) {
		if (isObjectAbovePlayer(player.y, target.y) && commands.contains(config.commands.up))
			return config.commands.up;
		else if (isObjectBelowPlayer(player.y, target.y) && commands.contains(config.commands.down))
			return config.commands.down;
		else if (isObjectToTheLeftOfPlayer(player.x, target.x) && commands.contains(config.commands.left))
			return config.commands.left;
		else if (isObjectToTheRightOfPlayer(player.x, target.x) && commands.contains(config.commands.right))
			return config.commands.right;
		else
			return getRandomMove(commands);
	};

	function isObjectToTheRightOfPlayer(x, obstacleX) {
		return x < obstacleX;
	}

	function isObjectToTheLeftOfPlayer(x, obstacleX) {
		return x > obstacleX;
	}

	function isObjectBelowPlayer(y, obstacleY) {
		return y < obstacleY;
	}

	function isObjectAbovePlayer(y, obstacleY) {
		return y > obstacleY;
	}
    
    function isObjectCloser(player, object, delta, closestObject, closestDelta) {
        if (object.isIt)
            return true;
        if (closestObject && closestObject.isIt)
            return false;
        if (player.isIt && object.isBorder && closestObject && !closestObject.isBorder)
            return false;
        return delta.x + delta.y < closestDelta.x + closestDelta.y;
    }

	function isBlocked(direction, blocked) {
		return blocked.contains(direction);
	}

	function getDelta(player, obstacle) {
        return {x: Math.abs(player.x - obstacle.x), y: Math.abs(player.y - obstacle.y)};
	}

    function getBorder (x, y) {
        return {x: x, y: y, isBorder: true};
    }

	function getRandomMove(commands) {
		var command;
		do {
			command = Math.floor(Math.random() * config.commands.look);
		} while (!commands.contains(command));

		return command;
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