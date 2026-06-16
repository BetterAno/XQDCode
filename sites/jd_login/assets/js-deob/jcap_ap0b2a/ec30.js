if (require("./9e1e.js")) {
  var n = require("./2d00.js");
  var r = require("./7726.js");
  var o = require("./79e5.js");
  var i = require("./5ca1.js");
  var a = require("./0f88.js");
  var c = require("./ed0b.js");
  var g = require("./9b43.js");
  var s = require("./f605.js");
  var u = require("./4630.js");
  var I = require("./32e9.js");
  var B = require("./dcbc.js");
  var f = require("./4588.js");
  var C = require("./9def.js");
  var E = require("./09fa.js");
  var l = require("./77f1.js");
  var Q = require("./6a99.js");
  var d = require("./69a8.js");
  var p = require("./23c6.js");
  var h = require("./d3f4.js");
  var v = require("./4bf8.js");
  var y = require("./33a4.js");
  var m = require("./2aeb.js");
  var w = require("./38fd.js");
  var b = require("./9093.js").f;
  var D = require("./27ee.js");
  var k = require("./ca5a.js");
  var S = require("./2b4c.js");
  var _ = require("./0a49.js");
  var x = require("./c366.js");
  var M = require("./ebd6.js");
  var F = require("./cadf.js");
  var N = require("./84f2.js");
  var R = require("./5cc5.js");
  var G = require("./7a56.js");
  var L = require("./36bd.js");
  var U = require("./ba92.js");
  var j = require("./86cc.js");
  var H = require("./11e9.js");
  var Y = j.f;
  var J = H.f;
  var O = r.RangeError;
  var z = r.TypeError;
  var K = r.Uint8Array;
  var q = "ArrayBuffer";
  var T = "Shared" + q;
  var P = "BYTES_PER_ELEMENT";
  var W = "prototype";
  var Z = Array[W];
  var X = c.ArrayBuffer;
  var V = c.DataView;
  var $ = _(0);
  var AA = _(2);
  var tA = _(3);
  var eA = _(4);
  var nA = _(5);
  var rA = _(6);
  var oA = x(true);
  var iA = x(false);
  var aA = F.values;
  var cA = F.keys;
  var gA = F.entries;
  var sA = Z.lastIndexOf;
  var uA = Z.reduce;
  var IA = Z.reduceRight;
  var BA = Z.join;
  var fA = Z.sort;
  var CA = Z.slice;
  var EA = Z.toString;
  var lA = Z.toLocaleString;
  var QA = S("iterator");
  var dA = S("toStringTag");
  var pA = k("typed_constructor");
  var hA = k("def_constructor");
  var vA = a.CONSTR;
  var yA = a.TYPED;
  var mA = a.VIEW;
  var wA = "Wrong length!";
  var bA = _(1, function (A, t) {
    return xA(M(A, A[hA]), t);
  });
  var DA = o(function () {
    return new K(new Uint16Array([1]).buffer)[0] === 1;
  });
  var kA = !!K && !!K[W].set && o(function () {
    new K(1).set({});
  });
  function SA(A, t) {
    var e = f(A);
    if (e < 0 || e % t) {
      throw O("Wrong offset!");
    }
    return e;
  }
  function _A(A) {
    if (h(A) && yA in A) {
      return A;
    }
    throw z(A + " is not a typed array!");
  }
  function xA(A, t) {
    if (!h(A) || !(pA in A)) {
      throw z("It is not a typed array constructor!");
    }
    return new A(t);
  }
  function MA(A, t) {
    return FA(M(A, A[hA]), t);
  }
  function FA(A, t) {
    for (var e = 0, n = t.length, r = xA(A, n); n > e;) {
      r[e] = t[e++];
    }
    return r;
  }
  function NA(A, t, e) {
    Y(A, t, {
      get: function () {
        return this._d[e];
      }
    });
  }
  function RA(A) {
    var t;
    var e;
    var n;
    var r;
    var o;
    var i;
    var a = v(A);
    var c = arguments.length;
    var s = c > 1 ? arguments[1] : undefined;
    var u = s !== undefined;
    var I = D(a);
    if (I != null && !y(I)) {
      i = I.call(a);
      n = [];
      t = 0;
      for (; !(o = i.next()).done; t++) {
        n.push(o.value);
      }
      a = n;
    }
    if (u && c > 2) {
      s = g(s, arguments[2], 2);
    }
    t = 0;
    e = C(a.length);
    r = xA(this, e);
    for (; e > t; t++) {
      r[t] = u ? s(a[t], t) : a[t];
    }
    return r;
  }
  function GA() {
    for (var A = 0, t = arguments.length, e = xA(this, t); t > A;) {
      e[A] = arguments[A++];
    }
    return e;
  }
  var LA = !!K && o(function () {
    lA.call(new K(1));
  });
  function UA() {
    return lA.apply(LA ? CA.call(_A(this)) : _A(this), arguments);
  }
  var jA = {
    copyWithin: function (A, t) {
      return U.call(_A(this), A, t, arguments.length > 2 ? arguments[2] : undefined);
    },
    every: function (A) {
      return eA(_A(this), A, arguments.length > 1 ? arguments[1] : undefined);
    },
    fill: function (A) {
      return L.apply(_A(this), arguments);
    },
    filter: function (A) {
      return MA(this, AA(_A(this), A, arguments.length > 1 ? arguments[1] : undefined));
    },
    find: function (A) {
      return nA(_A(this), A, arguments.length > 1 ? arguments[1] : undefined);
    },
    findIndex: function (A) {
      return rA(_A(this), A, arguments.length > 1 ? arguments[1] : undefined);
    },
    forEach: function (A) {
      $(_A(this), A, arguments.length > 1 ? arguments[1] : undefined);
    },
    indexOf: function (A) {
      return iA(_A(this), A, arguments.length > 1 ? arguments[1] : undefined);
    },
    includes: function (A) {
      return oA(_A(this), A, arguments.length > 1 ? arguments[1] : undefined);
    },
    join: function (A) {
      return BA.apply(_A(this), arguments);
    },
    lastIndexOf: function (A) {
      return sA.apply(_A(this), arguments);
    },
    map: function (A) {
      return bA(_A(this), A, arguments.length > 1 ? arguments[1] : undefined);
    },
    reduce: function (A) {
      return uA.apply(_A(this), arguments);
    },
    reduceRight: function (A) {
      return IA.apply(_A(this), arguments);
    },
    reverse: function () {
      var A;
      var t = this;
      var e = _A(t).length;
      for (var n = Math.floor(e / 2), r = 0; r < n;) {
        A = t[r];
        t[r++] = t[--e];
        t[e] = A;
      }
      return t;
    },
    some: function (A) {
      return tA(_A(this), A, arguments.length > 1 ? arguments[1] : undefined);
    },
    sort: function (A) {
      return fA.call(_A(this), A);
    },
    subarray: function (A, t) {
      var e = _A(this);
      var n = e.length;
      var r = l(A, n);
      return new (M(e, e[hA]))(e.buffer, e.byteOffset + r * e.BYTES_PER_ELEMENT, C((t === undefined ? n : l(t, n)) - r));
    }
  };
  function HA(A, t) {
    return MA(this, CA.call(_A(this), A, t));
  }
  function YA(A) {
    _A(this);
    var t = SA(arguments[1], 1);
    var e = this.length;
    var n = v(A);
    var r = C(n.length);
    var o = 0;
    if (r + t > e) {
      throw O(wA);
    }
    while (o < r) {
      this[t + o] = n[o++];
    }
  }
  var JA = {
    entries: function () {
      return gA.call(_A(this));
    },
    keys: function () {
      return cA.call(_A(this));
    },
    values: function () {
      return aA.call(_A(this));
    }
  };
  function OA(A, t) {
    return h(A) && A[yA] && typeof t != "symbol" && t in A && String(+t) == String(t);
  }
  function zA(A, t) {
    if (OA(A, t = Q(t, true))) {
      return u(2, A[t]);
    } else {
      return J(A, t);
    }
  }
  function KA(A, t, e) {
    if (!OA(A, t = Q(t, true)) || !h(e) || !d(e, "value") || d(e, "get") || d(e, "set") || e.configurable || d(e, "writable") && !e.writable || d(e, "enumerable") && !e.enumerable) {
      return Y(A, t, e);
    } else {
      A[t] = e.value;
      return A;
    }
  }
  if (!vA) {
    H.f = zA;
    j.f = KA;
  }
  i(i.S + i.F * !vA, "Object", {
    getOwnPropertyDescriptor: zA,
    defineProperty: KA
  });
  if (o(function () {
    EA.call({});
  })) {
    EA = lA = function () {
      return BA.call(this);
    };
  }
  var qA = B({}, jA);
  B(qA, JA);
  I(qA, QA, JA.values);
  B(qA, {
    slice: HA,
    set: YA,
    constructor: function () {},
    toString: EA,
    toLocaleString: UA
  });
  NA(qA, "buffer", "b");
  NA(qA, "byteOffset", "o");
  NA(qA, "byteLength", "l");
  NA(qA, "length", "e");
  Y(qA, dA, {
    get: function () {
      return this[yA];
    }
  });
  module.exports = function (A, t, e, c) {
    var g = A + ((c = !!c) ? "Clamped" : "") + "Array";
    var u = "get" + A;
    var B = "set" + A;
    var f = r[g];
    var l = f || {};
    var Q = f && w(f);
    var d = !f || !a.ABV;
    var v = {};
    var y = f && f[W];
    function D(A, e) {
      var n = A._d;
      return n.v[u](e * t + n.o, DA);
    }
    function k(A, e, n) {
      var r = A._d;
      if (c) {
        n = (n = Math.round(n)) < 0 ? 0 : n > 255 ? 255 : n & 255;
      }
      r.v[B](e * t + r.o, n, DA);
    }
    function S(A, t) {
      Y(A, t, {
        get: function () {
          return D(this, t);
        },
        set: function (A) {
          return k(this, t, A);
        },
        enumerable: true
      });
    }
    if (d) {
      f = e(function (A, e, n, r) {
        s(A, f, g, "_d");
        var o;
        var i;
        var a;
        var c;
        var u = 0;
        var B = 0;
        if (h(e)) {
          if (!(e instanceof X) && (c = p(e)) != q && c != T) {
            if (yA in e) {
              return FA(f, e);
            } else {
              return RA.call(f, e);
            }
          }
          o = e;
          B = SA(n, t);
          var l = e.byteLength;
          if (r === undefined) {
            if (l % t) {
              throw O(wA);
            }
            if ((i = l - B) < 0) {
              throw O(wA);
            }
          } else if ((i = C(r) * t) + B > l) {
            throw O(wA);
          }
          a = i / t;
        } else {
          a = E(e);
          o = new X(i = a * t);
        }
        for (I(A, "_d", {
          b: o,
          o: B,
          l: i,
          e: a,
          v: new V(o)
        }); u < a;) {
          S(A, u++);
        }
      });
      y = f[W] = m(qA);
      I(y, "constructor", f);
    } else if (!o(function () {
      f(1);
    }) || !o(function () {
      new f(-1);
    }) || !R(function (A) {
      new f();
      new f(null);
      new f(1.5);
      new f(A);
    }, true)) {
      f = e(function (A, e, n, r) {
        var o;
        s(A, f, g);
        if (h(e)) {
          if (e instanceof X || (o = p(e)) == q || o == T) {
            if (r !== undefined) {
              return new l(e, SA(n, t), r);
            } else if (n !== undefined) {
              return new l(e, SA(n, t));
            } else {
              return new l(e);
            }
          } else if (yA in e) {
            return FA(f, e);
          } else {
            return RA.call(f, e);
          }
        } else {
          return new l(E(e));
        }
      });
      $(Q !== Function.prototype ? b(l).concat(b(Q)) : b(l), function (A) {
        if (!(A in f)) {
          I(f, A, l[A]);
        }
      });
      f[W] = y;
      if (!n) {
        y.constructor = f;
      }
    }
    var _ = y[QA];
    var x = !!_ && (_.name == "values" || _.name == null);
    var M = JA.values;
    I(f, pA, true);
    I(y, yA, g);
    I(y, mA, true);
    I(y, hA, f);
    if (!(c ? new f(1)[dA] == g : dA in y)) {
      Y(y, dA, {
        get: function () {
          return g;
        }
      });
    }
    v[g] = f;
    i(i.G + i.W + i.F * (f != l), v);
    i(i.S, g, {
      BYTES_PER_ELEMENT: t
    });
    i(i.S + i.F * o(function () {
      l.of.call(f, 1);
    }), g, {
      from: RA,
      of: GA
    });
    if (!(P in y)) {
      I(y, P, t);
    }
    i(i.P, g, jA);
    G(g);
    i(i.P + i.F * kA, g, {
      set: YA
    });
    i(i.P + i.F * !x, g, JA);
    if (!n && y.toString != EA) {
      y.toString = EA;
    }
    i(i.P + i.F * o(function () {
      new f(1).slice();
    }), g, {
      slice: HA
    });
    i(i.P + i.F * (o(function () {
      return [1, 2].toLocaleString() != new f([1, 2]).toLocaleString();
    }) || !o(function () {
      y.toLocaleString.call([1, 2]);
    })), g, {
      toLocaleString: UA
    });
    N[g] = x ? _ : M;
    if (!n && !x) {
      I(y, QA, M);
    }
  };
} else {
  module.exports = function () {};
}