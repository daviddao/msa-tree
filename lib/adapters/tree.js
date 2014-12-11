var _ = require("underscore");
var View = require("backbone-viewj");
var tree = require("tnt.tree");
var adapter;
d3 = require("d3");

module.exports = adapter = View.extend({
  initialize: function(data) {

    var treeData = nodes2Tree(data.model, data.model.at(0).get("id"));

    var tnt = tree.tree();
    this.tnt2 = tnt.data(treeData);

    tnt.on_click(function(node) {
      console.log(node);
      node.toggle();
      var nodeData = node.data();
      var b = nodeData.get("data").get("collapsed");
      if(b === undefined) b = false;
      toggleTree(nodeData, !b);
      tnt.update();
    });
    tnt(this.el);
    this.tnt = tnt;
  },
  render: function() {}
});

function nodes2Tree(nodes, current) {
  var root = nodes.findWhere({
    id: current
  });
  //root._id = root.get("id");
  root.name = root.get("data").get("name");
  var branchLength = root.get("data").get("branchLength");
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
  if(!(node.get("data").get("virtual"))){
    node.get("data").set("hidden", b);
  }
  node.get("data").set("collapsed", b);
  var childs = node._children || node.children;
  if (childs !== undefined && childs.length > 0) {
    childs.forEach(function(child) {
      toggleTree(child, b);
    });
  }
}
