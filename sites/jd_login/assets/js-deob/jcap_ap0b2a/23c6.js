var n = require("./2d95.js");
var r = require("./2b4c.js")("toStringTag");
var o = n(function () {
  return arguments;
}()) == "Arguments";
module.exports = function (A) {
  var t;
  var e;
  var i;
  if (A === undefined) {
    return "Undefined";
  } else if (A === null) {
    return "Null";
  } else if (typeof (e = function (A, t) {
    try {
      return A[t];
    } catch (A) {}
  }(t = Object(A), r)) == "string") {
    return e;
  } else if (o) {
    return n(t);
  } else if ((i = n(t)) == "Object" && typeof t.callee == "function") {
    return "Arguments";
  } else {
    return i;
  }
};