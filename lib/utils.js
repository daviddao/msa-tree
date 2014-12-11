var q = require("kew");
var xhr = require("xhr");

var utils = {};

utils._xhr = function(url) {
  var p = q.defer();
  xhr(url, function(err, resp, body) {
    if (err) {
      p.reject(err);
      return;
    }
    p.resolve(body);
  });
  return p.promise;
};

// a super amazing method to return a promise of multiple ajax requests
utils.xhr = function(arr) {
  // support only one url
  if (!Array.isArray(arr)) arr = [arr];
  return q.all(arr.map(utils._xhr));
};

module.exports = utils;
