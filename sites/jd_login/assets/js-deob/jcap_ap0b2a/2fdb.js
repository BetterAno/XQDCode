var n = require("./5ca1.js");
var r = require("./d2c8.js");
var o = "includes";
n(n.P + n.F * require("./5147.js")(o), "String", {
  includes: function (A) {
    return !!~r(this, A, o).indexOf(A, arguments.length > 1 ? arguments[1] : undefined);
  }
});