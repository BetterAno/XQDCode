var n = require("./d9f6.js");
var r = require("./aebd.js");
module.exports = require("./8e60.js") ? function (A, t, e) {
  return n.f(A, t, r(1, e));
} : function (A, t, e) {
  A[t] = e;
  return A;
};