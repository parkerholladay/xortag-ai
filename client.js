'use strict';

(function(client) {
	var http = require('http');
	var config = require('./config');

	client.request = function (method, id, callback) {
		http.request(getOptions(config.gameUrl, method, id), callback)
			.on('error', function (e) {
				console.log('Error: ' + e.message);
				callback();
			}).end();
	};

	var getOptions = function (host, method, id) {
		return {
			hostname: host,
			path: '/' + method + '/' + id,
			method: 'GET'
		};
	};

})(module.exports);