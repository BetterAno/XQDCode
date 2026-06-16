var n = require("./b8e3.js");
var r = require("./63b6.js");
var o = require("./9138.js");
var i = require("./35e8.js");
var a = require("./481b.js");
var c = require("./8f60.js");
var g = require("./45f2.js");
var s = require("./53e2.js");
var u = require("./5168.js")("iterator");
var I = ![].keys || !("next" in [].keys());
var B = "keys";
var f = "values";
function C() {
  return this;
}
module.exports = function (A, t, e, E, l, Q, d) {
  c(e, t, E);
  var p;
  var h;
  var v;
  function y(A) {
    if (!I && A in D) {
      return D[A];
    }
    switch (A) {
      case B:
      case f:
        return function () {
          return new e(this, A);
        };
    }
    return function () {
      return new e(this, A);
    };
  }
  var m = t + " Iterator";
  var w = l == f;
  var b = false;
  var D = A.prototype;
  var k = D[u] || D["@@iterator"] || l && D[l];
  var S = k || y(l);
  var _ = l ? w ? y("entries") : S : undefined;
  var x = t == "Array" && D.entries || k;
  if (x) {
    if ((v = s(x.call(new A()))) !== Object.prototype && v.next) {
      g(v, m, true);
      if (!n && typeof v[u] != "function") {
        i(v, u, C);
      }
    }
  }
  if (w && k && k.name !== f) {
    b = true;
    S = function () {
      return k.call(this);
    };
  }
  if ((!n || !!d) && (!!I || !!b || !D[u])) {
    i(D, u, S);
  }
  a[t] = S;
  a[m] = C;
  if (l) {
    p = {
      values: w ? S : y(f),
      keys: Q ? S : y(B),
      entries: _
    };
    if (d) {
      for (h in p) {
        if (!(h in D)) {
          o(D, h, p[h]);
        }
      }
    } else {
      r(r.P + r.F * (I || b), t, p);
    }
  }
  return p;
};