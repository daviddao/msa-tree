var _ = require("underscore");
var View = require("backbone-viewj");
var tnt = require("tnt.tree");
var adapter;
d3 = require("d3");

module.exports = adapter = View.extend({
  initialize: function(data) {

    this.sel = data.sel;

    var treeData = nodes2Tree(data.model, data.model.at(0).get("id"));

    var tree = tnt.tree();
    tree.data(treeData);
    tree.label(tnt.tree.label.text().height(20));
    tree.layout(tnt.tree.layout.vertical().width(500));

    tree.on_click(function(node) {
      if(!node.is_leaf() || (node.n_hidden() > 0)) {
        console.log(node.n_hidden());
        node.toggle();
        var nodeData = node.data();
        var b = nodeData.get("collapsed");
        if(b === undefined) b = false;
        toggleTree(nodeData, !b);
        tree.update();
      }
    });
    tree(this.el);
    this.tree = tree;

    tnt.onAll(function(){
      console.log("tree", arguments);
    });
    tnt.on("node:click", function(node){
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
