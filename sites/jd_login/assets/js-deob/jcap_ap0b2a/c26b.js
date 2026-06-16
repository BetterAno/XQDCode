var n = require("./86cc.js").f;
var r = require("./2aeb.js");
var o = require("./dcbc.js");
var i = require("./9b43.js");
var a = require("./f605.js");
var c = require("./4a59.js");
var g = require("./01f9.js");
var s = require("./d53b.js");
var u = require("./7a56.js");
var I = require("./9e1e.js");
var B = require("./67ab.js").fastKey;
var f = require("./b39a.js");
var C = I ? "_s" : "size";
function E(A, t) {
  var e;
  var n = B(t);
  if (n !== "F") {
    return A._i[n];
  }
  for (e = A._f; e; e = e.n) {
    if (e.k == t) {
      return e;
    }
  }
}
module.exports = {
  getConstructor: function (A, t, e, g) {
    var s = A(function (A, n) {
      a(A, s, t, "_i");
      A._t = t;
      A._i = r(null);
      A._f = undefined;
      A._l = undefined;
      A[C] = 0;
      if (n != null) {
        c(n, e, A[g], A);
      }
    });
    o(s.prototype, {
      clear: function () {
        var A = f(this, t);
        var e = A._i;
        for (var n = A._f; n; n = n.n) {
          n.r = true;
          n.p &&= n.p.n = undefined;
          delete e[n.i];
        }
        A._f = A._l = undefined;
        A[C] = 0;
      },
      delete: function (A) {
        var e = f(this, t);
        var n = E(e, A);
        if (n) {
          var r = n.n;
          var o = n.p;
          delete e._i[n.i];
          n.r = true;
          if (o) {
            o.n = r;
          }
          if (r) {
            r.p = o;
          }
          if (e._f == n) {
            e._f = r;
          }
          if (e._l == n) {
            e._l = o;
          }
          e[C]--;
        }
        return !!n;
      },
      forEach: function (A) {
        f(this, t);
        for (var e, n = i(A, arguments.length > 1 ? arguments[1] : undefined, 3); e = e ? e.n : this._f;) {
          for (n(e.v, e.k, this); e && e.r;) {
            e = e.p;
          }
        }
      },
      has: function (A) {
        return !!E(f(this, t), A);
      }
    });
    if (I) {
      n(s.prototype, "size", {
        get: function () {
          return f(this, t)[C];
        }
      });
    }
    return s;
  },
  def: function (A, t, e) {
    var n;
    var r;
    var o = E(A, t);
    if (o) {
      o.v = e;
    } else {
      A._l = o = {
        i: r = B(t, true),
        k: t,
        v: e,
        p: n = A._l,
        n: undefined,
        r: false
      };
      A._f ||= o;
      if (n) {
        n.n = o;
      }
      A[C]++;
      if (r !== "F") {
        A._i[r] = o;
      }
    }
    return A;
  },
  getEntry: E,
  setStrong: function (A, t, e) {
    g(A, t, function (A, e) {
      this._t = f(A, t);
      this._k = e;
      this._l = undefined;
    }, function () {
      var A = this;
      var t = A._k;
      for (var e = A._l; e && e.r;) {
        e = e.p;
      }
      if (A._t && (A._l = e = e ? e.n : A._t._f)) {
        return s(0, t == "keys" ? e.k : t == "values" ? e.v : [e.k, e.v]);
      } else {
        A._t = undefined;
        return s(1);
      }
    }, e ? "entries" : "values", !e, true);
    u(t);
  }
};