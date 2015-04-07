var _ = require("underscore");
var View = require("backbone-viewj");
var msa = require("msa");
var adapter;
var ignoredKeys = ["sel", "model"];

module.exports = adapter = View.extend({
  initialize: function(data) {
    // inject existing msa
    if (data.msa) {
      console.log("constructing msa");
      this.msa = data.msa;
    } else {
      var props = {
        seqs: data.model.models,
        el: this.el
      };
      // proxy other attributes to msa
      _.each(data, function(el, key) {
        if (!(key in props) && ignoredKeys.indexOf(key) < 0) {
          props[key] = el;
        }
      });
      // remove top collection
      _.each(props.seqs, function(e) {
        delete e.collection;
      });

      this.msa = new msa(props);
    }

    // global selection
    var self = this;
    this.sel = data.sel;

    // bind events
    this.msa.g.onAll(function() {
      //console.log("msa", arguments);
    });
    var g = this.msa.g;
    g.on("row:click", function(e) {
      // listen to msa selection evts
      this.sel.user().set("ids", [e.seqId], {origin: "msa"});
    }.bind(this));
    this.sel.on("change:ids", function(model, c, attrs) {
      if(attrs.origin == "msa"){
        return;
      }
      // updates the msa selection
      var ids = self.sel.user().get("ids");
      var rows = ids.map(function(id) {
        return new self.msa.m.selection.rowsel({
          seqId: id
        });
      });
      self.msa.g.selcol.reset(rows);
    });
  },
  render: function() {
    this.msa.render();
  }
});
