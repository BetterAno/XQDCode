var n = require("./5537.js")("keys");
var r = require("./ca5a.js");
module.exports = function (A) {
  return n[A] ||= r(A);
};