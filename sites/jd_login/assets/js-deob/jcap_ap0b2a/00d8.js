(function () {
  var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var e = {
    rotl: function (A, t) {
      return A << t | A >>> 32 - t;
    },
    rotr: function (A, t) {
      return A << 32 - t | A >>> t;
    },
    endian: function (A) {
      if (A.constructor == Number) {
        return e.rotl(A, 8) & 16711935 | e.rotl(A, 24) & -16711936;
      }
      for (var t = 0; t < A.length; t++) {
        A[t] = e.endian(A[t]);
      }
      return A;
    },
    randomBytes: function (A) {
      var t = [];
      for (; A > 0; A--) {
        t.push(Math.floor(Math.random() * 256));
      }
      return t;
    },
    bytesToWords: function (A) {
      var t = [];
      for (var e = 0, n = 0; e < A.length; e++, n += 8) {
        t[n >>> 5] |= A[e] << 24 - n % 32;
      }
      return t;
    },
    wordsToBytes: function (A) {
      var t = [];
      for (var e = 0; e < A.length * 32; e += 8) {
        t.push(A[e >>> 5] >>> 24 - e % 32 & 255);
      }
      return t;
    },
    bytesToHex: function (A) {
      var t = [];
      for (var e = 0; e < A.length; e++) {
        t.push((A[e] >>> 4).toString(16));
        t.push((A[e] & 15).toString(16));
      }
      return t.join("");
    },
    hexToBytes: function (A) {
      var t = [];
      for (var e = 0; e < A.length; e += 2) {
        t.push(parseInt(A.substr(e, 2), 16));
      }
      return t;
    },
    bytesToBase64: function (A) {
      var e = [];
      for (var n = 0; n < A.length; n += 3) {
        var r = A[n] << 16 | A[n + 1] << 8 | A[n + 2];
        for (var o = 0; o < 4; o++) {
          if (n * 8 + o * 6 <= A.length * 8) {
            e.push(t.charAt(r >>> (3 - o) * 6 & 63));
          } else {
            e.push("=");
          }
        }
      }
      return e.join("");
    },
    base64ToBytes: function (A) {
      A = A.replace(/[^A-Z0-9+\/]/gi, "");
      var e = [];
      for (var n = 0, r = 0; n < A.length; r = ++n % 4) {
        if (r != 0) {
          e.push((t.indexOf(A.charAt(n - 1)) & Math.pow(2, r * -2 + 8) - 1) << r * 2 | t.indexOf(A.charAt(n)) >>> 6 - r * 2);
        }
      }
      return e;
    }
  };
  module.exports = e;
})();