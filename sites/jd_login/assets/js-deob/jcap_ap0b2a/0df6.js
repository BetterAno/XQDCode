module.exports = function (A) {
  return function (t) {
    return A.apply(null, t);
  };
};