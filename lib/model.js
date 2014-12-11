var B = require("backbone-thin");
var FeatureCol = require("biojs-vis-msa/lib/model").featurecol;
var _ = require("underscore");

var node = B.Model.extend({
  defaults: {
    seq: "",
    name: "",
    hidden: false,
    seqHeight: 1,
    branchLength: 0,
    id: "",
  },
  initialize: function() {
    this.set("childs", []);
    this.set("grey", []);
    this.set("features", new FeatureCol());
  }
});

var nodes = B.Collection.extend({
  model: node,
  constructor: function(models, options) {
    options || (options = {});
    if (options.model) this.model = options.model;
    if (options.comparator !== void 0) this.comparator = options.comparator;
    this._reset();
    if (models) this.reset(models, _.extend({
      silent: true
    }, options));
    // call the initialize method AFTER init
    this.initialize.apply(this, arguments);
  },
  // logic moved to app.js
  //initialize: function(seqs, treeData) {},
});

module.exports.node = node;
module.exports.nodes = nodes;
