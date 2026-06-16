module.exports = function (A) {
  if (typeof A != "function") {
    throw TypeError(A + " is not a function!");
  }
  return A;
};