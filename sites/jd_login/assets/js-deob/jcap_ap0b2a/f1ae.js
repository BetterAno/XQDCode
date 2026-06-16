var n = require("./86cc.js");
var r = require("./4630.js");
module.exports = function (A, t, e) {
  if (t in A) {
    n.f(A, t, r(0, e));
  } else {
    A[t] = e;
  }
};