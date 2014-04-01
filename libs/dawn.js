#!/usr/bin/env node
'use strict';
var _ = require('underscore');
var fs = require('fs');
var path = require('path');
var packageInfo = require('../package.json');

var childProcess = require('child_process');
var numCPUs = require('os').cpus().length;

var http = require('http');
var https = require('https');
var net = require('net');

var Request = require(__dirname + '/request');
var Response = require(__dirname + '/response');

function App (server) {
  this.server = server;
  this.actions = [];
  this.requestCache = {};
  this.server.on('request', this.handle.bind(this));
  return this;
};
App.REQUEST_METHODS = {
  "all": "*",
  "get": "GET",
  "post": "POST",
  "put": "PUT",
  "head": "HEAD",
  "delete": "DELETE",
  "options": "OPTIONS",
  "copy": "COPY",
  "move": "MOVE",
  "lock": "LOCK",
  "unlock": "UNLOCK",  
  "report": "REPORT",
  "search": "SEARCH"
};
App.prototype._route = function (method, pathname, handle, defaults) {
  this.actions.push(new App.Action(method, pathname, handle, defaults));
  return this;
};
App.prototype.handle = function (req, res) {
  var index = 0;
  var actions = this.actions;
  var req = new Request(req);
  var res = new Response(res);
  function next (err) {
    if (err) {
      return res.send(err);
    }
    if (index >= actions.length) {
      return res.send(404);
    }
    var action = actions[index++];
    try {
      action.dispath(req, res, next);
    } catch (e) {
      next(e);
    }
  }
  next();
};
_.each(App.REQUEST_METHODS, function (method, name) {
  App.prototype[method] = function (pathname, handle, defaults) {
    this._route(name, path.resolve(pathname), handle, defaults);
  };
});
App.prototype.listen = function () {
  this.server.listen.apply(this.server, arguments);
  return this;
};
exports = module.exports = function createServer (isProtect, options) {
  if (isProtect) {
    var server = https.createServer(options);
  } else {
    var server = http.createServer();
  }
  var app = new App(server);
  if (process.connected) {
    console.log('Server worker PID: %s', process.pid);
    process.on("message", function messageHandle (msg, socket) {
      process.nextTick(function tickHandle () {
        if ('socket' === msg) {
          socket.readable = socket.writable = true;
          socket.resume();
          server.connections++;
          socket.server = server;
          server.emit("connection", socket);
          socket.emit("connect");
          return;
        }
      });
    });
    app.listen = function () {
      console.warn('Cluster worker don\'t neet listen anything.\n\r');
    };
  }
  return app;
};
exports.master = function (file) {
  var workers = [];
  for (var i = 0; i < numCPUs; i++) {
    var worker = childProcess.fork(file);
    workers.push(worker);
  }
  var server = this.server = net.createServer(function serverHandle (socket) {
    var worker = workers.shift();
    worker.send('socket', socket);
    workers.push(worker);
  });
  var app = new App(server);
  return app;
};

fs.readdirSync(__dirname + '/middleware').forEach(function(filename){
  if (/^_/.test(filename)) return;
  var name = filename.replace('.js', '');
  function load () { 
    return require(__dirname + '/middleware/' + name);
  }
  exports.__defineGetter__(name, load);
  App.__defineGetter__(name, load);
});