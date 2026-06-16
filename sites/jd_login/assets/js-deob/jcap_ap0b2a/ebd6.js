var n = require("./cb7c.js");
var r = require("./d8e8.js");
var o = require("./2b4c.js")("species");
module.exports = function (A, t) {
  var e;
  var i = n(A).constructor;
  if (i === undefined || (e = n(i)[o]) == null) {
    return t;
  } else {
    return r(e);
  }
};