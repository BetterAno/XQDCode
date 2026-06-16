var n = require("./07e3.js");
var r = require("./36c3.js");
var o = require("./5b4e.js")(false);
var i = require("./5559.js")("IE_PROTO");
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