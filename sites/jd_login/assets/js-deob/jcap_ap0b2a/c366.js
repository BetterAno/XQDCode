var n = require("./6821.js");
var r = require("./9def.js");
var o = require("./77f1.js");
module.exports = function (A) {
  return function (t, e, i) {
    var a;
    var c = n(t);
    var g = r(c.length);
    var s = o(i, g);
    if (A && e != e) {
      while (g > s) {
        if ((a = c[s++]) != a) {
          return true;
        }
      }
    } else {
      for (; g > s; s++) {
        if ((A || s in c) && c[s] === e) {
          return A || s || 0;
        }
      }
    }
    return !A && -1;
  };
};