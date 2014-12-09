(function(client) {
	var http = require('http');

	var _host = '';

	client.init = function(host) {
		_host = host;
	};

	client.request = function(method, id, callback) {
		setTimeout(function(res) {
			var req = http.request(getOptions(_host, method, id), callback);
			req.end();
		}, 1000);
	};

	var getOptions = function(host, method, id) {
		return {
			host: host,
			path: '/' + method + '/' + id
		};
	};

})(module.exports);