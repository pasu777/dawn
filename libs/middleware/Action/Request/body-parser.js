var qs = require(__dirname + '/querystring.js');
exports = module.exports = function bodyParser (req) {
  if (
    req.body ||
    'get' == req.method ||
    'head' == req.method
  ) {
    return;
  }
  req.body = {};
  var mime = req.mime[0];
  var parse = exports[mime];
  if (parse) {
    parse(req);
  }
};

/**
 * Parse application/x-www-form-urlencoded.
 */

exports['application/x-www-form-urlencoded'] =
exports['multipart/form-data'] = function(req){
  try {
    req.post = req.body = req.post.length
      ? qs.parse(req.post)
      : {};
  } catch (err){
    // TODO ?
    console.log("[AppJS] couldn't parse x-www-form-urlencoded");
  }
};

/**
 * Parse application/json.
 */

exports['application/json'] = function(req){
  try {
    req.post = req.body = req.post.length
      ? JSON.parse(req.post)
      : {};
  } catch (err){
    console.log("[AppJS] couldn't parse application/json");
  }
};