var model = require("./model");
var _ = require("underscore");

var app = function(data) {
  if (!("tree" in data)) {
    console.warn("no newick file given");
    return;
  }
  if (!("seqs" in data)) {
    console.warn("no seqs given");
    return;
  }
  var seqs = data.seqs;
  // TODO: check equality
  // map seqs to fit
  seqs.map(function(el) {
    // parseInt ? 
    el.id = el.name.split("|")[0];
  });
  console.log(data.tree);
  var nodes = convert2Nodes(data.tree);
  nodes = new model.nodes(nodes);
  nodes.each(function(el) {
    var search = _.findWhere(seqs, {
      id: el.attributes.id
    });
    if (search !== undefined) {
      var dat = new model.data(_.extend(el.get("data").toJSON(), search));
      el.set("data", dat);
    }
  });
  return nodes;
};

function convert2Nodes(tree) {
  var childs = [];
  var nodes = [];
  var virtual = false;
  if (tree.name === undefined || tree.name.length === 0) {
    virtual = true;
  }
  var node = new model.node({
    id: tree.name || randomID(),
    childs: childs,
  });
  nodes.push(node);
  if (tree.children !== undefined) {
    tree.children.forEach(function(el) {
      var childNode = convert2Nodes(el);
      childs.push(childNode[0].get("id"));
      nodes.push.apply(nodes, childNode);
    });
  }
  node.set("childs", childs);
  node.set("data", new model.data({
    virtual: virtual,
    hidden: virtual,
    name: ""
  }));

  if(tree.branch_length){
    node.get("data").set("branchLength", tree.branch_length);
  }
  return nodes;
}

function randomID() {
  return Math.random().toString(36).substr(2, 9);
}

module.exports = app;
