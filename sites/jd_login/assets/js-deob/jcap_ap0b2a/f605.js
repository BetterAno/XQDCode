module.exports = function (A, t, e, n) {
  if (!(A instanceof t) || n !== undefined && n in A) {
    throw TypeError(e + ": incorrect invocation!");
  }
  return A;
};