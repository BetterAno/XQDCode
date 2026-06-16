var n = require("./d3f4.js");
var r = require("./7726.js").document;
var o = n(r) && n(r.createElement);
module.exports = function (A) {
  if (o) {
    return r.createElement(A);
  } else {
    return {};
  }
};