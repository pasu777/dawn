#!/usr/bin/env node
var fs = require('fs');
var path = require('path');
var ncp = require('ncp');
var util = require('./util.js');
var tplRoot = path.resolve(__dirname + '/../tpls/');
function Project ( ) {}

Project.prototype = {
  constructor     : Project,
  init            : function init ( env, name ) {
    this.name     = name;
    this.env      = env;
    this.root     = env.parent.dir;
    this.prjFile  = path.resolve(this.root + '/dawn_app.json');
    this.tplRoot  = path.resolve(tplRoot + '/dawn_app_' + env.parent.mode);
    var self      = this;
    ncp(this.tplRoot, this.root, function copyHandle ( err ) {
      if ( err ) {
        util.puts(err);
        return util.error('Failed to copy the project templates');
      }
      self.config({
        name: name,
        webroot: self.root
      });
      util.puts('Init finished');
    });
  },
  config      : function config ( config ) {
    var prjFile = this.prjFile;
    var self = this;
    fs.stat(prjFile, function checkFile ( err, stats ) {
      if ( err ) {
        util.puts(__dirname + ' Notice: ');
        util.puts(err);
        util.puts('File not exists!');
        return self._writeProjectFile(config);
      }
      if ( stats.isFile() ) {
        self.config = require(prjFile);
      }
      fs.unlink(prjFile, function removePrjFile ( err ) {
        if ( err ) {
          util.puts('Remove file failed.');
          return util.puts(err);
        }
        self._mergeProjectFile(config);
      });
    });
  },
  _mergeProjectFile: function _mergeProjectFile ( config ) {
    var prj = this.config || require(prjFile);
    config = util.extend(prj, config);
    this._writeProjectFile(config);
  },
  _writeProjectFile: function _writeProjectFile ( config ) {
    this.config = config;
    var prjFile = this.prjFile;
    fs.writeFile(prjFile, JSON.stringify(config, null, 2), function _writeProjectFile ( err ) {
      if ( err ) {
        return util.error(err);
      }
      util.puts('Write project file finished');
    });
  }
};
exports = module.exports = new Project;