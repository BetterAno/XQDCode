var n = require("./cb7c.js");
var r = require("./9def.js");
var o = require("./0390.js");
var i = require("./5f1b.js");
require("./214f.js")("match", 1, function (A, t, e, a) {
  return [function (e) {
    var n = A(this);
    var r = e == null ? undefined : e[t];
    if (r !== undefined) {
      return r.call(e, n);
    } else {
      return new RegExp(e)[t](String(n));
    }
  }, function (A) {
    var t = a(e, A, this);
    if (t.done) {
      return t.value;
    }
    var c = n(A);
    var g = String(this);
    if (!c.global) {
      return i(c, g);
    }
    var s = c.unicode;
    c.lastIndex = 0;
    for (var u, I = [], B = 0; (u = i(c, g)) !== null;) {
      var f = String(u[0]);
      I[B] = f;
      if (f === "") {
        c.lastIndex = o(g, r(c.lastIndex), s);
      }
      B++;
    }
    if (B === 0) {
      return null;
    } else {
      return I;
    }
  }];
});