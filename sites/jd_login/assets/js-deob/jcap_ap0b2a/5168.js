var n = require("./dbdb.js")("wks");
var r = require("./62a0.js");
var o = require("./e53d.js").Symbol;
var i = typeof o == "function";
(module.exports = function (A) {
  return n[A] ||= i && o[A] || (i ? o : r)("Symbol." + A);
}).store = n;