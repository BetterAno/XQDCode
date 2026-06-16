var n = require("./d3f4.js");
module.exports = function (A, t) {
  if (!n(A)) {
    return A;
  }
  var e;
  var r;
  if (t && typeof (e = A.toString) == "function" && !n(r = e.call(A))) {
    return r;
  }
  if (typeof (e = A.valueOf) == "function" && !n(r = e.call(A))) {
    return r;
  }
  if (!t && typeof (e = A.toString) == "function" && !n(r = e.call(A))) {
    return r;
  }
  throw TypeError("Can't convert object to primitive value");
};