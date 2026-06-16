var n = require("./e53d.js");
var r = require("./584a.js");
var o = require("./d9f6.js");
var i = require("./8e60.js");
var a = require("./5168.js")("species");
module.exports = function (A) {
  var t = typeof r[A] == "function" ? r[A] : n[A];
  if (i && t && !t[a]) {
    o.f(t, a, {
      configurable: true,
      get: function () {
        return this;
      }
    });
  }
};