var n = require("./e4ae.js");
var r = require("./7e90.js");
var o = require("./1691.js");
var i = require("./5559.js")("IE_PROTO");
function a() {}
var c = "prototype";
function g() {
  var A;
  var t = require("./1ec9.js")("iframe");
  var n = o.length;
  t.style.display = "none";
  require("./32fc.js").appendChild(t);
  t.src = "javascript:";
  (A = t.contentWindow.document).open();
  A.write("<script>document.F=Object</script>");
  A.close();
  g = A.F;
  while (n--) {
    delete g[c][o[n]];
  }
  return g();
}
module.exports = Object.create || function (A, t) {
  var e;
  if (A !== null) {
    a[c] = n(A);
    e = new a();
    a[c] = null;
    e[i] = A;
  } else {
    e = g();
  }
  if (t === undefined) {
    return e;
  } else {
    return r(e, t);
  }
};