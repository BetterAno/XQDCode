var n = require("./cb7c.js");
var r = require("./d3f4.js");
var o = require("./a5b8.js");
module.exports = function (A, t) {
  n(A);
  if (r(t) && t.constructor === A) {
    return t;
  }
  var e = o.f(A);
  (0, e.resolve)(t);
  return e.promise;
};