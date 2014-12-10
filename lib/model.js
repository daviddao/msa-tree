var B = require("backbone-thin");
var FeatureCol = require("biojs-vis-msa/lib/model").featurecol;
var _ = require("underscore");

var node = B.Model.extend({
  defaults: {
    id: "",
  },
  initialize: function(dataObj) {
    this.set("childs", []);
    this.set("data", new data(dataObj));
  }
});

var nodes = B.Collection.extend({
  model: node,
  /*
  constructor: function(seqs){
    if(seqs === undefined) return;
    seqs = seqs.map(function(el){
      // check whether it is already a model
      if(el.constructor !== node.constructor){
        return new node(el);
      }
      return el;
    });
    B.Collection.call(this,seqs);
  }, */
  constructor: function(models,options){
    options || (options = {});
    if (options.model) this.model = options.model;
    if (options.comparator !== void 0) this.comparator = options.comparator;
    this._reset();
    if (models) this.reset(models, _.extend({silent: true}, options));
    // call the initialize method AFTER init
    this.initialize.apply(this, arguments);
  },
  initialize: function(seqs, treeData) {
    console.log("seqs", seqs);
    if (treeData !== undefined) {

    }
    //console.log(arguments);
  },
});

var data = B.Model.extend({
  defaults: {
    seq: "",
    name: "",
    hidden: false,
    seqHeight: 1,
    branchLength: 0
  },
  initialize: function() {
    this.set("grey", []);
    this.set("features", new FeatureCol());
  }
});

module.exports.node = node;
module.exports.data = data;
module.exports.nodes = nodes;
