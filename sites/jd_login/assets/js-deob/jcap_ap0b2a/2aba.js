var n = require("./7726.js");
var r = require("./32e9.js");
var o = require("./69a8.js");
var i = require("./ca5a.js")("src");
var a = require("./fa5b.js");
var c = "toString";
var g = ("" + a).split(c);
require("./8378.js").inspectSource = function (A) {
  return a.call(A);
};
(module.exports = function (A, t, e, a) {
  var c = typeof e == "function";
  if (c) {
    if (!o(e, "name")) {
      r(e, "name", t);
    }
  }
  if (A[t] !== e) {
    if (c) {
      if (!o(e, i)) {
        r(e, i, A[t] ? "" + A[t] : g.join(String(t)));
      }
    }
    if (A === n) {
      A[t] = e;
    } else if (a) {
      if (A[t]) {
        A[t] = e;
      } else {
        r(A, t, e);
      }
    } else {
      delete A[t];
      r(A, t, e);
    }
  }
})(Function.prototype, c, function () {
  return typeof this == "function" && this[i] || a.call(this);
});