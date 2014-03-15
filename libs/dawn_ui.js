#!/usr/bin/env node
var project = require('dawn-project');
function Server () {}
Server.prototype = {
  init: function initial ( env ) {
    'use strict';
    var root = this.root = env.parent.dir;
    var config = this.config = require(root + '/dawn-app.json');
    var app = this.app = project(config.webroot);
    // set view config (create an new server for active pages);
    app.set('views', config.views);
    // set static config (create an new server for combo or resource);
    app.set('statics', config.statics);
    // set view engine
    app.set('view engine', 'ejs');
    app.set('common', config.common);
    // set the database
    app.set('database', config.db);
    app.use(project.favicon());
    app.use(project.logger(env.parent.mode));
    app.use(project.json());
    app.use(project.urlencoded());
    app.use(project.methodOverride());
    app.use(project.router);
    if (env.mode === 'dev') {
      app.use(connect.errorHandler());
    }
    app.run();
  },
  start: function () {
    if (this.app.RUNNING) {
      return;
    }
    this.app.run();
  },
  stop: function () {
    if (this.app.RUNNING) {
      this.app.stop();
    }
  }
};
exports = module.exports = new Server();
exports.Server = Server;