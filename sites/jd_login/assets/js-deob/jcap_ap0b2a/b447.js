var n = require("./3a38.js");
var r = Math.min;
module.exports = function (A) {
  if (A > 0) {
    return r(n(A), 9007199254740991);
  } else {
    return 0;
  }
};