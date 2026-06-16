var n = require("./d3f4.js");
var r = require("./cb7c.js");
function o(A, t) {
  r(A);
  if (!n(t) && t !== null) {
    throw TypeError(t + ": can't set as prototype!");
  }
}
module.exports = {
  set: Object.setPrototypeOf || ("__proto__" in {} ? function (A, t, n) {
    try {
      (n = require("./9b43.js")(Function.call, require("./11e9.js").f(Object.prototype, "__proto__").set, 2))(A, []);
      t = !(A instanceof Array);
    } catch (A) {
      t = true;
    }
    return function (A, e) {
      o(A, e);
      if (t) {
        A.__proto__ = e;
      } else {
        n(A, e);
      }
      return A;
    };
  }({}, false) : undefined),
  check: o
};