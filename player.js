'use strict';

(function(player) {
	var game = require('./game');
	var ai = require('./ai');
	var config = require('./config');

	var _player = getDefaultPlayer();

	player.play = function () {
		game.register(_player, function (data) {
			parsePlayer(data);

			console.log('');
			console.log('You successfully registered at', config.gameUrl);
			console.log('');
			console.log('Your player name is', _player.name, 'id:', _player.id);
			console.log('You are', _player.isIt ? 'it' : 'not it');
			console.log('');
		});
	};

	var move = function () {
		switch (ai.getNextMove(_player)) {
			case config.commands.up:
				game.moveUp(_player, parsePlayer);
				break;
			case config.commands.down:
				game.moveDown(_player, parsePlayer);
				break;
			case config.commands.left:
				game.moveLeft(_player, parsePlayer);
				break;
			case config.commands.right:
				game.moveRight(_player, parsePlayer);
				break;
			case config.commands.look:
				game.look(_player, parsePlayer);
				break;
		}
	};

	var parsePlayer = function (data) {
		if (data) {
			var player = JSON.parse(data);
			if (player.isIt && !_player.isIt) {
				console.log('You have been tagged -- you are it');
    			console.log('');
			} else if (_player.isIt && !player.isIt) {
				console.log('You tagged another player -- you are no longer it');
                console.log('');
			}

            _player = player;
		}
		else {
			console.log('No response. Player not moved');
		}

		move();
	};

	function getDefaultPlayer() {
		return {
			id: _player ? _player.id : 0,
			name: _player ? _player.name : '',
			isIt: _player ? _player.isIt : false,
			players: []
		};
	}

})(module.exports);