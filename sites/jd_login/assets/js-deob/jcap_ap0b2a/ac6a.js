var n = require("./cadf.js");
var r = require("./0d58.js");
var o = require("./2aba.js");
var i = require("./7726.js");
var a = require("./32e9.js");
var c = require("./84f2.js");
var g = require("./2b4c.js");
var s = g("iterator");
var u = g("toStringTag");
var I = c.Array;
var B = {
  CSSRuleList: true,
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true,
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true,
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};
for (var f = r(B), C = 0; C < f.length; C++) {
  var E;
  var l = f[C];
  var Q = B[l];
  var d = i[l];
  var p = d && d.prototype;
  if (p && (p[s] || a(p, s, I), p[u] || a(p, u, l), c[l] = I, Q)) {
    for (E in n) {
      if (!p[E]) {
        o(p, E, n[E], true);
      }
    }
  }
}