require("./b0c5.js");
var n = require("./2aba.js");
var r = require("./32e9.js");
var o = require("./79e5.js");
var i = require("./be13.js");
var a = require("./2b4c.js");
var c = require("./520a.js");
var g = a("species");
var s = !o(function () {
  var A = /./;
  A.exec = function () {
    var A = [];
    A.groups = {
      a: "7"
    };
    return A;
  };
  return "".replace(A, "$<a>") !== "7";
});
var u = function () {
  var A = /(?:)/;
  var t = A.exec;
  A.exec = function () {
    return t.apply(this, arguments);
  };
  var e = "ab".split(A);
  return e.length === 2 && e[0] === "a" && e[1] === "b";
}();
module.exports = function (A, t, e) {
  var I = a(A);
  var B = !o(function () {
    var t = {
      [I]: function () {
        return 7;
      }
    };
    return ""[A](t) != 7;
  });
  var f = B ? !o(function () {
    var t = false;
    var e = /a/;
    e.exec = function () {
      t = true;
      return null;
    };
    if (A === "split") {
      e.constructor = {};
      e.constructor[g] = function () {
        return e;
      };
    }
    e[I]("");
    return !t;
  }) : undefined;
  if (!B || !f || A === "replace" && !s || A === "split" && !u) {
    var C = /./[I];
    var E = e(i, I, ""[A], function (A, t, e, n, r) {
      if (t.exec === c) {
        if (B && !r) {
          return {
            done: true,
            value: C.call(t, e, n)
          };
        } else {
          return {
            done: true,
            value: A.call(e, t, n)
          };
        }
      } else {
        return {
          done: false
        };
      }
    });
    var l = E[0];
    var Q = E[1];
    n(String.prototype, A, l);
    r(RegExp.prototype, I, t == 2 ? function (A, t) {
      return Q.call(A, this, t);
    } : function (A) {
      return Q.call(A, this);
    });
  }
};