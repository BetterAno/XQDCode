var n = require("./c3a1.js");
var r = require("./9aa9.js");
var o = require("./355d.js");
module.exports = function (A) {
  var t = n(A);
  var e = r.f;
  if (e) {
    var i;
    for (var a = e(A), c = o.f, g = 0; a.length > g;) {
      if (c.call(A, i = a[g++])) {
        t.push(i);
      }
    }
  }
  return t;
};