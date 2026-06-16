var n = require("./23c6.js");
var r = require("./2b4c.js")("iterator");
var o = require("./84f2.js");
module.exports = require("./8378.js").getIteratorMethod = function (A) {
  if (A != null) {
    return A[r] || A["@@iterator"] || o[n(A)];
  }
};