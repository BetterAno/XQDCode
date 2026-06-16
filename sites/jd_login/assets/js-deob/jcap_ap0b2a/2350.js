function e(A, t) {
  var e = A[1] || "";
  var n = A[3];
  if (!n) {
    return e;
  }
  if (t && typeof btoa == "function") {
    var r = function (A) {
      var t = btoa(unescape(encodeURIComponent(JSON.stringify(A))));
      var e = "sourceMappingURL=data:application/json;charset=utf-8;base64," + t;
      return "/*# " + e + " */";
    }(n);
    var o = n.sources.map(function (A) {
      return "/*# sourceURL=" + n.sourceRoot + A + " */";
    });
    return [e].concat(o).concat([r]).join("\n");
  }
  return [e].join("\n");
}
module.exports = function (A) {
  var t = [];
  t.toString = function () {
    return this.map(function (t) {
      var n = e(t, A);
      if (t[2]) {
        return "@media " + t[2] + "{" + n + "}";
      } else {
        return n;
      }
    }).join("");
  };
  t.i = function (A, e) {
    if (typeof A == "string") {
      A = [[null, A, ""]];
    }
    var n = {};
    for (var r = 0; r < this.length; r++) {
      var o = this[r][0];
      if (typeof o == "number") {
        n[o] = true;
      }
    }
    for (r = 0; r < A.length; r++) {
      var i = A[r];
      if (typeof i[0] != "number" || !n[i[0]]) {
        if (e && !i[2]) {
          i[2] = e;
        } else if (e) {
          i[2] = "(" + i[2] + ") and (" + e + ")";
        }
        t.push(i);
      }
    }
  };
  return t;
};