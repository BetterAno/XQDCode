var n = require("./7726.js");
var r = require("./8378.js");
var o = require("./2d00.js");
var i = require("./37c8.js");
var a = require("./86cc.js").f;
module.exports = function (A) {
  var t = r.Symbol ||= o ? {} : n.Symbol || {};
  if (A.charAt(0) != "_" && !(A in t)) {
    a(t, A, {
      value: i.f(A)
    });
  }
};