var n = require("./8436.js");
var r = require("./50ed.js");
var o = require("./481b.js");
var i = require("./36c3.js");
module.exports = require("./30f1.js")(Array, "Array", function (A, t) {
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