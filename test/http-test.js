var http = require('http');
var server = http.createServer().listen(8080);
var url = require('url');
var path = require('path');
var qs = require(path.resolve(__dirname + '/../libs/middleware/Action/Request/querystring.js'));
var bodyParser = require(path.resolve(__dirname+ '/../libs/middleware/Action/Request/body-parser.js'));
function Req (request) {
  console.dir(request);
// failed to use proto;
  this.__proto__ = request;
  var parsed = url.parse(request.url, true);
  // this._request = request;
  this.method = request.method.toLowerCase();
  this.headers = request.headers;
  this.mime = (request.headers['accept'] || '').split(';');
  this.url = request.url;
  this.pathname = parsed.pathname;
  this.hash = parsed.hash;
  this.params = qs.parse(parsed.query);
  this.files = request.files;
  this.body = request.body;
  this.post = request.post;
  this.cookie = qs.parse(request.cookie, ';');
  bodyParser(this);
  return this;

}
server.on('request', function (req, res) {
  try {
    req = new Req(req);
    console.dir(req);
    res.end('t');
  } catch(e) {
    console.log(e);
    res.end('error');
  }
});