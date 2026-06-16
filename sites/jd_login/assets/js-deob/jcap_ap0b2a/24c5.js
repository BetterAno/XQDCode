var n;
var r;
var o;
var i;
var a = require("./b8e3.js");
var c = require("./e53d.js");
var g = require("./d864.js");
var s = require("./40c3.js");
var u = require("./63b6.js");
var I = require("./f772.js");
var B = require("./79aa.js");
var f = require("./1173.js");
var C = require("./a22a.js");
var E = require("./f201.js");
var l = require("./4178.js").set;
var Q = require("./aba2.js")();
var d = require("./656e.js");
var p = require("./4439.js");
var h = require("./bc13.js");
var v = require("./cd78.js");
var y = "Promise";
var m = c.TypeError;
var w = c.process;
var b = w && w.versions;
var D = b && b.v8 || "";
var k = c[y];
var S = s(w) == "process";
function _() {}
var x = r = d.f;
var M = !!function () {
  try {
    var A = k.resolve(1);
    var t = (A.constructor = {})[require("./5168.js")("species")] = function (A) {
      A(_, _);
    };
    return (S || typeof PromiseRejectionEvent == "function") && A.then(_) instanceof t && D.indexOf("6.6") !== 0 && h.indexOf("Chrome/66") === -1;
  } catch (A) {}
}();
function F(A) {
  var t;
  return !!I(A) && typeof (t = A.then) == "function" && t;
}
function N(A, t) {
  if (!A._n) {
    A._n = true;
    var e = A._c;
    Q(function () {
      var n = A._v;
      for (var r = A._s == 1, o = 0, i = function (t) {
          var e;
          var o;
          var i;
          var a = r ? t.ok : t.fail;
          var c = t.resolve;
          var g = t.reject;
          var s = t.domain;
          try {
            if (a) {
              if (!r) {
                if (A._h == 2) {
                  L(A);
                }
                A._h = 1;
              }
              if (a === true) {
                e = n;
              } else {
                if (s) {
                  s.enter();
                }
                e = a(n);
                if (s) {
                  s.exit();
                  i = true;
                }
              }
              if (e === t.promise) {
                g(m("Promise-chain cycle"));
              } else if (o = F(e)) {
                o.call(e, c, g);
              } else {
                c(e);
              }
            } else {
              g(n);
            }
          } catch (A) {
            if (s && !i) {
              s.exit();
            }
            g(A);
          }
        }; e.length > o;) {
        i(e[o++]);
      }
      A._c = [];
      A._n = false;
      if (t && !A._h) {
        R(A);
      }
    });
  }
}
function R(A) {
  l.call(c, function () {
    var t;
    var e;
    var n;
    var r = A._v;
    var o = G(A);
    if (o) {
      t = p(function () {
        if (S) {
          w.emit("unhandledRejection", r, A);
        } else if (e = c.onunhandledrejection) {
          e({
            promise: A,
            reason: r
          });
        } else if ((n = c.console) && n.error) {
          n.error("Unhandled promise rejection", r);
        }
      });
      A._h = S || G(A) ? 2 : 1;
    }
    A._a = undefined;
    if (o && t.e) {
      throw t.v;
    }
  });
}
function G(A) {
  return A._h !== 1 && (A._a || A._c).length === 0;
}
function L(A) {
  l.call(c, function () {
    var t;
    if (S) {
      w.emit("rejectionHandled", A);
    } else if (t = c.onrejectionhandled) {
      t({
        promise: A,
        reason: A._v
      });
    }
  });
}
function U(A) {
  var t = this;
  if (!t._d) {
    t._d = true;
    (t = t._w || t)._v = A;
    t._s = 2;
    t._a ||= t._c.slice();
    N(t, true);
  }
}
function j(A) {
  var t;
  var e = this;
  if (!e._d) {
    e._d = true;
    e = e._w || e;
    try {
      if (e === A) {
        throw m("Promise can't be resolved itself");
      }
      if (t = F(A)) {
        Q(function () {
          var n = {
            _w: e,
            _d: false
          };
          try {
            t.call(A, g(j, n, 1), g(U, n, 1));
          } catch (A) {
            U.call(n, A);
          }
        });
      } else {
        e._v = A;
        e._s = 1;
        N(e, false);
      }
    } catch (A) {
      U.call({
        _w: e,
        _d: false
      }, A);
    }
  }
}
if (!M) {
  k = function (A) {
    f(this, k, y, "_h");
    B(A);
    n.call(this);
    try {
      A(g(j, this, 1), g(U, this, 1));
    } catch (A) {
      U.call(this, A);
    }
  };
  (n = function (A) {
    this._c = [];
    this._a = undefined;
    this._s = 0;
    this._d = false;
    this._v = undefined;
    this._h = 0;
    this._n = false;
  }).prototype = require("./5c95.js")(k.prototype, {
    then: function (A, t) {
      var e = x(E(this, k));
      e.ok = typeof A != "function" || A;
      e.fail = typeof t == "function" && t;
      e.domain = S ? w.domain : undefined;
      this._c.push(e);
      if (this._a) {
        this._a.push(e);
      }
      if (this._s) {
        N(this, false);
      }
      return e.promise;
    },
    catch: function (A) {
      return this.then(undefined, A);
    }
  });
  o = function () {
    var A = new n();
    this.promise = A;
    this.resolve = g(j, A, 1);
    this.reject = g(U, A, 1);
  };
  d.f = x = function (A) {
    if (A === k || A === i) {
      return new o(A);
    } else {
      return r(A);
    }
  };
}
u(u.G + u.W + u.F * !M, {
  Promise: k
});
require("./45f2.js")(k, y);
require("./4c95.js")(y);
i = require("./584a.js")[y];
u(u.S + u.F * !M, y, {
  reject: function (A) {
    var t = x(this);
    (0, t.reject)(A);
    return t.promise;
  }
});
u(u.S + u.F * (a || !M), y, {
  resolve: function (A) {
    return v(a && this === i ? k : this, A);
  }
});
u(u.S + u.F * (!M || !require("./4ee1.js")(function (A) {
  k.all(A).catch(_);
})), y, {
  all: function (A) {
    var t = this;
    var e = x(t);
    var n = e.resolve;
    var r = e.reject;
    var o = p(function () {
      var e = [];
      var o = 0;
      var i = 1;
      C(A, false, function (A) {
        var a = o++;
        var c = false;
        e.push(undefined);
        i++;
        t.resolve(A).then(function (A) {
          if (!c) {
            c = true;
            e[a] = A;
            if (! --i) {
              n(e);
            }
          }
        }, r);
      });
      if (! --i) {
        n(e);
      }
    });
    if (o.e) {
      r(o.v);
    }
    return e.promise;
  },
  race: function (A) {
    var t = this;
    var e = x(t);
    var n = e.reject;
    var r = p(function () {
      C(A, false, function (A) {
        t.resolve(A).then(e.resolve, n);
      });
    });
    if (r.e) {
      n(r.v);
    }
    return e.promise;
  }
});