'use strict';

(function(ai) {
	var config = require('./config');

	ai.getMove = function(player) {
		if(player.isIt || (isOtherPlayerNearby(player) || isPlayerNearEdgeOfMap(player))) {
			return Math.floor((Math.random() * 4));
		}
		else {
			return 4;
		}
	};

	var isOtherPlayerNearby = function(player) {
		return player.players.length > 0;
	}

	var isPlayerNearEdgeOfMap = function(player) {
		return isPlayerNearLeftEdge(player.x) ||
			isPlayerNearRightEdge(player.x, player.mapWidth) ||
			isPlayerNearTopEdge(player.y) ||
			isPlayerNearBottomEdge(player.y, player.mapHeight);
	}

	var isPlayerNearLeftEdge = function(x) {
		return x - config.mapEdgeBuffer < 0;
	}

	var isPlayerNearRightEdge = function(x, mapWidth) {
		return x + config.mapEdgeBuffer >= mapWidth;
	}

	var isPlayerNearTopEdge = function(y) {
		return y - config.mapEdgeBuffer < 0;
	}

	var isPlayerNearBottomEdge = function(y, mapHeight) {
		return y + config.mapEdgeBuffer >= mapHeight;
	}

})(module.exports);