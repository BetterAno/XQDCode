var n = require("./7726.js");
var r = require("./86cc.js");
var o = require("./9e1e.js");
var i = require("./2b4c.js")("species");
module.exports = function (A) {
  var t = n[A];
  if (o && t && !t[i]) {
    r.f(t, i, {
      configurable: true,
      get: function () {
        return this;
      }
    });
  }
};