#!/usr/bin/env node
var http = require('http');
var https = require('https');
var net = require('net');
var ws = require('ws');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
exports = module.exports = function createProject (webroot) {
  return new App(webroot);
};
exports.App = App;
exports.Router = Router;

function App (webroot) {
  this.webroot = webroot;
  this._attrs = {};
  EventEmitter.call(this);
}
util.inherit(App, EventEmitter);
var proto = App.prototype;
App.ALWAYS = '*';
App.INDEX = 'index';
App.COMMON = 'common';

proto.use = function (route, fn) {
  if (!route) {
    fn = route;
    route = App.ALWAYS;
  }

};
proto.handle = function (req, res, out) {

};
proto.set = function (attr, value) {

};
proto.RUNNING = 0;
proto.start = function () {
  this.RUNNING = 1;
  this._server.listen(this.port);
};
proto.stop = function () {
  this.RUNNING = 0;
  this._server.close();
};