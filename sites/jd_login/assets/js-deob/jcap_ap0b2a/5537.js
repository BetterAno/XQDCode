var n = require("./8378.js");
var r = require("./7726.js");
var o = "__core-js_shared__";
var i = r[o] ||= {};
(module.exports = function (A, t) {
  return i[A] ||= t !== undefined ? t : {};
})("versions", []).push({
  version: n.version,
  mode: require("./2d00.js") ? "pure" : "global",
  copyright: "© 2020 Denis Pushkarev (zloirock.ru)"
});