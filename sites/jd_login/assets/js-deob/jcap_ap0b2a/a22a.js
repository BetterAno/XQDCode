var n = require("./d864.js");
var r = require("./b0dc.js");
var o = require("./3702.js");
var i = require("./e4ae.js");
var a = require("./b447.js");
var c = require("./7cd6.js");
var g = {};
var s = {};
exports = module.exports = function (A, t, e, u, I) {
  var B;
  var f;
  var C;
  var E;
  var l = I ? function () {
    return A;
  } : c(A);
  var Q = n(e, u, t ? 2 : 1);
  var d = 0;
  if (typeof l != "function") {
    throw TypeError(A + " is not iterable!");
  }
  if (o(l)) {
    for (B = a(A.length); B > d; d++) {
      if ((E = t ? Q(i(f = A[d])[0], f[1]) : Q(A[d])) === g || E === s) {
        return E;
      }
    }
  } else {
    for (C = l.call(A); !(f = C.next()).done;) {
      if ((E = r(C, Q, f.value, t)) === g || E === s) {
        return E;
      }
    }
  }
};
exports.BREAK = g;
exports.RETURN = s;