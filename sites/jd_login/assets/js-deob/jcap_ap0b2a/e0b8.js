var n = require("./7726.js");
var r = require("./5ca1.js");
var o = require("./2aba.js");
var i = require("./dcbc.js");
var a = require("./67ab.js");
var c = require("./4a59.js");
var g = require("./f605.js");
var s = require("./d3f4.js");
var u = require("./79e5.js");
var I = require("./5cc5.js");
var B = require("./7f20.js");
var f = require("./5dbc.js");
module.exports = function (A, t, e, C, E, l) {
  var Q = n[A];
  var d = Q;
  var p = E ? "set" : "add";
  var h = d && d.prototype;
  var v = {};
  function y(A) {
    var t = h[A];
    o(h, A, A == "delete" || A == "has" ? function (A) {
      return (!l || !!s(A)) && t.call(this, A === 0 ? 0 : A);
    } : A == "get" ? function (A) {
      if (l && !s(A)) {
        return undefined;
      } else {
        return t.call(this, A === 0 ? 0 : A);
      }
    } : A == "add" ? function (A) {
      t.call(this, A === 0 ? 0 : A);
      return this;
    } : function (A, e) {
      t.call(this, A === 0 ? 0 : A, e);
      return this;
    });
  }
  if (typeof d == "function" && (l || h.forEach && !u(function () {
    new d().entries().next();
  }))) {
    var m = new d();
    var w = m[p](l ? {} : -0, 1) != m;
    var b = u(function () {
      m.has(1);
    });
    var D = I(function (A) {
      new d(A);
    });
    var k = !l && u(function () {
      var A = new d();
      for (var t = 5; t--;) {
        A[p](t, t);
      }
      return !A.has(-0);
    });
    if (!D) {
      d = t(function (t, e) {
        g(t, d, A);
        var n = f(new Q(), t, d);
        if (e != null) {
          c(e, E, n[p], n);
        }
        return n;
      });
      d.prototype = h;
      h.constructor = d;
    }
    if (b || k) {
      y("delete");
      y("has");
      if (E) {
        y("get");
      }
    }
    if (k || w) {
      y(p);
    }
    if (l && h.clear) {
      delete h.clear;
    }
  } else {
    d = C.getConstructor(t, A, E, p);
    i(d.prototype, e);
    a.NEED = true;
  }
  B(d, A);
  v[A] = d;
  r(r.G + r.W + r.F * (d != Q), v);
  if (!l) {
    C.setStrong(d, A, E);
  }
  return d;
};