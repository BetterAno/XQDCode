var n = require("./52a7.js");
var r = require("./4630.js");
var o = require("./6821.js");
var i = require("./6a99.js");
var a = require("./69a8.js");
var c = require("./c69a.js");
var g = Object.getOwnPropertyDescriptor;
exports.f = require("./9e1e.js") ? g : function (A, t) {
  A = o(A);
  t = i(t, true);
  if (c) {
    try {
      return g(A, t);
    } catch (A) {}
  }
  if (a(A, t)) {
    return r(!n.f.call(A, t), A[t]);
  }
};