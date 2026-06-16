var n = require("./5ca1.js");
var r = require("./be13.js");
var o = require("./79e5.js");
var i = require("./fdef.js");
var a = "[" + i + "]";
var c = RegExp("^" + a + a + "*");
var g = RegExp(a + a + "*$");
function s(A, t, e) {
  var r = {};
  var a = o(function () {
    return !!i[A]() || "​"[A]() != "​";
  });
  var c = r[A] = a ? t(u) : i[A];
  if (e) {
    r[e] = c;
  }
  n(n.P + n.F * a, "String", r);
}
var u = s.trim = function (A, t) {
  A = String(r(A));
  if (t & 1) {
    A = A.replace(c, "");
  }
  if (t & 2) {
    A = A.replace(g, "");
  }
  return A;
};
module.exports = s;