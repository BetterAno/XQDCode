var n = require("./23c6.js");
var r = RegExp.prototype.exec;
module.exports = function (A, t) {
  var e = A.exec;
  if (typeof e == "function") {
    var o = e.call(A, t);
    if (typeof o != "object") {
      throw new TypeError("RegExp exec method returned something other than an Object or null");
    }
    return o;
  }
  if (n(A) !== "RegExp") {
    throw new TypeError("RegExp#exec called on incompatible receiver");
  }
  return r.call(A, t);
};