var n = require("./584a.js");
var r = require("./e53d.js");
var o = "__core-js_shared__";
var i = r[o] ||= {};
(module.exports = function (A, t) {
  return i[A] ||= t !== undefined ? t : {};
})("versions", []).push({
  version: n.version,
  mode: require("./b8e3.js") ? "pure" : "global",
  copyright: "© 2020 Denis Pushkarev (zloirock.ru)"
});