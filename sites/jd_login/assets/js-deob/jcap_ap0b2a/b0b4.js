var n = require("./454f.js");
var r = n;
var o = require("./a6fa.js");
function i(A, t) {
  for (var e = 0; e < t.length; e++) {
    var n = t[e];
    n.enumerable = n.enumerable || false;
    n.configurable = true;
    if ("value" in n) {
      n.writable = true;
    }
    r(A, Object(o.a)(n.key), n);
  }
}
export function a(A, t, e) {
  if (t) {
    i(A.prototype, t);
  }
  if (e) {
    i(A, e);
  }
  r(A, "prototype", {
    writable: false
  });
  return A;
}