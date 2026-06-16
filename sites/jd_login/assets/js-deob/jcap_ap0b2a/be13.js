module.exports = function (A) {
  if (A == null) {
    throw TypeError("Can't call method on  " + A);
  }
  return A;
};