(function () {
  var t = require("./00d8.js");
  var n = require("./9a63.js").utf8;
  var r = require("./044b.js");
  var o = require("./9a63.js").bin;
  function i(A, e) {
    if (A.constructor == String) {
      A = e && e.encoding === "binary" ? o.stringToBytes(A) : n.stringToBytes(A);
    } else if (r(A)) {
      A = Array.prototype.slice.call(A, 0);
    } else if (!Array.isArray(A)) {
      A = A.toString();
    }
    for (var a = t.bytesToWords(A), c = A.length * 8, g = 1732584193, s = -271733879, u = -1732584194, I = 271733878, B = 0; B < a.length; B++) {
      a[B] = (a[B] << 8 | a[B] >>> 24) & 16711935 | (a[B] << 24 | a[B] >>> 8) & -16711936;
    }
    a[c >>> 5] |= 128 << c % 32;
    a[14 + (c + 64 >>> 9 << 4)] = c;
    var f = i._ff;
    var C = i._gg;
    var E = i._hh;
    var l = i._ii;
    for (B = 0; B < a.length; B += 16) {
      var Q = g;
      var d = s;
      var p = u;
      var h = I;
      g = f(g, s, u, I, a[B + 0], 7, -680876936);
      I = f(I, g, s, u, a[B + 1], 12, -389564586);
      u = f(u, I, g, s, a[B + 2], 17, 606105819);
      s = f(s, u, I, g, a[B + 3], 22, -1044525330);
      g = f(g, s, u, I, a[B + 4], 7, -176418897);
      I = f(I, g, s, u, a[B + 5], 12, 1200080426);
      u = f(u, I, g, s, a[B + 6], 17, -1473231341);
      s = f(s, u, I, g, a[B + 7], 22, -45705983);
      g = f(g, s, u, I, a[B + 8], 7, 1770035416);
      I = f(I, g, s, u, a[B + 9], 12, -1958414417);
      u = f(u, I, g, s, a[B + 10], 17, -42063);
      s = f(s, u, I, g, a[B + 11], 22, -1990404162);
      g = f(g, s, u, I, a[B + 12], 7, 1804603682);
      I = f(I, g, s, u, a[B + 13], 12, -40341101);
      u = f(u, I, g, s, a[B + 14], 17, -1502002290);
      g = C(g, s = f(s, u, I, g, a[B + 15], 22, 1236535329), u, I, a[B + 1], 5, -165796510);
      I = C(I, g, s, u, a[B + 6], 9, -1069501632);
      u = C(u, I, g, s, a[B + 11], 14, 643717713);
      s = C(s, u, I, g, a[B + 0], 20, -373897302);
      g = C(g, s, u, I, a[B + 5], 5, -701558691);
      I = C(I, g, s, u, a[B + 10], 9, 38016083);
      u = C(u, I, g, s, a[B + 15], 14, -660478335);
      s = C(s, u, I, g, a[B + 4], 20, -405537848);
      g = C(g, s, u, I, a[B + 9], 5, 568446438);
      I = C(I, g, s, u, a[B + 14], 9, -1019803690);
      u = C(u, I, g, s, a[B + 3], 14, -187363961);
      s = C(s, u, I, g, a[B + 8], 20, 1163531501);
      g = C(g, s, u, I, a[B + 13], 5, -1444681467);
      I = C(I, g, s, u, a[B + 2], 9, -51403784);
      u = C(u, I, g, s, a[B + 7], 14, 1735328473);
      g = E(g, s = C(s, u, I, g, a[B + 12], 20, -1926607734), u, I, a[B + 5], 4, -378558);
      I = E(I, g, s, u, a[B + 8], 11, -2022574463);
      u = E(u, I, g, s, a[B + 11], 16, 1839030562);
      s = E(s, u, I, g, a[B + 14], 23, -35309556);
      g = E(g, s, u, I, a[B + 1], 4, -1530992060);
      I = E(I, g, s, u, a[B + 4], 11, 1272893353);
      u = E(u, I, g, s, a[B + 7], 16, -155497632);
      s = E(s, u, I, g, a[B + 10], 23, -1094730640);
      g = E(g, s, u, I, a[B + 13], 4, 681279174);
      I = E(I, g, s, u, a[B + 0], 11, -358537222);
      u = E(u, I, g, s, a[B + 3], 16, -722521979);
      s = E(s, u, I, g, a[B + 6], 23, 76029189);
      g = E(g, s, u, I, a[B + 9], 4, -640364487);
      I = E(I, g, s, u, a[B + 12], 11, -421815835);
      u = E(u, I, g, s, a[B + 15], 16, 530742520);
      g = l(g, s = E(s, u, I, g, a[B + 2], 23, -995338651), u, I, a[B + 0], 6, -198630844);
      I = l(I, g, s, u, a[B + 7], 10, 1126891415);
      u = l(u, I, g, s, a[B + 14], 15, -1416354905);
      s = l(s, u, I, g, a[B + 5], 21, -57434055);
      g = l(g, s, u, I, a[B + 12], 6, 1700485571);
      I = l(I, g, s, u, a[B + 3], 10, -1894986606);
      u = l(u, I, g, s, a[B + 10], 15, -1051523);
      s = l(s, u, I, g, a[B + 1], 21, -2054922799);
      g = l(g, s, u, I, a[B + 8], 6, 1873313359);
      I = l(I, g, s, u, a[B + 15], 10, -30611744);
      u = l(u, I, g, s, a[B + 6], 15, -1560198380);
      s = l(s, u, I, g, a[B + 13], 21, 1309151649);
      g = l(g, s, u, I, a[B + 4], 6, -145523070);
      I = l(I, g, s, u, a[B + 11], 10, -1120210379);
      u = l(u, I, g, s, a[B + 2], 15, 718787259);
      s = l(s, u, I, g, a[B + 9], 21, -343485551);
      g = g + Q >>> 0;
      s = s + d >>> 0;
      u = u + p >>> 0;
      I = I + h >>> 0;
    }
    return t.endian([g, s, u, I]);
  }
  i._ff = function (A, t, e, n, r, o, i) {
    var a = A + (t & e | ~t & n) + (r >>> 0) + i;
    return (a << o | a >>> 32 - o) + t;
  };
  i._gg = function (A, t, e, n, r, o, i) {
    var a = A + (t & n | e & ~n) + (r >>> 0) + i;
    return (a << o | a >>> 32 - o) + t;
  };
  i._hh = function (A, t, e, n, r, o, i) {
    var a = A + (t ^ e ^ n) + (r >>> 0) + i;
    return (a << o | a >>> 32 - o) + t;
  };
  i._ii = function (A, t, e, n, r, o, i) {
    var a = A + (e ^ (t | ~n)) + (r >>> 0) + i;
    return (a << o | a >>> 32 - o) + t;
  };
  i._blocksize = 16;
  i._digestsize = 16;
  module.exports = function (A, e) {
    if (A == null) {
      throw new Error("Illegal argument " + A);
    }
    var n = t.wordsToBytes(i(A, e));
    if (e && e.asBytes) {
      return n;
    } else if (e && e.asString) {
      return o.bytesToString(n);
    } else {
      return t.bytesToHex(n);
    }
  };
})();