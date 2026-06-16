var n = require("./6821.js");
var r = require("./9093.js").f;
var o = {}.toString;
var i = typeof window == "object" && window && Object.getOwnPropertyNames ? Object.getOwnPropertyNames(window) : [];
module.exports.f = function (A) {
  if (i && o.call(A) == "[object Window]") {
    return function (A) {
      try {
        return r(A);
      } catch (A) {
        return i.slice();
      }
    }(A);
  } else {
    return r(n(A));
  }
};