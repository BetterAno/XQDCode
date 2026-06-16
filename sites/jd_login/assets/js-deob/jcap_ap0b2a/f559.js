var n = require("./5ca1.js");
var r = require("./9def.js");
var o = require("./d2c8.js");
var i = "startsWith";
var a = ""[i];
n(n.P + n.F * require("./5147.js")(i), "String", {
  startsWith: function (A) {
    var t = o(this, A, i);
    var e = r(Math.min(arguments.length > 1 ? arguments[1] : undefined, t.length));
    var n = String(A);
    if (a) {
      return a.call(t, n, e);
    } else {
      return t.slice(e, e + n.length) === n;
    }
  }
});