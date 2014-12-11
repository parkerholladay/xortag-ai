'use strict';

(function(client) {
	var http = require('http');
	var config = require('./config');

	var _host = config.gameUrl;

	client.request = function(method, id, callback) {
		setTimeout(function(response) {
			try{
				var request = http.request(getOptions(_host, method, id), callback);
				request.end();
			} catch (err) {
				console.log(err);
				callback();
			}
		}, 1000);
	};

	var getOptions = function(host, method, id) {
		return {
			host: host,
			path: '/' + method + '/' + id
		};
	};

})(module.exports);