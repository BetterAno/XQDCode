var n = require("./f772.js");
var r = require("./e4ae.js");
function o(A, t) {
  r(A);
  if (!n(t) && t !== null) {
    throw TypeError(t + ": can't set as prototype!");
  }
}
module.exports = {
  set: Object.setPrototypeOf || ("__proto__" in {} ? function (A, t, n) {
    try {
      (n = require("./d864.js")(Function.call, require("./bf0b.js").f(Object.prototype, "__proto__").set, 2))(A, []);
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