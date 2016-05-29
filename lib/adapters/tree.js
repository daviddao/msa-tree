var _ = require("underscore");
var View = require("backbone-viewj");
var tnt = require("tnt.tree");
var adapter;
d3 = require("d3");

module.exports = adapter = View.extend({
  initialize: function(data) {

    this.sel = data.sel;

    var treeData = nodes2Tree(data.model, data.model.at(0).get("id"));

    //====== Tree Stuff ======
    var tree = tnt();
    tree.data(treeData);

    /*
    var image_label = tnt.tree.label.img()
            .src(function(node) {
    if(node.is_leaf()) {
      var sp_name = node.node_name();
             return (pics[sp_name.substr(0,1).toUpperCase() + sp_name.substr(1)]);
              }
            })
            .width(function() {
              return 30;
            })
            .height(function() {
              return 40;
            });
    */

    var original_label = tnt.label.text()
          .text(function (node) {
            if(node.is_leaf()) {
              return node.node_name();
            }
          }).fontsize(14);

    var joined_label = tnt.label.composite()
          //.add_label(image_label)
          .add_label(original_label);

    tree.label(joined_label);

    //Node Stuff
    var node_size = 5;
    var selected_node_size = 5;
	var node_fill="black";
	var node_stroke="black";
	var selected_node_fill="steelblue";
	var expanded_node = tnt.node_display.circle()
	    .size(node_size)
	    .fill(node_fill)
	    .stroke(node_stroke);

	var collapsed_node = tnt.node_display.triangle()
	    .size(node_size)
	    .fill(node_fill)
	    .stroke(node_stroke)

	var selected_node = tnt.node_display.circle()
		.size(selected_node_size)
		.fill(selected_node_fill)
		.stroke(node_stroke)

	var node_display = tnt.node_display()
    .display(function(node){
      if(node.is_collapsed()) {
        collapsed_node.display().call(this, node);
      } else {
        expanded_node.display().call(this, node);
      }

      if(node.property('selected') === true) {
        selected_node.display().call(this, node);
      }
    });

	tree.node_display(node_display);
	//End Node Stuff

    tree.layout(tnt.layout.vertical().width(500));

    tree.on('click', function(node) {
      if(!node.is_leaf() || (node.n_hidden() > 0)) {
        node.toggle();
        tree.update();
      } else {
      	toggleClick(node);
      	tree.update();
      }
    });
    tree(this.el);
    this.tree = tree;

    function toggleClick(node) {
    	if(node.property('selected')) {
    		node.property('selected',false);
    	} else {
    		node.property('selected',true);
    	}
    }

    //====== End of Tree Stuff ======

    tnt.onAll(function(){
      //console.log("tree", arguments);
    });
    tnt.on("node:click", function(node){

      if(!node.is_leaf()  || (node.n_hidden() > 0)) {
        var nodeData = node.data();
        var b = nodeData.get("collapsed");
        if(b === undefined) b = false;
        toggleTree(nodeData, !b);
      } else {
      	var nodeData = node.data();
      	console.log(nodeData);
      	this.sel.user().set("ids", [nodeData.id]);
      }

    }.bind(this));

    var self = this;

    this.sel.user().on("change:ids", function(){

    	var ids = self.sel.user().get("ids");
        var root = tree.root();
        var nodes = root.get_all_leaves();

      _.each(nodes, function(d) {
        var nodeData = d.data();
        d.property('selected',false);
      	_.each(ids,function(id){
        		if(nodeData.id === id) {

        			d.property('selected',true);
        		}
        	})
      	});
    	tree.update();
    });
  },
  render: function() {}
});

function nodes2Tree(nodes, current) {
  var root = nodes.findWhere({
    id: current
  });
  if(root == undefined){
    root = nodes.findWhere({
      name: current
    });
  }
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
