var n = require("./9b43.js");
var r = require("./5ca1.js");
var o = require("./4bf8.js");
var i = require("./1fa8.js");
var a = require("./33a4.js");
var c = require("./9def.js");
var g = require("./f1ae.js");
var s = require("./27ee.js");
r(r.S + r.F * !require("./5cc5.js")(function (A) {
  Array.from(A);
}), "Array", {
  from: function (A) {
    var t;
    var e;
    var r;
    var u;
    var I = o(A);
    var B = typeof this == "function" ? this : Array;
    var f = arguments.length;
    var C = f > 1 ? arguments[1] : undefined;
    var E = C !== undefined;
    var l = 0;
    var Q = s(I);
    if (E) {
      C = n(C, f > 2 ? arguments[2] : undefined, 2);
    }
    if (Q == null || B == Array && a(Q)) {
      for (e = new B(t = c(I.length)); t > l; l++) {
        g(e, l, E ? C(I[l], l) : I[l]);
      }
    } else {
      u = Q.call(I);
      e = new B();
      for (; !(r = u.next()).done; l++) {
        g(e, l, E ? i(u, C, [r.value, l], true) : r.value);
      }
    }
    e.length = l;
    return e;
  }
});