'use strict';

(function(client) {
	var http = require('http');
	var config = require('./config');

	var _host = config.gameUrl;

	client.request = function(method, id, callback) {
		setTimeout(function(response) {
			var request = http.request(getOptions(_host, method, id), callback);
			request.end();
		}, 1000);
	};

	function getOptions(host, method, id) {
		return {
			host: host,
			path: '/' + method + '/' + id
		};
	};

})(module.exports);