var n = require("./7726.js");
var r = require("./69a8.js");
var o = require("./2d95.js");
var i = require("./5dbc.js");
var a = require("./6a99.js");
var c = require("./79e5.js");
var g = require("./9093.js").f;
var s = require("./11e9.js").f;
var u = require("./86cc.js").f;
var I = require("./aa77.js").trim;
var B = "Number";
var f = n[B];
var C = f;
var E = f.prototype;
var l = o(require("./2aeb.js")(E)) == B;
var Q = "trim" in String.prototype;
function d(A) {
  var t = a(A, false);
  if (typeof t == "string" && t.length > 2) {
    var e;
    var n;
    var r;
    var o = (t = Q ? t.trim() : I(t, 3)).charCodeAt(0);
    if (o === 43 || o === 45) {
      if ((e = t.charCodeAt(2)) === 88 || e === 120) {
        return NaN;
      }
    } else if (o === 48) {
      switch (t.charCodeAt(1)) {
        case 66:
        case 98:
          n = 2;
          r = 49;
          break;
        case 79:
        case 111:
          n = 8;
          r = 55;
          break;
        default:
          return +t;
      }
      var i;
      var c = t.slice(2);
      for (var g = 0, s = c.length; g < s; g++) {
        if ((i = c.charCodeAt(g)) < 48 || i > r) {
          return NaN;
        }
      }
      return parseInt(c, n);
    }
  }
  return +t;
}
if (!f(" 0o1") || !f("0b1") || f("+0x1")) {
  f = function (A) {
    var t = arguments.length < 1 ? 0 : A;
    var e = this;
    if (e instanceof f && (l ? c(function () {
      E.valueOf.call(e);
    }) : o(e) != B)) {
      return i(new C(d(t)), e, f);
    } else {
      return d(t);
    }
  };
  var p;
  for (var h = require("./9e1e.js") ? g(C) : "MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","), v = 0; h.length > v; v++) {
    if (r(C, p = h[v]) && !r(f, p)) {
      u(f, p, s(C, p));
    }
  }
  f.prototype = E;
  E.constructor = f;
  require("./2aba.js")(n, B, f);
}