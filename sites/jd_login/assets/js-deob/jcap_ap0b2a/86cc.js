var n = require("./cb7c.js");
var r = require("./c69a.js");
var o = require("./6a99.js");
var i = Object.defineProperty;
exports.f = require("./9e1e.js") ? Object.defineProperty : function (A, t, e) {
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