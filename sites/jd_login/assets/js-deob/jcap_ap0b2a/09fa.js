var n = require("./4588.js");
var r = require("./9def.js");
module.exports = function (A) {
  if (A === undefined) {
    return 0;
  }
  var t = n(A);
  var e = r(t);
  if (t !== e) {
    throw RangeError("Wrong length!");
  }
  return e;
};