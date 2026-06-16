module.exports = function (A) {
  if (typeof A != "string") {
    return A;
  } else {
    if (/^['"].*['"]$/.test(A)) {
      A = A.slice(1, -1);
    }
    if (/["'() \t\n]/.test(A)) {
      return "\"" + A.replace(/"/g, "\\\"").replace(/\n/g, "\\n") + "\"";
    } else {
      return A;
    }
  }
};