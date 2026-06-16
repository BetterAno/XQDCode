var n = require("./5ca1.js");
var r = require("./8378.js");
var o = require("./7726.js");
var i = require("./ebd6.js");
var a = require("./bcaa.js");
n(n.P + n.R, "Promise", {
  finally: function (A) {
    var t = i(this, r.Promise || o.Promise);
    var e = typeof A == "function";
    return this.then(e ? function (e) {
      return a(t, A()).then(function () {
        return e;
      });
    } : A, e ? function (e) {
      return a(t, A()).then(function () {
        throw e;
      });
    } : A);
  }
});