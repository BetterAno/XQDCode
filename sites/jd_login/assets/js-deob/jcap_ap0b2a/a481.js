var n = require("./cb7c.js");
var r = require("./4bf8.js");
var o = require("./9def.js");
var i = require("./4588.js");
var a = require("./0390.js");
var c = require("./5f1b.js");
var g = Math.max;
var s = Math.min;
var u = Math.floor;
var I = /\$([$&`']|\d\d?|<[^>]*>)/g;
var B = /\$([$&`']|\d\d?)/g;
function f(A) {
  if (A === undefined) {
    return A;
  } else {
    return String(A);
  }
}
require("./214f.js")("replace", 2, function (A, t, e, C) {
  return [function (n, r) {
    var o = A(this);
    var i = n == null ? undefined : n[t];
    if (i !== undefined) {
      return i.call(n, o, r);
    } else {
      return e.call(String(o), n, r);
    }
  }, function (A, t) {
    var r = C(e, A, this, t);
    if (r.done) {
      return r.value;
    }
    var u = n(A);
    var I = String(this);
    var B = typeof t == "function";
    if (!B) {
      t = String(t);
    }
    var l = u.global;
    if (l) {
      var Q = u.unicode;
      u.lastIndex = 0;
    }
    var d = [];
    while (true) {
      var p = c(u, I);
      if (p === null) {
        break;
      }
      d.push(p);
      if (!l) {
        break;
      }
      if (String(p[0]) === "") {
        u.lastIndex = a(I, o(u.lastIndex), Q);
      }
    }
    var h = "";
    var v = 0;
    for (var y = 0; y < d.length; y++) {
      p = d[y];
      var m = String(p[0]);
      var w = g(s(i(p.index), I.length), 0);
      var b = [];
      for (var D = 1; D < p.length; D++) {
        b.push(f(p[D]));
      }
      var k = p.groups;
      if (B) {
        var S = [m].concat(b, w, I);
        if (k !== undefined) {
          S.push(k);
        }
        var _ = String(t.apply(undefined, S));
      } else {
        _ = E(m, I, w, b, k, t);
      }
      if (w >= v) {
        h += I.slice(v, w) + _;
        v = w + m.length;
      }
    }
    return h + I.slice(v);
  }];
  function E(A, t, n, o, i, a) {
    var c = n + A.length;
    var g = o.length;
    var s = B;
    if (i !== undefined) {
      i = r(i);
      s = I;
    }
    return e.call(a, s, function (e, r) {
      var a;
      switch (r.charAt(0)) {
        case "$":
          return "$";
        case "&":
          return A;
        case "`":
          return t.slice(0, n);
        case "'":
          return t.slice(c);
        case "<":
          a = i[r.slice(1, -1)];
          break;
        default:
          var s = +r;
          if (s === 0) {
            return e;
          }
          if (s > g) {
            var I = u(s / 10);
            if (I === 0) {
              return e;
            } else if (I <= g) {
              if (o[I - 1] === undefined) {
                return r.charAt(1);
              } else {
                return o[I - 1] + r.charAt(1);
              }
            } else {
              return e;
            }
          }
          a = o[s - 1];
      }
      if (a === undefined) {
        return "";
      } else {
        return a;
      }
    });
  }
});