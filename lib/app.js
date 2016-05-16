var model = require("./model");
var utils = require("./utils");
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
  //seqs.map(function(el) {
  //// parseInt ? 
  //if (isNaN(el.id)) {
  //el.id = el.name.split("|")[0];
  //}
  //});
    
  var nodes = convert2Nodes(data.tree);

  nodes = new model.nodes(nodes);
  nodes.each(function(el) {
    
    var node_id = el.attributes.id;
    
    /*
     * Each sequence can have multiple 'ids' (from different databases).
     * It should be okay to assume that these ids are unique within 
     * those databases, so we can just check the node id against all 
     * the values in the seq.ids array.
     * 
     * An alternative would be to allow this method to be specified by
     * the user (according to their own sequence format)
     */ 
    var matchSeq = function(seq) {
      var ids = _.values( seq.ids ) || [];
      return _.find( ids, function(id) { return id == node_id } );
    };
    
    var seq = _.find( seqs, matchSeq );
    
    if (seq !== undefined) {
      var attributes = seq.attributes || seq;
      console.log( "found matching seq for node", node_id, seq );
      _.each(attributes, function(val, key) {
        if ( key != 'id' ) { // don't overwrite the id of this node
          el.set(key, val);
        }
      });
    } else {
      console.log( "failed to find matching seq for node", node_id );
      el.set("hidden", true);
    }
  });
  return nodes;
};

function convert2Nodes(tree) {
  var childs = [];
  var nodes = [];
  var virtual = false;
  tree.attributes = tree.attributes || {}; // have empty attributes (just in case)
  var name = tree.name || tree.attributes.id;
  if (name === undefined || name.length === 0) {
    virtual = true;
  }
  var node = new model.node({
    id: name || randomID(),
    childs: childs,
    virtual: virtual,
    hidden: virtual,
    name: ""
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

  var branchLength = tree.branch_length || tree.attributes.branch_length;
  if (branchLength) {
    node.set("branchLength", branchLength);
  }
  return nodes;
}

function randomID() {
  return Math.random().toString(36).substr(2, 9);
}

module.exports = app;
