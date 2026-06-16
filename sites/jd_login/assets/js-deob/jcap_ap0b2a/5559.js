var n = require("./dbdb.js")("keys");
var r = require("./62a0.js");
module.exports = function (A) {
  return n[A] ||= r(A);
};