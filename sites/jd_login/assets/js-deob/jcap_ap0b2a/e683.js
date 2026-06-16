module.exports = function (A, t) {
  if (t) {
    return A.replace(/\/+$/, "") + "/" + t.replace(/^\/+/, "");
  } else {
    return A;
  }
};