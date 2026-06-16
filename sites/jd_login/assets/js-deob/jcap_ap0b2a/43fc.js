var n = require("./63b6.js");
var r = require("./656e.js");
var o = require("./4439.js");
n(n.S, "Promise", {
  try: function (A) {
    var t = r.f(this);
    var e = o(A);
    (e.e ? t.reject : t.resolve)(e.v);
    return t.promise;
  }
});