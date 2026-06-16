var n = require("./9093.js");
var r = require("./2621.js");
var o = require("./cb7c.js");
var i = require("./7726.js").Reflect;
module.exports = i && i.ownKeys || function (A) {
  var t = n.f(o(A));
  var e = r.f;
  if (e) {
    return t.concat(e(A));
  } else {
    return t;
  }
};