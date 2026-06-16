module.exports = Math.sign || function (A) {
  if ((A = +A) == 0 || A != A) {
    return A;
  } else if (A < 0) {
    return -1;
  } else {
    return 1;
  }
};