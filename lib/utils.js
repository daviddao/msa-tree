var q = require("kew");
var xhr = require("xhr");
var _ = require("underscore");

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

// searches array for multiple attribute dictionary definitions (separately).
// returns the first match of a attribute dictionary 
utils.findMatching = function(arr, attrs) {
  var search, attr;
  for (var i = 0; i < attrs.length; i++) {
    attr = attrs[i];
    search = _.findWhere(arr, attr);
    if (typeof search !== "undefined") {
      break;
    }
  }
  return search;
};

module.exports = utils;
