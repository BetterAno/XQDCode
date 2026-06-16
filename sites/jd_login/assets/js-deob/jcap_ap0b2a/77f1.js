var n = require("./4588.js");
var r = Math.max;
var o = Math.min;
module.exports = function (A, t) {
  if ((A = n(A)) < 0) {
    return r(A + t, 0);
  } else {
    return o(A, t);
  }
};