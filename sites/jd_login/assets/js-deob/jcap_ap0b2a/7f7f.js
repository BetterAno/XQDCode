var n = require("./86cc.js").f;
var r = Function.prototype;
var o = /^\s*function ([^ (]*)/;
var i = "name";
if (!(i in r)) {
  if (require("./9e1e.js")) {
    n(r, i, {
      configurable: true,
      get: function () {
        try {
          return ("" + this).match(o)[1];
        } catch (A) {
          return "";
        }
      }
    });
  }
}