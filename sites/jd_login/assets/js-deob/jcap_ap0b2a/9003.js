var n = require("./6b4c.js");
module.exports = Array.isArray || function (A) {
  return n(A) == "Array";
};