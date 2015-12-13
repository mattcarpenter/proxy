var http = require('http');
var https = require('https');
var httpProxy = require('http-proxy');
var fs = require('fs');

var read = require('fs').readFileSync;
var privateKey = read('keys/key.pem', 'utf8');
var certificate = read('keys/mattcarpenter_io.crt', 'utf8');
var chainLines = read('keys/mattcarpenter_io.ca-bundle', 'utf8').split("\n");
var cert = [];
var ca = [];

chainLines.forEach(function(line) {
  cert.push(line);
  if (line.match(/-END CERTIFICATE-/)) {
    ca.push(cert.join("\n"));
    cert = [];
  }
});

var credentials = {
  "key": privateKey,
  "cert": certificate,
  "ca": ca
};

http.globalAgent.maxSockets = 200;

var server = http.createServer(onConnection);
var secureServer = https.createServer(credentials, onConnection);
var proxy = httpProxy.createProxyServer({});

server.listen(3000);
secureServer.listen(3001);

function onConnection(req, res) {
	console.log(req.url);
	try {
	proxy.web(req, res, {
		target: req.url
	});
	} catch (e) {
		console.log(e);
	}
}
