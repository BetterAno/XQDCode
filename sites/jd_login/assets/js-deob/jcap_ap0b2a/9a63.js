var e = {
  utf8: {
    stringToBytes: function (A) {
      return e.bin.stringToBytes(unescape(encodeURIComponent(A)));
    },
    bytesToString: function (A) {
      return decodeURIComponent(escape(e.bin.bytesToString(A)));
    }
  },
  bin: {
    stringToBytes: function (A) {
      var t = [];
      for (var e = 0; e < A.length; e++) {
        t.push(A.charCodeAt(e) & 255);
      }
      return t;
    },
    bytesToString: function (A) {
      var t = [];
      for (var e = 0; e < A.length; e++) {
        t.push(String.fromCharCode(A[e]));
      }
      return t.join("");
    }
  }
};
module.exports = e;