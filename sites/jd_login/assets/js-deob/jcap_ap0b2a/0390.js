var n = require("./02f4.js")(true);
module.exports = function (A, t, e) {
  return t + (e ? n(A, t).length : 1);
};