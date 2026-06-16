var n = require("./d3f4.js");
var r = require("./8b97.js").set;
module.exports = function (A, t, e) {
  var o;
  var i = t.constructor;
  if (i !== e && typeof i == "function" && (o = i.prototype) !== e.prototype && n(o) && r) {
    r(A, o);
  }
  return A;
};