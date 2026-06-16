var n = require("./71c1.js")(true);
require("./30f1.js")(String, "String", function (A) {
  this._t = String(A);
  this._i = 0;
}, function () {
  var A;
  var t = this._t;
  var e = this._i;
  if (e >= t.length) {
    return {
      value: undefined,
      done: true
    };
  } else {
    A = n(t, e);
    this._i += A.length;
    return {
      value: A,
      done: false
    };
  }
});