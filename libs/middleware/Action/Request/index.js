#!/usr/bin/env node
var ClientRequest = require('http').ClientRequest;
var url = require('url');
var bodyParser = require(__dirname + '/body-parser.js');
var qs = require(__dirname + '/querystring.js');
function Request (request) {
  var parsed = url.parse(request.url, true);
  this._request = request;
  this.method = request.method.toLowerCase();
  this.headers = request.headers;
  this.mime = (require.headers['Content-Type'] || '').split(';');
  this.url = request.url;
  this.pathname = parsed.pathname;
  this.hash = parsed.hash;
  this.params = qs.parse(parsed.query);
  this.files = request.files;
  this.body = request.body;
  this.post = request.post;
  this.cookie = qs.parse(request.cookie, ';');
  bodyParser.parse(this);
  return this;
};
Request.prototype.__proto__ = ClientRequest.prototype;
exports = module.exports = Request;