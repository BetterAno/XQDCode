var n = require("./0d58.js");
var r = require("./2621.js");
var o = require("./52a7.js");
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