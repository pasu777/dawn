#!/usr/bin/env node
var Request = require('./Request');
var Response = require('./Response');
var Helper = require('Helper');
function Action (method, path, handle, defaults) {
  this.method = method;
  this.path = path;
  this.handle = handle;
  this.defaults = defaults;
};
Action.prototype.dispath = function (req, res, next) {
  var req = new Request(req);
  var res = new Response(res);
  if (this._check && this._check(req)) {
    if (true === this.handle(req, res, next)) {
      next();
    }
  }
  this._check = Helper.help(this);
  this.dispath(req, res, next);
};

exports = module.exports = Action;
exports.helper = Helper.helper;
exports.Helper = Helper;