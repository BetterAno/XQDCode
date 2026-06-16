var n = require("./35e8.js");
module.exports = function (A, t, e) {
  for (var r in t) {
    if (e && A[r]) {
      A[r] = t[r];
    } else {
      n(A, r, t[r]);
    }
  }
  return A;
};