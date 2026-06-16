var n = require("./5ca1.js");
var r = require("./2aeb.js");
var o = require("./d8e8.js");
var i = require("./cb7c.js");
var a = require("./d3f4.js");
var c = require("./79e5.js");
var g = require("./f0c1.js");
var s = (require("./7726.js").Reflect || {}).construct;
var u = c(function () {
  function A() {}
  return !(s(function () {}, [], A) instanceof A);
});
var I = !c(function () {
  s(function () {});
});
n(n.S + n.F * (u || I), "Reflect", {
  construct: function (A, t) {
    o(A);
    i(t);
    var e = arguments.length < 3 ? A : o(arguments[2]);
    if (I && !u) {
      return s(A, t, e);
    }
    if (A == e) {
      switch (t.length) {
        case 0:
          return new A();
        case 1:
          return new A(t[0]);
        case 2:
          return new A(t[0], t[1]);
        case 3:
          return new A(t[0], t[1], t[2]);
        case 4:
          return new A(t[0], t[1], t[2], t[3]);
      }
      var n = [null];
      n.push.apply(n, t);
      return new (g.apply(A, n))();
    }
    var c = e.prototype;
    var B = r(a(c) ? c : Object.prototype);
    var f = Function.apply.call(A, B, t);
    if (a(f)) {
      return f;
    } else {
      return B;
    }
  }
});