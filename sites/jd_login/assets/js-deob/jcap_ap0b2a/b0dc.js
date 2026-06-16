var n = require("./e4ae.js");
module.exports = function (A, t, e, r) {
  try {
    if (r) {
      return t(n(e)[0], e[1]);
    } else {
      return t(e);
    }
  } catch (t) {
    var o = A.return;
    if (o !== undefined) {
      n(o.call(A));
    }
    throw t;
  }
};