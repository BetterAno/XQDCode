var n = require("./aae3.js");
var r = require("./be13.js");
module.exports = function (A, t, e) {
  if (n(t)) {
    throw TypeError("String#" + e + " doesn't accept regex!");
  }
  return String(r(A));
};