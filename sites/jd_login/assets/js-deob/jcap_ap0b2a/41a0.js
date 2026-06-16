var n = require("./2aeb.js");
var r = require("./4630.js");
var o = require("./7f20.js");
var i = {};
require("./32e9.js")(i, require("./2b4c.js")("iterator"), function () {
  return this;
});
module.exports = function (A, t, e) {
  A.prototype = n(i, {
    next: r(1, e)
  });
  o(A, t + " Iterator");
};