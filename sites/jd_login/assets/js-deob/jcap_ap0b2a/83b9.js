var n = require("./d925.js");
var r = require("./e683.js");
module.exports = function (A, t) {
  if (A && !n(t)) {
    return r(A, t);
  } else {
    return t;
  }
};