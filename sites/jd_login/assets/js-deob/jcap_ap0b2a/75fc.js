var n = require("./f410.js");
var r = n;
var o = require("./db2a.js");
var i = require("./f921.js");
var _a = i;
var c = require("./d8d6.js");
var g = c;
var s = require("./d2d5.js");
var u = s;
var I = require("./e630.js");
export function a(A) {
  return function (A) {
    if (r(A)) {
      return Object(o.a)(A);
    }
  }(A) || function (A) {
    if (_a !== undefined && A[g] != null || A["@@iterator"] != null) {
      return u(A);
    }
  }(A) || Object(I.a)(A) || function () {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }();
}