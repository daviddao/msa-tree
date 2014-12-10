var _ = require("underscore");
var View = require("backbone-viewj");
var msa = require("biojs-vis-msa");
var adapter;

module.exports = adapter = View.extend({
  initialize: function(data){
    var seqs = this.model.map(function(el){
      el.get("data").set("id", el.get("id"));
      return el.get("data");
    });
    console.log(seqs);
    var props = {seqs: seqs, el: this.el};
    // proxy other attributes
    _.each(data, function(el,key){
      if(!(key in props)){
        props[key] = el;
      }
    });
    this.msa = new msa(props);
  },
  render: function(){
    this.msa.render();
  }
});
