var n = require("./e4ae.js");
var r = require("./f772.js");
var o = require("./656e.js");
module.exports = function (A, t) {
  n(A);
  if (r(t) && t.constructor === A) {
    return t;
  }
  var e = o.f(A);
  (0, e.resolve)(t);
  return e.promise;
};