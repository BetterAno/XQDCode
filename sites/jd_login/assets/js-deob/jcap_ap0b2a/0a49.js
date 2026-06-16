var n = require("./9b43.js");
var r = require("./626a.js");
var o = require("./4bf8.js");
var i = require("./9def.js");
var a = require("./cd1c.js");
module.exports = function (A, t) {
  var e = A == 1;
  var c = A == 2;
  var g = A == 3;
  var s = A == 4;
  var u = A == 6;
  var I = A == 5 || u;
  var B = t || a;
  return function (t, a, f) {
    var C;
    var E;
    var l = o(t);
    var Q = r(l);
    var d = n(a, f, 3);
    for (var p = i(Q.length), h = 0, v = e ? B(t, p) : c ? B(t, 0) : undefined; p > h; h++) {
      if ((I || h in Q) && (E = d(C = Q[h], h, l), A)) {
        if (e) {
          v[h] = E;
        } else if (E) {
          switch (A) {
            case 3:
              return true;
            case 5:
              return C;
            case 6:
              return h;
            case 2:
              v.push(C);
          }
        } else if (s) {
          return false;
        }
      }
    }
    if (u) {
      return -1;
    } else if (g || s) {
      return s;
    } else {
      return v;
    }
  };
};