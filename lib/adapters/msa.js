var View = require("backbone-viewj");
var msa = require("biojs-vis-msa");
var adapter;

module.exports = adapter = View.extend({
  initialize: function(){
    var seqs = this.model.map(function(el){
      el.get("data").set("id", el.get("id"));
      return el.get("data");
    });
    console.log(seqs);
    this.msa = new msa({seqs: seqs, el: this.el});
  },
  render: function(){
    this.msa.render();
  }
});
