'use strict';

(function(game) {
    var client = require('./client');
    var config = require('./config');

    var _player = getDefaultPlayer();

    game.start = function (callback) {
        client.request('register', 0, getPlayer(function (player) {
            console.log('');
            console.log('You successfully registered at ' + config.gameUrl);
            console.log('');
            console.log('');
            console.log('Your player name is ' + player.name + '; id: ' + player.id);
            console.log('');
            callback(player);
        }));
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

    function sendRequest(command, id, callback) {
        console.log('** ' + command + ' **');
        client.request(command, id, getPlayer(callback));
    };

    function getPlayer(callback) {
        return function (response) {
            var data = '';

            response.on('data', function (chunk) {
                data += chunk
            });

            response.on('end', function () {
                if (data) {
                    _player = JSON.parse(data);
                }
                else {
                    console.log('');
                    console.log('No response. Player not moved');
                    console.log('');
                    _player = {id: _player.id, name: _player.name, isIt: _player.isIt, players: []};
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