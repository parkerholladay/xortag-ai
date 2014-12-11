'use strict';

(function(game) {
    var client = require('./client');
    var config = require('./config');

    var _player = {};

    game.start = function(callback) {
        client.request('register', 0, getPlayer(function(player) {
            console.log('');
            console.log('You successfully registered at ' + config.gameUrl);
            console.log('');
            console.log('');
            console.log('Your player name is ' + player.name + '; id: ' + player.id);
            console.log('');
            callback(player);
        }));
    };

    game.moveUp = function(id, callback) {
        console.log('** moving up **');
        client.request('moveUp', id, getPlayer(callback));
    };

    game.moveDown = function(id, callback) {
        console.log('** moving down **');
        client.request('moveDown', id, getPlayer(callback));
    };

    game.moveLeft = function(id, callback) {
        console.log('** moving left **');
        client.request('moveLeft', id, getPlayer(callback));
    };

    game.moveRight = function(id, callback) {
        console.log('** moving right **');
        client.request('moveRight', id, getPlayer(callback));
    };

    game.look = function(id, callback) {
        console.log('** looking **');
        client.request('look', id, getPlayer(callback));
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
                    console.log('');
                    console.log('No response. Player not moved');
                    console.log('');
                    _player = {id: _player.id, name: _player.name, isIt: _player.isIt, players: []};
                }

                if (callback) callback(_player);
            });
        };
    };

})(module.exports);