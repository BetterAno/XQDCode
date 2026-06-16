var n = require("./d9f6.js");
var r = require("./e4ae.js");
var o = require("./c3a1.js");
module.exports = require("./8e60.js") ? Object.defineProperties : function (A, t) {
  r(A);
  var e;
  var i = o(t);
  for (var a = i.length, c = 0; a > c;) {
    n.f(A, e = i[c++], t[e]);
  }
  return A;
};