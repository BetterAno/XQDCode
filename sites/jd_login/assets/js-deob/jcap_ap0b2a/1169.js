var n = require("./2d95.js");
module.exports = Array.isArray || function (A) {
  return n(A) == "Array";
};