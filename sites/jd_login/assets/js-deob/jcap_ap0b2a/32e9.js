var n = require("./86cc.js");
var r = require("./4630.js");
module.exports = require("./9e1e.js") ? function (A, t, e) {
  return n.f(A, t, r(1, e));
} : function (A, t, e) {
  A[t] = e;
  return A;
};