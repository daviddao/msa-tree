var _ = require("underscore");
var View = require("backbone-viewj");
var msa = require("biojs-vis-msa");
var adapter;
var ignoredKeys = ["sel"];

module.exports = adapter = View.extend({
  initialize: function(data){
    var seqs = this.model.map(function(el){
      el.get("data").set("id", el.get("id"));
      return el.get("data");
    });
    console.log(seqs);
    var props = {seqs: seqs, el: this.el};
    // proxy other attributes to msa
    _.each(data, function(el,key){
      if(!(key in props) && ignoredKeys.indexOf(key) < 0){
        props[key] = el;
      }
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
