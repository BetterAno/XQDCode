var n = require("./d9f6.js");
var r = require("./aebd.js");
module.exports = function (A, t, e) {
  if (t in A) {
    n.f(A, t, r(0, e));
  } else {
    A[t] = e;
  }
};