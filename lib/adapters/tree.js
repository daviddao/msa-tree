var _ = require("underscore");
var View = require("backbone-viewj");
var tree = require("tnt.tree");
var adapter;
d3 = require("d3");

module.exports = adapter = View.extend({
  initialize: function(data) {

    this.sel = data.sel;

    var treeData = nodes2Tree(data.model, data.model.at(0).get("id"));

    var tnt = tree.tree();
    tnt.data(treeData);
    tnt.label(tree.tree.label.text().height(20))

    tnt.on_click(function(node) {
      node.toggle();
      var nodeData = node.data();
      var b = nodeData.get("collapsed");
      if(b === undefined) b = false;
      toggleTree(nodeData, !b);
      tnt.update();
    });
    tnt(this.el);
    this.tnt = tnt;

    tree.onAll(function(){
      console.log("biojs", arguments);
    });
    tree.on("node:click", function(node){
     this.sel.user().set("ids", [node.get("id")]);
    }.bind(this));
  },
  render: function() {}
});

function nodes2Tree(nodes, current) {
  var root = nodes.findWhere({
    id: current
  });
  root.name = root.get("name");
  var branchLength = root.get("branchLength");
  if (branchLength !== undefined && branchLength !== 0) {
    root.branch_length = branchLength;
  }
  var childs = root.get("childs");
  if (childs !== undefined && childs.length > 0) {
    root.children = _.map(root.get("childs"), function(el) {
      return nodes2Tree(nodes, el);
    });
  }
  return root;
}

function toggleTree(node, b) {
  if(!(node.get("virtual"))){
    node.set("hidden", b);
  }
  node.set("collapsed", b);
  var childs = node._children || node.children;
  if (childs !== undefined && childs.length > 0) {
    childs.forEach(function(child) {
      toggleTree(child, b);
    });
  }
}
