var n = require("./63b6.js");
var r = require("./584a.js");
var o = require("./294c.js");
module.exports = function (A, t) {
  var e = (r.Object || {})[A] || Object[A];
  var i = {};
  i[A] = t(e);
  n(n.S + n.F * o(function () {
    e(1);
  }), "Object", i);
};