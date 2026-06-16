module.exports = function (A) {
  if (typeof A == "object") {
    return A !== null;
  } else {
    return typeof A == "function";
  }
};