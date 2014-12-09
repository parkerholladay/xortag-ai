(function(ai) {
	var edgeBuffer = 6;

	ai.getMove = function(player) {
		if(player.isIt || (isOtherPlayerNearby(player) || isPlayerNearEdgeOfMap(player))) {
			return Math.floor((Math.random() * 4));
		}
		else {
			return 4;
		}
	};

	var isOtherPlayerNearby = function(player) {
		if(player.players.length > 0) {
			return true;
		}

		return false;
	}

	var isPlayerNearEdgeOfMap = function(player) {
		return isPlayerNearLeftEdge(player.x) ||
			isPlayerNearRightEdge(player.x, player.mapWidth) ||
			isPlayerNearTopEdge(player.y) ||
			isPlayerNearBottomEdge(player.y, player.mapHeight);
	}

	var isPlayerNearLeftEdge = function(x) {
		return x - edgeBuffer < 0;
	}

	var isPlayerNearRightEdge = function(x, mapWidth) {
		return x + edgeBuffer >= mapWidth;
	}

	var isPlayerNearTopEdge = function(y) {
		return y - edgeBuffer < 0;
	}

	var isPlayerNearBottomEdge = function(y, mapHeight) {
		return y + edgeBuffer >= mapHeight;
	}

})(module.exports);