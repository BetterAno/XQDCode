require("./c367.js");
var n = require("./e53d.js");
var r = require("./35e8.js");
var o = require("./481b.js");
var i = require("./5168.js")("toStringTag");
for (var a = "CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,TextTrackList,TouchList".split(","), c = 0; c < a.length; c++) {
  var g = a[c];
  var s = n[g];
  var u = s && s.prototype;
  if (u && !u[i]) {
    r(u, i, g);
  }
  o[g] = o.Array;
}