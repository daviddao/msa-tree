var B = require("backbone-thin");
var selections = {};

var selection = B.Model.extend({
  defaults: {
    id: "",
    type: ""
  }
});

var selections = B.Collections.extend({
  model: selection,
  hover: function() {
    return null;
  },
  user: function() {
    return null;
  },
  initialize: function(){
    //TODO
  }
});

module.exports = selections;
