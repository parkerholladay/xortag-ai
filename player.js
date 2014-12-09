(function(player) {
	var client = require('./client');
	var ai = require('./ai');

	var _player = {};

	player.register = function(host) {
		client.init(host);

		client.request('register', 0, getPlayer(function() {
			console.log('');
			console.log('You successfully registered on host ' + host);
			console.log('Your player name is ' + _player.name + ' and your id is ' + _player.id);
			console.log('');
			move();
		}));
	};

	var move = function() {
		switch(ai.getMove(_player)) {
			case 0:
				moveUp();
			break;
			case 1:
				moveDown();
			break;
			case 2:
				moveLeft();
			break;
			case 3:
				moveRight();
			break;
			case 4:
				look();
			break;
		}
	};

	var moveUp = function() {
		client.request('moveup', _player.id, getPlayer(move));
	};

	var moveDown = function() {
		client.request('movedown', _player.id, getPlayer(move));
	};

	var moveLeft = function() {
		client.request('moveleft', _player.id, getPlayer(move));
	};

	var moveRight = function() {
		client.request('moveright', _player.id, getPlayer(move));
	};

	var look = function() {
		console.log('** looking **');
		client.request('look', _player.id, getPlayer(move));
	};

	var getPlayer = function(callback) {
		return function(response) {
			var data = '';

			response.on('data', function(chunk) {
				data += chunk
			});

			response.on('end', function() {
				if(data) {
					_player = JSON.parse(data);
				}
				else {
					_player = {id: _player.id, name: _player.name, isIt: _player.isIt};
				}
				console.log(_player);
				if (callback) callback();
			});
		};
	};

})(module.exports);