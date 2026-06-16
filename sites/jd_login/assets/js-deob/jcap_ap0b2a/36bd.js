var n = require("./4bf8.js");
var r = require("./77f1.js");
var o = require("./9def.js");
module.exports = function (A) {
  var t = n(this);
  var e = o(t.length);
  var i = arguments.length;
  for (var a = r(i > 1 ? arguments[1] : undefined, e), c = i > 2 ? arguments[2] : undefined, g = c === undefined ? e : r(c, e); g > a;) {
    t[a++] = A;
  }
  return t;
};