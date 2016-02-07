'use strict';

(function(game) {
    var client = require('./client');
    var config = require('./config');

    game.register = function (player, callback) {
        executeCommand('register', player, callback);
    };

    game.moveUp = function (player, callback) {
        executeCommand('moveUp', player, callback);
    };

    game.moveDown = function (player, callback) {
        executeCommand('moveDown', player, callback);
    };

    game.moveLeft = function (player, callback) {
        executeCommand('moveLeft', player, callback);
    };

    game.moveRight = function (player, callback) {
        executeCommand('moveRight', player, callback);
    };

    game.look = function (player, callback) {
        executeCommand('look', player, callback);
    };

    var executeCommand = function (command, player, callback) {
        setTimeout(function () {
            client.request(command, player.id, handleResponse(callback));
        }, 1001);
    };

    var handleResponse = function (callback) {
        return function (response) {
            var data = '';

            response
                .on('data', function (chunk) {
                    data += chunk
                })
                .on('end', function () {
                    callback(data);
                });
        };
    };

})(module.exports);