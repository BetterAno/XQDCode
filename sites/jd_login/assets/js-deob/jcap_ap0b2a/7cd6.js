var n = require("./40c3.js");
var r = require("./5168.js")("iterator");
var o = require("./481b.js");
module.exports = require("./584a.js").getIteratorMethod = function (A) {
  if (A != null) {
    return A[r] || A["@@iterator"] || o[n(A)];
  }
};