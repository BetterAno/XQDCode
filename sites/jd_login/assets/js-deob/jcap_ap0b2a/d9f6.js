var n = require("./e4ae.js");
var r = require("./794b.js");
var o = require("./1bc3.js");
var i = Object.defineProperty;
exports.f = require("./8e60.js") ? Object.defineProperty : function (A, t, e) {
  n(A);
  t = o(t, true);
  n(e);
  if (r) {
    try {
      return i(A, t, e);
    } catch (A) {}
  }
  if ("get" in e || "set" in e) {
    throw TypeError("Accessors not supported!");
  }
  if ("value" in e) {
    A[t] = e.value;
  }
  return A;
};