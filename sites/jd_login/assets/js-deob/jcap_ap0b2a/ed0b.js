var n = require("./7726.js");
var r = require("./9e1e.js");
var o = require("./2d00.js");
var i = require("./0f88.js");
var a = require("./32e9.js");
var c = require("./dcbc.js");
var g = require("./79e5.js");
var s = require("./f605.js");
var u = require("./4588.js");
var I = require("./9def.js");
var B = require("./09fa.js");
var f = require("./9093.js").f;
var C = require("./86cc.js").f;
var E = require("./36bd.js");
var l = require("./7f20.js");
var Q = "ArrayBuffer";
var d = "DataView";
var p = "prototype";
var h = "Wrong index!";
var v = n[Q];
var y = n[d];
var m = n.Math;
var w = n.RangeError;
var b = n.Infinity;
var D = v;
var k = m.abs;
var S = m.pow;
var _ = m.floor;
var x = m.log;
var M = m.LN2;
var F = "buffer";
var N = "byteLength";
var R = "byteOffset";
var G = r ? "_b" : F;
var L = r ? "_l" : N;
var U = r ? "_o" : R;
function j(A, t, e) {
  var n;
  var r;
  var o;
  var i = new Array(e);
  var a = e * 8 - t - 1;
  var c = (1 << a) - 1;
  var g = c >> 1;
  var s = t === 23 ? S(2, -24) - S(2, -77) : 0;
  var u = 0;
  var I = A < 0 || A === 0 && 1 / A < 0 ? 1 : 0;
  for ((A = k(A)) != A || A === b ? (r = A != A ? 1 : 0, n = c) : (n = _(x(A) / M), A * (o = S(2, -n)) < 1 && (n--, o *= 2), (A += n + g >= 1 ? s / o : s * S(2, 1 - g)) * o >= 2 && (n++, o /= 2), n + g >= c ? (r = 0, n = c) : n + g >= 1 ? (r = (A * o - 1) * S(2, t), n += g) : (r = A * S(2, g - 1) * S(2, t), n = 0)); t >= 8; t -= 8) {
    i[u++] = r & 255;
    r /= 256;
  }
  n = n << t | r;
  a += t;
  for (; a > 0; a -= 8) {
    i[u++] = n & 255;
    n /= 256;
  }
  i[--u] |= I * 128;
  return i;
}
function H(A, t, e) {
  var n;
  var r = e * 8 - t - 1;
  var o = (1 << r) - 1;
  var i = o >> 1;
  var a = r - 7;
  var c = e - 1;
  var g = A[c--];
  var s = g & 127;
  for (g >>= 7; a > 0; a -= 8) {
    s = s * 256 + A[c];
    c--;
  }
  n = s & (1 << -a) - 1;
  s >>= -a;
  a += t;
  for (; a > 0; a -= 8) {
    n = n * 256 + A[c];
    c--;
  }
  if (s === 0) {
    s = 1 - i;
  } else {
    if (s === o) {
      if (n) {
        return NaN;
      } else if (g) {
        return -b;
      } else {
        return b;
      }
    }
    n += S(2, t);
    s -= i;
  }
  return (g ? -1 : 1) * n * S(2, s - t);
}
function Y(A) {
  return A[3] << 24 | A[2] << 16 | A[1] << 8 | A[0];
}
function J(A) {
  return [A & 255];
}
function O(A) {
  return [A & 255, A >> 8 & 255];
}
function z(A) {
  return [A & 255, A >> 8 & 255, A >> 16 & 255, A >> 24 & 255];
}
function K(A) {
  return j(A, 52, 8);
}
function q(A) {
  return j(A, 23, 4);
}
function T(A, t, e) {
  C(A[p], t, {
    get: function () {
      return this[e];
    }
  });
}
function P(A, t, e, n) {
  var r = B(+e);
  if (r + t > A[L]) {
    throw w(h);
  }
  var o = A[G]._b;
  var i = r + A[U];
  var a = o.slice(i, i + t);
  if (n) {
    return a;
  } else {
    return a.reverse();
  }
}
function W(A, t, e, n, r, o) {
  var i = B(+e);
  if (i + t > A[L]) {
    throw w(h);
  }
  var a = A[G]._b;
  var c = i + A[U];
  var g = n(+r);
  for (var s = 0; s < t; s++) {
    a[c + s] = g[o ? s : t - s - 1];
  }
}
if (i.ABV) {
  if (!g(function () {
    v(1);
  }) || !g(function () {
    new v(-1);
  }) || g(function () {
    new v();
    new v(1.5);
    new v(NaN);
    return v.name != Q;
  })) {
    v = function (A) {
      s(this, v);
      return new D(B(A));
    };
    var Z;
    var X = v[p] = D[p];
    for (var V = f(D), $ = 0; V.length > $;) {
      if (!((Z = V[$++]) in v)) {
        a(v, Z, D[Z]);
      }
    }
    if (!o) {
      X.constructor = v;
    }
  }
  var AA = new y(new v(2));
  var tA = y[p].setInt8;
  AA.setInt8(0, 2147483648);
  AA.setInt8(1, 2147483649);
  if (!!AA.getInt8(0) || !AA.getInt8(1)) {
    c(y[p], {
      setInt8: function (A, t) {
        tA.call(this, A, t << 24 >> 24);
      },
      setUint8: function (A, t) {
        tA.call(this, A, t << 24 >> 24);
      }
    }, true);
  }
} else {
  v = function (A) {
    s(this, v, Q);
    var t = B(A);
    this._b = E.call(new Array(t), 0);
    this[L] = t;
  };
  y = function (A, t, e) {
    s(this, y, d);
    s(A, v, d);
    var n = A[L];
    var r = u(t);
    if (r < 0 || r > n) {
      throw w("Wrong offset!");
    }
    if (r + (e = e === undefined ? n - r : I(e)) > n) {
      throw w("Wrong length!");
    }
    this[G] = A;
    this[U] = r;
    this[L] = e;
  };
  if (r) {
    T(v, N, "_l");
    T(y, F, "_b");
    T(y, N, "_l");
    T(y, R, "_o");
  }
  c(y[p], {
    getInt8: function (A) {
      return P(this, 1, A)[0] << 24 >> 24;
    },
    getUint8: function (A) {
      return P(this, 1, A)[0];
    },
    getInt16: function (A) {
      var t = P(this, 2, A, arguments[1]);
      return (t[1] << 8 | t[0]) << 16 >> 16;
    },
    getUint16: function (A) {
      var t = P(this, 2, A, arguments[1]);
      return t[1] << 8 | t[0];
    },
    getInt32: function (A) {
      return Y(P(this, 4, A, arguments[1]));
    },
    getUint32: function (A) {
      return Y(P(this, 4, A, arguments[1])) >>> 0;
    },
    getFloat32: function (A) {
      return H(P(this, 4, A, arguments[1]), 23, 4);
    },
    getFloat64: function (A) {
      return H(P(this, 8, A, arguments[1]), 52, 8);
    },
    setInt8: function (A, t) {
      W(this, 1, A, J, t);
    },
    setUint8: function (A, t) {
      W(this, 1, A, J, t);
    },
    setInt16: function (A, t) {
      W(this, 2, A, O, t, arguments[2]);
    },
    setUint16: function (A, t) {
      W(this, 2, A, O, t, arguments[2]);
    },
    setInt32: function (A, t) {
      W(this, 4, A, z, t, arguments[2]);
    },
    setUint32: function (A, t) {
      W(this, 4, A, z, t, arguments[2]);
    },
    setFloat32: function (A, t) {
      W(this, 4, A, q, t, arguments[2]);
    },
    setFloat64: function (A, t) {
      W(this, 8, A, K, t, arguments[2]);
    }
  });
}
l(v, Q);
l(y, d);
a(y[p], i.VIEW, true);
exports[Q] = v;
exports[d] = y;