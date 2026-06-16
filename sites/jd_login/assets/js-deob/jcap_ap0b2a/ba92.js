var n = require("./4bf8.js");
var r = require("./77f1.js");
var o = require("./9def.js");
module.exports = [].copyWithin || function (A, t) {
  var e = n(this);
  var i = o(e.length);
  var a = r(A, i);
  var c = r(t, i);
  var g = arguments.length > 2 ? arguments[2] : undefined;
  var s = Math.min((g === undefined ? i : r(g, i)) - c, i - a);
  var u = 1;
  for (c < a && a < c + s && (u = -1, c += s - 1, a += s - 1); s-- > 0;) {
    if (c in e) {
      e[a] = e[c];
    } else {
      delete e[a];
    }
    a += u;
    c += u;
  }
  return e;
};