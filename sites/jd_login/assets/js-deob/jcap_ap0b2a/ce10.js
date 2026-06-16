var n = require("./69a8.js");
var r = require("./6821.js");
var o = require("./c366.js")(false);
var i = require("./613b.js")("IE_PROTO");
module.exports = function (A, t) {
  var e;
  var a = r(A);
  var c = 0;
  var g = [];
  for (e in a) {
    if (e != i && n(a, e)) {
      g.push(e);
    }
  }
  while (t.length > c) {
    if (n(a, e = t[c++])) {
      if (!~o(g, e)) {
        g.push(e);
      }
    }
  }
  return g;
};