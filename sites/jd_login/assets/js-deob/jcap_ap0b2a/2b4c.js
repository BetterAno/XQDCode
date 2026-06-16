var n = require("./5537.js")("wks");
var r = require("./ca5a.js");
var o = require("./7726.js").Symbol;
var i = typeof o == "function";
(module.exports = function (A) {
  return n[A] ||= i && o[A] || (i ? o : r)("Symbol." + A);
}).store = n;