var n = require("./63b6.js");
var r = require("./584a.js");
var o = require("./e53d.js");
var i = require("./f201.js");
var a = require("./cd78.js");
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