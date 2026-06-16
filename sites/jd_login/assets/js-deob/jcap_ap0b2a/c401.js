var n = require("./c532.js");
module.exports = function (A, t, e) {
  n.forEach(e, function (e) {
    A = e(A, t);
  });
  return A;
};