var n = require("./d2d5.js");
var r = n;
var o = require("./db2a.js");
export function a(A, t) {
  if (A) {
    if (typeof A == "string") {
      return Object(o.a)(A, t);
    }
    var e = {}.toString.call(A).slice(8, -1);
    if (e === "Object" && A.constructor) {
      e = A.constructor.name;
    }
    if (e === "Map" || e === "Set") {
      return r(A);
    } else if (e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e)) {
      return Object(o.a)(A, t);
    } else {
      return undefined;
    }
  }
}