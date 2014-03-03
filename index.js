#!/usr/bin/env node
module.exports = process.env.DAWN_COV ? 
  require('./lib/cov/dawn') : 
  require('./bin/dawn');