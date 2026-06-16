var n = require("./e53d.js");
var r = require("./584a.js");
var o = require("./b8e3.js");
var i = require("./ccb9.js");
var a = require("./d9f6.js").f;
module.exports = function (A) {
  var t = r.Symbol ||= o ? {} : n.Symbol || {};
  if (A.charAt(0) != "_" && !(A in t)) {
    a(t, A, {
      value: i.f(A)
    });
  }
};