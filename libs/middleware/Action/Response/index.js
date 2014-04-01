#!/usr/bin/env node
var http = require('http');
var ServerResponse = http.ServerResponse;
var STATUS_CODES   = http.STATUS_CODES;
var mime = require('mime');
var fs = require('fs');
function Response (response, view) {
  this._response = response;
  this.view = view;
  return this;
}
Response.prototype.__proto__ = ServerResponse.prototype;
Response.prototype.status = function (status) {
  this.statusCode = status;
  return this;
};
Response.prototype.end = 
Response.prototype.send = function send(statusCode, mimetype, data) {
  // rename the 'status' property in order to use 'status' function
  if (arguments.length === 1) {
    if (typeof status === 'number') {
      this.statusCode = status;
    } else {
      this.mimetype = 'text/html';
      this.data = status;
    }
  } else if (arguments.length === 2){
    this.statusCode = status;
    this.data = Buffer.isBuffer(mimetype) ? mimetype : new Buffer(mimetype);
  } else {
    this.statusCode = status;
    this.mimetype = mimetype;
    this.data = Buffer.isBuffer(data) ? data : new Buffer(data);
  }

  this.dispatch();
};
Response.prototype.dispatch = function () {
  this.statusCode    || (this.statusCode = 200);
  this.mimetype  || (this.mimetype = 'text/html');
  this.data      || (this.data = EMPTY);
  this.responseCode = STATUS_CODES[this.statusCode];

  if (!Buffer.isBuffer(this.data)) {
    if (this.data !== null && typeof this.data === 'object') {
      this.mimetype = 'application/json';
      this.data = new Buffer(JSON.stringify(this.data));
    } else if (typeof this.data === 'string' || typeof this.data === 'number') {
      this.data = new Buffer(this.data);
    } else {
      this.data = EMPTY;
    }
  }

  this.headers.setHeader('Content-Length', this.data.length);
  this.headers.setHeader('Content-Type', this.mimetype);
  this.callback(this.statusCode, this.responseCode, this.mimetype, this.headers.toArrays(), this.data);
};
Response.prototype.redirect = function redirect(destination){
  this.statusCode = 302;
  this.setHeader('Location', url.resolve(this.request.headers.Referer, destination));
  this.dispatch();
  return this;
};
Response.prototype.setHeader = function setHeader(name, header) {
  this.headers.setHeader(name, header);
};
Response.prototype.sendFile = function sendFile (status, filepath) {
  var res = this;
  this._load(filepath, function (buffer, mime) {
      return res.send(status, mime, buffer);
  });
};
Response.prototype._load = function _load(filepath, handle) {
  var res = this;
  fs.stat(filepath, function(err, stat){
      if (err || !stat.isFile()) {
        res.send(404);
      } else {
        var mime = mime.lookup(filepath);
        fs.readFile(self.path, function(err, buffer){
          if (err) {
            res.send(500);
          } else {
            handle(buffer, mime);
          }
        });
      }
    });
};
Response.prototype.render = function render (status, filepath, scope) {
  var res = this;
  this._load(filepath, function (buffer, mime) {
    res.send(status, mime, res.view(buffer, scope));
  });
};
module.exports = Response;