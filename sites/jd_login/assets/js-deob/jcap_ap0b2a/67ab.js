var n = require("./ca5a.js")("meta");
var r = require("./d3f4.js");
var o = require("./69a8.js");
var i = require("./86cc.js").f;
var a = 0;
var c = Object.isExtensible || function () {
  return true;
};
var g = !require("./79e5.js")(function () {
  return c(Object.preventExtensions({}));
});
function s(A) {
  i(A, n, {
    value: {
      i: "O" + ++a,
      w: {}
    }
  });
}
var u = module.exports = {
  KEY: n,
  NEED: false,
  fastKey: function (A, t) {
    if (!r(A)) {
      if (typeof A == "symbol") {
        return A;
      } else {
        return (typeof A == "string" ? "S" : "P") + A;
      }
    }
    if (!o(A, n)) {
      if (!c(A)) {
        return "F";
      }
      if (!t) {
        return "E";
      }
      s(A);
    }
    return A[n].i;
  },
  getWeak: function (A, t) {
    if (!o(A, n)) {
      if (!c(A)) {
        return true;
      }
      if (!t) {
        return false;
      }
      s(A);
    }
    return A[n].w;
  },
  onFreeze: function (A) {
    if (g && u.NEED && c(A) && !o(A, n)) {
      s(A);
    }
    return A;
  }
};