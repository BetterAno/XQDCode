var n = require("./2aba.js");
module.exports = function (A, t, e) {
  for (var r in t) {
    n(A, r, t[r], e);
  }
  return A;
};