#!/usr/bin/env node
module.exports = process.env.EXPRESS_COV
  ? require('./cov/project.js')
  : require('./libs/project.js');