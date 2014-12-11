var B = require("backbone-thin");
var selections = {};

var selection = B.Model.extend({
  defaults: {
    id: "",
    type: ""
  },
  initialize: function(){
    this.set("ids", []);
  },
});

var selections = B.Collection.extend({
  model: selection,
  hover: function() {
    return this.at(0);
  },
  user: function() {
    return this.at(1);
  },
  initialize: function(){
    this.add({type: "hover"});
    this.add({type: "user"});
    this.on("all", function(){
      console.log("sel", arguments);
    });
  }
});

module.exports = selections;
