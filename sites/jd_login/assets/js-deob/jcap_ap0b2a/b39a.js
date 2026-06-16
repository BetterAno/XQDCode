var n = require("./d3f4.js");
module.exports = function (A, t) {
  if (!n(A) || A._t !== t) {
    throw TypeError("Incompatible receiver, " + t + " required!");
  }
  return A;
};