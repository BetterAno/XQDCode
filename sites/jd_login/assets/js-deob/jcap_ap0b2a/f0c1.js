var n = require("./d8e8.js");
var r = require("./d3f4.js");
var o = require("./31f4.js");
var i = [].slice;
var a = {};
function c(A, t, e) {
  if (!(t in a)) {
    var n = [];
    for (var r = 0; r < t; r++) {
      n[r] = "a[" + r + "]";
    }
    a[t] = Function("F,a", "return new F(" + n.join(",") + ")");
  }
  return a[t](A, e);
}
module.exports = Function.bind || function (A) {
  var t = n(this);
  var e = i.call(arguments, 1);
  function a() {
    var n = e.concat(i.call(arguments));
    if (this instanceof a) {
      return c(t, n.length, n);
    } else {
      return o(t, n, A);
    }
  }
  if (r(t.prototype)) {
    a.prototype = t.prototype;
  }
  return a;
};