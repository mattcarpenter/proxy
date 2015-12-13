var http = require('http');
var https = require('https');
var httpProxy = require('http-proxy');
var fs = require('fs');

var proxy = httpProxy.createProxyServer({});

var options = {
	key: fs.readFileSync('keys/key.pem'),
	cert: fs.readFileSync('keys/cert.pem')
};

var server = http.createServer(onConnection);
var secureServer = https.createServer(options, onConnection);

server.listen(3000);
secureServer.listen(3001);

function onConnection(req, res) {
	console.log(req.url);
	proxy.web(req, res, {
		target: req.url
	});
}
