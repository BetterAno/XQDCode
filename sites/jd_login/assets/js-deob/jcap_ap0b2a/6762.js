var n = require("./5ca1.js");
var r = require("./c366.js")(true);
n(n.P, "Array", {
  includes: function (A) {
    return r(this, A, arguments.length > 1 ? arguments[1] : undefined);
  }
});
require("./9c6c.js")("includes");