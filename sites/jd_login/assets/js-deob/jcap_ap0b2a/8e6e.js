var n = require("./5ca1.js");
var r = require("./990b.js");
var o = require("./6821.js");
var i = require("./11e9.js");
var a = require("./f1ae.js");
n(n.S, "Object", {
  getOwnPropertyDescriptors: function (A) {
    var t;
    var e;
    var n = o(A);
    var c = i.f;
    for (var g = r(n), s = {}, u = 0; g.length > u;) {
      if ((e = c(n, t = g[u++])) !== undefined) {
        a(s, t, e);
      }
    }
    return s;
  }
});