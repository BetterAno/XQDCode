var n = require("./c26b.js");
var r = require("./b39a.js");
var o = "Map";
module.exports = require("./e0b8.js")(o, function (A) {
  return function () {
    return A(this, arguments.length > 0 ? arguments[0] : undefined);
  };
}, {
  get: function (A) {
    var t = n.getEntry(r(this, o), A);
    return t && t.v;
  },
  set: function (A, t) {
    return n.def(r(this, o), A === 0 ? 0 : A, t);
  }
}, n, true);