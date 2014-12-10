var B = require("backbone-thin");
var FeatureCol = require("biojs-vis-msa/lib/model").featurecol;

var node = B.Model.extend({
  defaults: {
    id: "",
  },
  initialize: function(dataObj){
    this.set("childs", new childs());
    this.set("data", new data(dataObj));
  }
});

var childs = B.Collection.extend({
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
  initialize: function(){
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
  initialize: function(){
    this.set("grey", []);
    this.set("features", new FeatureCol());
  }
});

module.exports.node = node;
module.exports.data = data;
module.exports.childs = childs;
