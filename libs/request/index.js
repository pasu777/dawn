#!/usr/bin/env node
var ClientRequest = require('http').ClientRequest;
var url = require('url');
var path = require('path');
function Request (request) {
  this.request = request;
  this.parseURI();
  this.parseHeaders();
  this.parseBody();
  return this;
};
Request.prototype = {
  constructor: Request,
  _parse: function (str, sep, eq) {

  },
  parseURI: function () {
    var url = url.parse(this.request.url, true);
    url.params = this._parse(url.params);
    this.url = url;
  },
  parseHeaders: function () {
    var headers = this.headers = this.request.headers;
    this.cookie = this._parse(headers.cookie,';');
    var accept = this.accept = [];
    headers.accept.split(';').forEach(function (header) {
      accept.push.apply(accept, header.split(',').filter(function (mimetype) {
        return /^\s*[^;\s]*(?:;|\s|$)/.test(mimetype)
      }));
    });
  },
  parseBody: function () {

  }
};
exports = module.exports = Request;