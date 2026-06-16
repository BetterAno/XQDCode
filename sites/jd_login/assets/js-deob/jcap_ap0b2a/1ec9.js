var n = require("./f772.js");
var r = require("./e53d.js").document;
var o = n(r) && n(r.createElement);
module.exports = function (A) {
  if (o) {
    return r.createElement(A);
  } else {
    return {};
  }
};