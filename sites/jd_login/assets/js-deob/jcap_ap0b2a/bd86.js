var n = require("./454f.js");
var r = n;
var o = require("./a6fa.js");
export function a(A, t, e) {
  if ((t = Object(o.a)(t)) in A) {
    r(A, t, {
      value: e,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    A[t] = e;
  }
  return A;
}