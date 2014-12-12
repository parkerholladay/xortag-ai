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
		}

		return command;
/*		if(player.isIt || (isOtherPlayerNearby(player) || isPlayerNearEdgeOfMap(player))) {
			return Math.floor((Math.random() * 4));
		} else {
			return 4;
		}*/
	};

	var moveAwayFromOtherPlayers = function(player) {
		//return Math.floor((Math.random() * 4));
		return look;
	};

	var moveAwayFromEdges = function(player) {
		if(isPlayerNearTopEdge(player.y)){
			return down;
		} else if(isPlayerNearBottomEdge(player.y, player.mapHeight)) {
			return up;
		} else if(isPlayerNearLeftEdge(player.x)) {
			return right;
		} else if(isPlayerNearRightEdge(player.x, player.mapWidth)) {
			return left;
		}
	};

	var isOtherPlayerNearby = function(player) {
		return player.players.length > 0;
	};

	var isPlayerNearEdgeOfMap = function(player) {
		return isPlayerNearLeftEdge(player.x) ||
			isPlayerNearRightEdge(player.x, player.mapWidth) ||
			isPlayerNearTopEdge(player.y) ||
			isPlayerNearBottomEdge(player.y, player.mapHeight);
	};

	var isPlayerNearLeftEdge = function(x) {
		return x - config.mapEdgeBuffer < 0;
	};

	var isPlayerNearRightEdge = function(x, mapWidth) {
		return x + config.mapEdgeBuffer >= mapWidth;
	};

	var isPlayerNearTopEdge = function(y) {
		return y - config.mapEdgeBuffer < 0;
	};

	var isPlayerNearBottomEdge = function(y, mapHeight) {
		return y + config.mapEdgeBuffer >= mapHeight;
	};

})(module.exports);