module.exports = function (A, t) {
  return function () {
    for (var e = new Array(arguments.length), n = 0; n < e.length; n++) {
      e[n] = arguments[n];
    }
    return A.apply(t, e);
  };
};