var n = require("./9c6c.js");
var r = require("./d53b.js");
var o = require("./84f2.js");
var i = require("./6821.js");
module.exports = require("./01f9.js")(Array, "Array", function (A, t) {
  this._t = i(A);
  this._i = 0;
  this._k = t;
}, function () {
  var A = this._t;
  var t = this._k;
  var e = this._i++;
  if (!A || e >= A.length) {
    this._t = undefined;
    return r(1);
  } else {
    return r(0, t == "keys" ? e : t == "values" ? A[e] : [e, A[e]]);
  }
}, "values");
o.Arguments = o.Array;
n("keys");
n("values");
n("entries");