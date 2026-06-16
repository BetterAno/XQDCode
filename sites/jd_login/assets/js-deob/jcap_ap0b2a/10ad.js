var n;
var r = require("./7726.js");
var o = require("./0a49.js")(0);
var i = require("./2aba.js");
var a = require("./67ab.js");
var c = require("./7333.js");
var g = require("./643e.js");
var s = require("./d3f4.js");
var u = require("./b39a.js");
var I = require("./b39a.js");
var B = !r.ActiveXObject && "ActiveXObject" in r;
var f = "WeakMap";
var C = a.getWeak;
var E = Object.isExtensible;
var l = g.ufstore;
function Q(A) {
  return function () {
    return A(this, arguments.length > 0 ? arguments[0] : undefined);
  };
}
var d = {
  get: function (A) {
    if (s(A)) {
      var t = C(A);
      if (t === true) {
        return l(u(this, f)).get(A);
      } else if (t) {
        return t[this._i];
      } else {
        return undefined;
      }
    }
  },
  set: function (A, t) {
    return g.def(u(this, f), A, t);
  }
};
var p = module.exports = require("./e0b8.js")(f, Q, d, g, true, true);
if (I && B) {
  c((n = g.getConstructor(Q, f)).prototype, d);
  a.NEED = true;
  o(["delete", "has", "get", "set"], function (A) {
    var t = p.prototype;
    var e = t[A];
    i(t, A, function (t, r) {
      if (s(t) && !E(t)) {
        this._f ||= new n();
        var o = this._f[A](t, r);
        if (A == "set") {
          return this;
        } else {
          return o;
        }
      }
      return e.call(this, t, r);
    });
  });
}