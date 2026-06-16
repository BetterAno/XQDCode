var n = require("./cb7c.js");
module.exports = function () {
  var A = n(this);
  var t = "";
  if (A.global) {
    t += "g";
  }
  if (A.ignoreCase) {
    t += "i";
  }
  if (A.multiline) {
    t += "m";
  }
  if (A.unicode) {
    t += "u";
  }
  if (A.sticky) {
    t += "y";
  }
  return t;
};