var n = require("./79aa.js");
module.exports = function (A, t, e) {
  n(A);
  if (t === undefined) {
    return A;
  }
  switch (e) {
    case 1:
      return function (e) {
        return A.call(t, e);
      };
    case 2:
      return function (e, n) {
        return A.call(t, e, n);
      };
    case 3:
      return function (e, n, r) {
        return A.call(t, e, n, r);
      };
  }
  return function () {
    return A.apply(t, arguments);
  };
};