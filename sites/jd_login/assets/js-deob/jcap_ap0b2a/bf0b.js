var n = require("./355d.js");
var r = require("./aebd.js");
var o = require("./36c3.js");
var i = require("./1bc3.js");
var a = require("./07e3.js");
var c = require("./794b.js");
var g = Object.getOwnPropertyDescriptor;
exports.f = require("./8e60.js") ? g : function (A, t) {
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