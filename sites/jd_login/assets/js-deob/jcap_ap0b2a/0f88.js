var n;
var r = require("./7726.js");
for (var o = require("./32e9.js"), i = require("./ca5a.js"), a = i("typed_array"), c = i("view"), g = !!r.ArrayBuffer && !!r.DataView, s = g, u = 0, I = "Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array".split(","); u < 9;) {
  if (n = r[I[u++]]) {
    o(n.prototype, a, true);
    o(n.prototype, c, true);
  } else {
    s = false;
  }
}
module.exports = {
  ABV: g,
  CONSTR: s,
  TYPED: a,
  VIEW: c
};