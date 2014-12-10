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
var fasta = require("biojs-io-fasta").parse;
var msa = require("biojs-vis-msa");

fasta.read("../test/dummy/dummy_msa.fasta", function(seqs){
  var nodes = new model.nodes(seqs);
  console.log(nodes);
  var m = new adapters.msa({model: nodes, el: msaDiv, colorscheme: {scheme: "clustal"}});
  m.render();
  var menu = new msa.menu.defaultmenu({el: menuDiv, msa: m.msa});
  menu.render();
});

