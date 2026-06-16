var n = require("./d9f6.js").f;
var r = require("./07e3.js");
var o = require("./5168.js")("toStringTag");
module.exports = function (A, t, e) {
  if (A && !r(A = e ? A : A.prototype, o)) {
    n(A, o, {
      configurable: true,
      value: t
    });
  }
};