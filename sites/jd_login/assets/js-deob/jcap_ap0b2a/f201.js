var n = require("./e4ae.js");
var r = require("./79aa.js");
var o = require("./5168.js")("species");
module.exports = function (A, t) {
  var e;
  var i = n(A).constructor;
  if (i === undefined || (e = n(i)[o]) == null) {
    return t;
  } else {
    return r(e);
  }
};