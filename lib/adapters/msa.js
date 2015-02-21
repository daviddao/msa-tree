var _ = require("underscore");
var View = require("backbone-viewj");
var msa = require("msa");
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
    var self = this;
    this.sel = data.sel;
    this.msa = new msa(props);
    this.msa.g.onAll(function(){
      console.log("msa", arguments);
    });
    var g = this.msa.g;
    g.on("row:click", function(e){
      // listen to msa selection evts
     this.sel.user().set("ids", [e.seqId]); 
    }.bind(this));
    this.sel.on("change:ids", function(){
      // updates the msa selection
      var ids = self.sel.user().get("ids");
      var rows = ids.map(function(id){
        return new msa.selection.rowsel({seqId: id});
      });
      self.msa.g.selcol.reset(rows);
    });
  },
  render: function(){
    this.msa.render();
  }
});
