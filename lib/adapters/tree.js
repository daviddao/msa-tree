var View = require("backbone-viewj");
var tree = require("tnt.tree");
var adapter;
d3 = require("d3");

module.exports = adapter = View.extend({
  initialize: function(data){

    var tnt = tree.tree();
    this.tnt2 = tnt.data(data.tree);
    this.tnt = tnt(this.el);
  },
  render: function(){
  }
});
