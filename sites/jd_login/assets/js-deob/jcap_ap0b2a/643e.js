var n = require("./dcbc.js");
var r = require("./67ab.js").getWeak;
var o = require("./cb7c.js");
var i = require("./d3f4.js");
var a = require("./f605.js");
var c = require("./4a59.js");
var g = require("./0a49.js");
var s = require("./69a8.js");
var u = require("./b39a.js");
var I = g(5);
var B = g(6);
var f = 0;
function C(A) {
  return A._l ||= new E();
}
function E() {
  this.a = [];
}
function l(A, t) {
  return I(A.a, function (A) {
    return A[0] === t;
  });
}
E.prototype = {
  get: function (A) {
    var t = l(this, A);
    if (t) {
      return t[1];
    }
  },
  has: function (A) {
    return !!l(this, A);
  },
  set: function (A, t) {
    var e = l(this, A);
    if (e) {
      e[1] = t;
    } else {
      this.a.push([A, t]);
    }
  },
  delete: function (A) {
    var t = B(this.a, function (t) {
      return t[0] === A;
    });
    if (~t) {
      this.a.splice(t, 1);
    }
    return !!~t;
  }
};
module.exports = {
  getConstructor: function (A, t, e, o) {
    var g = A(function (A, n) {
      a(A, g, t, "_i");
      A._t = t;
      A._i = f++;
      A._l = undefined;
      if (n != null) {
        c(n, e, A[o], A);
      }
    });
    n(g.prototype, {
      delete: function (A) {
        if (!i(A)) {
          return false;
        }
        var e = r(A);
        if (e === true) {
          return C(u(this, t)).delete(A);
        } else {
          return e && s(e, this._i) && delete e[this._i];
        }
      },
      has: function (A) {
        if (!i(A)) {
          return false;
        }
        var e = r(A);
        if (e === true) {
          return C(u(this, t)).has(A);
        } else {
          return e && s(e, this._i);
        }
      }
    });
    return g;
  },
  def: function (A, t, e) {
    var n = r(o(t), true);
    if (n === true) {
      C(A).set(t, e);
    } else {
      n[A._i] = e;
    }
    return A;
  },
  ufstore: C
};