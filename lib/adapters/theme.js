
var tnt_theme = function() {

  var tnt = require("tnt.tree");
  //d3 = require("d3");
  var mytheme = function(tree, div) {

    var image_label = tnt.tree.label.img()
          .src(function(node) {
            if(node.is_leaf()) {
              var sp_name = node.node_name();
            }
            return (pics[sp_name.substr(0,1).toUpperCase() + sp_name.substr(1)]);
          }
        })
          .width(function() {
            return 30;
          })
          .height(function() {
            return 40;
          });

      var original_label = tnt.tree.label.text()
            .text(function (node) {
              if(node.is_leaf()) {
                return node.node_name();
              }
            }).fontsize(14);

      var joined_label = tnt.tree.label.composite()
            .add_label(image_label)
            .add_label(original_label);



  }

}