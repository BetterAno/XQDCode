var n = require("./e53d.js");
var r = require("./584a.js");
var o = require("./d864.js");
var i = require("./35e8.js");
var a = require("./07e3.js");
var c = "prototype";
function g(A, t, e) {
  var s;
  var u;
  var I;
  var B = A & g.F;
  var f = A & g.G;
  var C = A & g.S;
  var E = A & g.P;
  var l = A & g.B;
  var Q = A & g.W;
  var d = f ? r : r[t] ||= {};
  var p = d[c];
  var h = f ? n : C ? n[t] : (n[t] || {})[c];
  if (f) {
    e = t;
  }
  for (s in e) {
    if (!(u = !B && h && h[s] !== undefined) || !a(d, s)) {
      I = u ? h[s] : e[s];
      d[s] = f && typeof h[s] != "function" ? e[s] : l && u ? o(I, n) : Q && h[s] == I ? function (A) {
        function t(t, e, n) {
          if (this instanceof A) {
            switch (arguments.length) {
              case 0:
                return new A();
              case 1:
                return new A(t);
              case 2:
                return new A(t, e);
            }
            return new A(t, e, n);
          }
          return A.apply(this, arguments);
        }
        t[c] = A[c];
        return t;
      }(I) : E && typeof I == "function" ? o(Function.call, I) : I;
      if (E) {
        (d.virtual ||= {})[s] = I;
        if (A & g.R && p && !p[s]) {
          i(p, s, I);
        }
      }
    }
  }
}
g.F = 1;
g.G = 2;
g.S = 4;
g.P = 8;
g.B = 16;
g.W = 32;
g.U = 64;
g.R = 128;
module.exports = g;