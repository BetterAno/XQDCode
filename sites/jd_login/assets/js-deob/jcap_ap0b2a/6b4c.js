var e = {}.toString;
module.exports = function (A) {
  return e.call(A).slice(8, -1);
};