var n = require("./d3f4.js");
var r = require("./1169.js");
var o = require("./2b4c.js")("species");
module.exports = function (A) {
  var t;
  if (r(A)) {
    if (typeof (t = A.constructor) == "function" && (t === Array || !!r(t.prototype))) {
      t = undefined;
    }
    if (n(t)) {
      if ((t = t[o]) === null) {
        t = undefined;
      }
    }
  }
  if (t === undefined) {
    return Array;
  } else {
    return t;
  }
};