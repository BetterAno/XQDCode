module.exports = function (A) {
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(A);
};