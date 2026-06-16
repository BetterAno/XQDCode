var n = require("./a159.js");
var r = require("./aebd.js");
var o = require("./45f2.js");
var i = {};
require("./35e8.js")(i, require("./5168.js")("iterator"), function () {
  return this;
});
module.exports = function (A, t, e) {
  A.prototype = n(i, {
    next: r(1, e)
  });
  o(A, t + " Iterator");
};