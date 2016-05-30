/* global yourDiv */
var msaDiv = document.createElement("div");
var menuDiv = document.createElement("div");
var treeDiv = document.createElement("div");

yourDiv.appendChild(menuDiv);
yourDiv.appendChild(msaDiv);
yourDiv.appendChild(treeDiv);

var combi = require("msa-tnt");
var model = combi.model;
var adapters = combi.adapters;
var selections = combi.selections;
var fasta = require("biojs-io-fasta").parse;
var newick = require("biojs-io-newick").parse_newick;
var msa = require("msa");

var sel = new selections();

combi.utils.xhr(["../test/dummy/dummy_msa.fasta", "../test/dummy/dummy_newick.newick"]).done(function(result) {

  var seqs = fasta(result[0]);
  var tree = newick(result[1]);

  var nodes = combi.app({
    seqs: seqs,
    tree: tree,
  });

  var m = new adapters.msa({
    model: nodes,
    el: msaDiv,
    sel: sel,
    colorscheme: {
      scheme: "clustal"
    }
  });
  m.msa.g.zoomer.set("alignmentHeight", 60);
  m.render();

  var t = new adapters.tree({
    model: nodes,
    el: treeDiv,
    sel: sel,
  });

  var menu = new msa.menu.defaultmenu({
    el: menuDiv,
    msa: m.msa
  });
  menu.render();
}, function(error) {
  console.error(error);
});
