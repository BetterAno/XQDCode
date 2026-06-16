var n = require("./0bfb.js");
var r = RegExp.prototype.exec;
var o = String.prototype.replace;
var i = r;
var a = "lastIndex";
var c = function () {
  var A = /a/;
  var t = /b*/g;
  r.call(A, "a");
  r.call(t, "a");
  return A[a] !== 0 || t[a] !== 0;
}();
var g = /()??/.exec("")[1] !== undefined;
if (c || g) {
  i = function (A) {
    var t;
    var e;
    var i;
    var s;
    var u = this;
    if (g) {
      e = new RegExp("^" + u.source + "$(?!\\s)", n.call(u));
    }
    if (c) {
      t = u[a];
    }
    i = r.call(u, A);
    if (c && i) {
      u[a] = u.global ? i.index + i[0].length : t;
    }
    if (g && i && i.length > 1) {
      o.call(i[0], e, function () {
        for (s = 1; s < arguments.length - 2; s++) {
          if (arguments[s] === undefined) {
            i[s] = undefined;
          }
        }
      });
    }
    return i;
  };
}
module.exports = i;