var B = require("backbone-thin");
var FeatureCol = require("biojs-vis-msa").model.featurecol;

var node = B.Model.extend({
  defaults: {
    id: "",
  },
  initialize: function(){
    this.set("childs", new childs());
    this.set("data", new data());
  }
});

var childs = B.Collection.extend({
  model: node 
});

var data = B.Model.extend({
  defaults: {
    seq: "",
    name: "",
    hidden: false,
    seqHeight: 1,
    branchLength: 0 
  },
  initialize: function(){
    this.set("grey", []);
    this.set("features", new FeatureCol());
  }
});

module.exports.node = node;
module.exports.data = data;
module.exports.childs = childs;
