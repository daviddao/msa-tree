var chai = require("chai");
var assert = chai.assert;
var equal = assert.deepEqual;
var fs = require("fs");
var fasta = require("biojs-io-fasta").parse;
var newick = require("biojs-io-newick");

//var model = require("../lib/model");
require("./mochaFix.js"); // fix for solarized dark

describe("Model", function() {
  beforeEach(function(){
    var fastaSeq = fs.readFileSync(__dirname + "/dummy/dummy_msa.fasta", "utf8");
    var seqs = fasta.parse(fastaSeq);
    var newickRaw = fs.readFileSync( __dirname + "/dummy/dummy_newick.newick", "utf8");
    var treeData = newick.parse_newick(newickRaw);
    console.log(seqs);
    console.log(treeData);
  });
  describe("constructing", function() {
    it("constructing", function() {



    });
  });
});
