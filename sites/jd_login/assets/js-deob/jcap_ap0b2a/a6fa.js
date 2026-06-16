var n = require("./7618.js");
var r = require("./366e.js");
var o = r;
export function a(A) {
  var t = function (A, t) {
    if (Object(n.a)(A) != "object" || !A) {
      return A;
    }
    var e = A[o];
    if (e !== undefined) {
      var r = e.call(A, t || "default");
      if (Object(n.a)(r) != "object") {
        return r;
      }
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (t === "string" ? String : Number)(A);
  }(A, "string");
  if (Object(n.a)(t) == "symbol") {
    return t;
  } else {
    return t + "";
  }
}