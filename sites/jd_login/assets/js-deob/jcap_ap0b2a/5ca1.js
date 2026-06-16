var n = require("./7726.js");
var r = require("./8378.js");
var o = require("./32e9.js");
var i = require("./2aba.js");
var a = require("./9b43.js");
var c = "prototype";
function g(A, t, e) {
  var s;
  var u;
  var I;
  var B;
  var f = A & g.F;
  var C = A & g.G;
  var E = A & g.S;
  var l = A & g.P;
  var Q = A & g.B;
  var d = C ? n : E ? n[t] ||= {} : (n[t] || {})[c];
  var p = C ? r : r[t] ||= {};
  var h = p[c] ||= {};
  if (C) {
    e = t;
  }
  for (s in e) {
    I = ((u = !f && d && d[s] !== undefined) ? d : e)[s];
    B = Q && u ? a(I, n) : l && typeof I == "function" ? a(Function.call, I) : I;
    if (d) {
      i(d, s, I, A & g.U);
    }
    if (p[s] != I) {
      o(p, s, B);
    }
    if (l && h[s] != I) {
      h[s] = I;
    }
  }
}
n.core = r;
g.F = 1;
g.G = 2;
g.S = 4;
g.P = 8;
g.B = 16;
g.W = 32;
g.U = 64;
g.R = 128;
module.exports = g;