var n = require("./d3f4.js");
module.exports = function (A) {
  if (!n(A)) {
    throw TypeError(A + " is not an object!");
  }
  return A;
};