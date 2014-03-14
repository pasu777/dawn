#!/usr/bin/env node
var express = require('express');
var fs = require('fs');
var path = require('path');
var util = require('./util.js');
function Server () {}
Server.prototype = {
  init: function initial ( env ) {
    'use strict';
    console.log(env, 'initial');
    var root = this.root = env.parent.dir;
    var config = this.config = require(root + '/dawn-app.json');
    var appConfig = config.app;
    var staticConfig = config.statics;
    var common = config.common;
    var app = this.app = express();
    if (!root || fs.existsSync(root)) {
      util.error('The webroot [%s] is not a valid root', root);
    }
    if (!common || fs.existsSync(root + '/' + common)) {
      util.error('common module [%s] is not exists.', common);
    }
    
  },
  start: function () {

  },
  stop: function () {

  }
};
exports = module.exports = new Server();
exports.Server = Server;