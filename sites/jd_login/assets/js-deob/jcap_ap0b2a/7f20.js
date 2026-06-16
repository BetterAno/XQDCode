var n = require("./86cc.js").f;
var r = require("./69a8.js");
var o = require("./2b4c.js")("toStringTag");
module.exports = function (A, t, e) {
  if (A && !r(A = e ? A : A.prototype, o)) {
    n(A, o, {
      configurable: true,
      value: t
    });
  }
};