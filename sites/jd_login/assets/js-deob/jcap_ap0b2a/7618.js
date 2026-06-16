var n = require("./f921.js");
var r = n;
var o = require("./d8d6.js");
var i = o;
export function a(A) {
  a = typeof r == "function" && typeof i == "symbol" ? function (A) {
    return typeof A;
  } : function (A) {
    if (A && typeof r == "function" && A.constructor === r && A !== r.prototype) {
      return "symbol";
    } else {
      return typeof A;
    }
  };
  return a(A);
}