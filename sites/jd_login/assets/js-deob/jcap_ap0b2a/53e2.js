var n = require("./07e3.js");
var r = require("./241e.js");
var o = require("./5559.js")("IE_PROTO");
var i = Object.prototype;
module.exports = Object.getPrototypeOf || function (A) {
  A = r(A);
  if (n(A, o)) {
    return A[o];
  } else if (typeof A.constructor == "function" && A instanceof A.constructor) {
    return A.constructor.prototype;
  } else if (A instanceof Object) {
    return i;
  } else {
    return null;
  }
};