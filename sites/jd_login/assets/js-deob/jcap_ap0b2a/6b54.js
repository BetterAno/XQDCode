require("./3846.js");
var n = require("./cb7c.js");
var r = require("./0bfb.js");
var o = require("./9e1e.js");
var i = "toString";
var a = /./[i];
function c(A) {
  require("./2aba.js")(RegExp.prototype, i, A, true);
}
if (require("./79e5.js")(function () {
  return a.call({
    source: "a",
    flags: "b"
  }) != "/a/b";
})) {
  c(function () {
    var A = n(this);
    return `/${A.source}/${"flags" in A ? A.flags : !o && A instanceof RegExp ? r.call(A) : undefined}`;
  });
} else if (a.name != i) {
  c(function () {
    return a.call(this);
  });
}