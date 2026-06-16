var n = require("./c26b.js");
var r = require("./b39a.js");
module.exports = require("./e0b8.js")("Set", function (A) {
  return function () {
    return A(this, arguments.length > 0 ? arguments[0] : undefined);
  };
}, {
  add: function (A) {
    return n.def(r(this, "Set"), A = A === 0 ? 0 : A, A);
  }
}, n);