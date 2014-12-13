'use strict';

(function(game) {
    var client = require('./client');
    var config = require('./config');

    var _player = getDefaultPlayer();

    game.start = function (callback) {
        sendRequest('register', _player.id, function (player) {
            console.log('');
            console.log('You successfully registered at ' + config.gameUrl);
            console.log('');
            console.log('Your player name is ' + player.name + '; id: ' + player.id);
            console.log('');
            callback(player);
        });
    };

    game.moveUp = function (id, callback) {
        sendRequest('moveUp', id, callback);
    };

    game.moveDown = function (id, callback) {
        sendRequest('moveDown', id, callback);
    };

    game.moveLeft = function (id, callback) {
        sendRequest('moveLeft', id, callback);
    };

    game.moveRight = function (id, callback) {
        sendRequest('moveRight', id, callback);
    };

    game.look = function (id, callback) {
        sendRequest('look', id, callback);
    };

    var sendRequest = function (command, id, callback) {
        console.log('id: ' + id + ' **' + command);
        setTimeout(function () {
            client.request(command, id, getPlayer(callback));
        }, 1000);
    };

    var getPlayer = function (callback) {
        return function (response) {
            var data = '';

            response
                .on('data', function (chunk) {
                    data += chunk
                })
                .on('end', function () {
                    if (data) {
                        _player = JSON.parse(data);
                    }
                    else {
                        console.log('No response. Player not moved');
                        _player = getDefaultPlayer();
                    }

                    if (callback) callback(_player);
                });
        };
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