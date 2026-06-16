var n = require("./4588.js");
var r = require("./be13.js");
module.exports = function (A) {
  return function (t, e) {
    var o;
    var i;
    var a = String(r(t));
    var c = n(e);
    var g = a.length;
    if (c < 0 || c >= g) {
      if (A) {
        return "";
      } else {
        return undefined;
      }
    } else if ((o = a.charCodeAt(c)) < 55296 || o > 56319 || c + 1 === g || (i = a.charCodeAt(c + 1)) < 56320 || i > 57343) {
      if (A) {
        return a.charAt(c);
      } else {
        return o;
      }
    } else if (A) {
      return a.slice(c, c + 2);
    } else {
      return i - 56320 + (o - 55296 << 10) + 65536;
    }
  };
};