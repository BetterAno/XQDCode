var n = require("./aae3.js");
var r = require("./cb7c.js");
var o = require("./ebd6.js");
var i = require("./0390.js");
var a = require("./9def.js");
var c = require("./5f1b.js");
var g = require("./520a.js");
var s = require("./79e5.js");
var u = Math.min;
var I = [].push;
var B = "split";
var f = "length";
var C = "lastIndex";
var E = 4294967295;
var l = !s(function () {
  RegExp(E, "y");
});
require("./214f.js")("split", 2, function (A, t, e, s) {
  var Q;
  Q = "abbc"[B](/(b)*/)[1] == "c" || "test"[B](/(?:)/, -1)[f] != 4 || "ab"[B](/(?:ab)*/)[f] != 2 || "."[B](/(.?)(.?)/)[f] != 4 || "."[B](/()()/)[f] > 1 || ""[B](/.?/)[f] ? function (A, t) {
    var r = String(this);
    if (A === undefined && t === 0) {
      return [];
    }
    if (!n(A)) {
      return e.call(r, A, t);
    }
    for (var o, i, a, c = [], s = (A.ignoreCase ? "i" : "") + (A.multiline ? "m" : "") + (A.unicode ? "u" : "") + (A.sticky ? "y" : ""), u = 0, B = t === undefined ? E : t >>> 0, l = new RegExp(A.source, s + "g"); (o = g.call(l, r)) && (!((i = l[C]) > u) || !(c.push(r.slice(u, o.index)), o[f] > 1 && o.index < r[f] && I.apply(c, o.slice(1)), a = o[0][f], u = i, c[f] >= B));) {
      if (l[C] === o.index) {
        l[C]++;
      }
    }
    if (u === r[f]) {
      if (!!a || !l.test("")) {
        c.push("");
      }
    } else {
      c.push(r.slice(u));
    }
    if (c[f] > B) {
      return c.slice(0, B);
    } else {
      return c;
    }
  } : "0"[B](undefined, 0)[f] ? function (A, t) {
    if (A === undefined && t === 0) {
      return [];
    } else {
      return e.call(this, A, t);
    }
  } : e;
  return [function (e, n) {
    var r = A(this);
    var o = e == null ? undefined : e[t];
    if (o !== undefined) {
      return o.call(e, r, n);
    } else {
      return Q.call(String(r), e, n);
    }
  }, function (A, t) {
    var n = s(Q, A, this, t, Q !== e);
    if (n.done) {
      return n.value;
    }
    var g = r(A);
    var I = String(this);
    var B = o(g, RegExp);
    var f = g.unicode;
    var C = (g.ignoreCase ? "i" : "") + (g.multiline ? "m" : "") + (g.unicode ? "u" : "") + (l ? "y" : "g");
    var d = new B(l ? g : "^(?:" + g.source + ")", C);
    var p = t === undefined ? E : t >>> 0;
    if (p === 0) {
      return [];
    }
    if (I.length === 0) {
      if (c(d, I) === null) {
        return [I];
      } else {
        return [];
      }
    }
    var h = 0;
    for (var v = 0, y = []; v < I.length;) {
      d.lastIndex = l ? v : 0;
      var m;
      var w = c(d, l ? I : I.slice(v));
      if (w === null || (m = u(a(d.lastIndex + (l ? 0 : v)), I.length)) === h) {
        v = i(I, v, f);
      } else {
        y.push(I.slice(h, v));
        if (y.length === p) {
          return y;
        }
        for (var b = 1; b <= w.length - 1; b++) {
          y.push(w[b]);
          if (y.length === p) {
            return y;
          }
        }
        v = h = m;
      }
    }
    y.push(I.slice(h));
    return y;
  }];
});