var _ = require("underscore");
var View = require("backbone-viewj");
var msa = require("biojs-vis-msa");
var adapter;
var ignoredKeys = ["sel", "model"];

module.exports = adapter = View.extend({
  initialize: function(data){
    var props = {seqs: data.model.models, el: this.el};
    // proxy other attributes to msa
    _.each(data, function(el,key){
      if(!(key in props) && ignoredKeys.indexOf(key) < 0){
        props[key] = el;
      }
    });
    // remove top collection
    _.each(props.seqs,function(e){
      delete e.collection;
    });
    this.sel = data.sel;
    this.msa = new msa(props);
    this.msa.g.onAll(function(){
      console.log("msa", arguments);
    });
    var g = this.msa.g;
    g.on("row:click", function(e){
     this.sel.user().set("ids", [e.seqId]); 
    }.bind(this));
  },
  render: function(){
    this.msa.render();
  }
});
