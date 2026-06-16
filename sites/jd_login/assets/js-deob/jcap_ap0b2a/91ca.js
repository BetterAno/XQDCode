var n = require("./96fb.js");
var r = Math.pow;
var o = r(2, -52);
var i = r(2, -23);
var a = r(2, 127) * (2 - i);
var c = r(2, -126);
module.exports = Math.fround || function (A) {
  var t;
  var e;
  var r = Math.abs(A);
  var g = n(A);
  if (r < c) {
    return g * function (A) {
      return A + 1 / o - 1 / o;
    }(r / c / i) * c * i;
  } else if ((e = (t = (1 + i / o) * r) - (t - r)) > a || e != e) {
    return g * Infinity;
  } else {
    return g * e;
  }
};