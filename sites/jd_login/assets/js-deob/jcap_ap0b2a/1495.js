var n = require("./86cc.js");
var r = require("./cb7c.js");
var o = require("./0d58.js");
module.exports = require("./9e1e.js") ? Object.defineProperties : function (A, t) {
  r(A);
  var e;
  var i = o(t);
  for (var a = i.length, c = 0; a > c;) {
    n.f(A, e = i[c++], t[e]);
  }
  return A;
};