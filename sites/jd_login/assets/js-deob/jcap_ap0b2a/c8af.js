var n = require("./c532.js");
module.exports = function (A, t) {
  n.forEach(A, function (e, n) {
    if (n !== t && n.toUpperCase() === t.toUpperCase()) {
      A[t] = e;
      delete A[n];
    }
  });
};