var n = require("./9e1e.js");
var r = require("./0d58.js");
var o = require("./2621.js");
var i = require("./52a7.js");
var a = require("./4bf8.js");
var c = require("./626a.js");
var g = Object.assign;
module.exports = !g || require("./79e5.js")(function () {
  var A = {};
  var t = {};
  var e = Symbol();
  var n = "abcdefghijklmnopqrst";
  A[e] = 7;
  n.split("").forEach(function (A) {
    t[A] = A;
  });
  return g({}, A)[e] != 7 || Object.keys(g({}, t)).join("") != n;
}) ? function (A, t) {
  var e = a(A);
  for (var g = arguments.length, s = 1, u = o.f, I = i.f; g > s;) {
    var B;
    var f = c(arguments[s++]);
    var C = u ? r(f).concat(u(f)) : r(f);
    for (var E = C.length, l = 0; E > l;) {
      B = C[l++];
      if (!n || !!I.call(f, B)) {
        e[B] = f[B];
      }
    }
  }
  return e;
} : g;