var n = require("./cb7c.js");
var r = require("./1495.js");
var o = require("./e11e.js");
var i = require("./613b.js")("IE_PROTO");
function a() {}
var c = "prototype";
function g() {
  var A;
  var t = require("./230e.js")("iframe");
  var n = o.length;
  t.style.display = "none";
  require("./fab2.js").appendChild(t);
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