module.exports = I;
module.exports.match = function (A, t) {
  var e = [];
  var n = I(A, e, t);
  return i(n, e);
};
module.exports.regexpToFunction = i;
module.exports.parse = r;
module.exports.compile = function (A, t) {
  return a(r(A, t), t);
};
module.exports.tokensToFunction = a;
module.exports.tokensToRegExp = u;
var e = "/";
var n = new RegExp(["(\\\\.)", "(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?"].join("|"), "g");
function r(A, t) {
  for (var r, i = [], a = 0, c = 0, s = "", u = t && t.delimiter || e, I = t && t.whitelist || undefined, B = false; (r = n.exec(A)) !== null;) {
    var f = r[0];
    var C = r[1];
    var E = r.index;
    s += A.slice(c, E);
    c = E + f.length;
    if (C) {
      s += C[1];
      B = true;
    } else {
      var l = "";
      var Q = r[2];
      var d = r[3];
      var p = r[4];
      var h = r[5];
      if (!B && s.length) {
        var v = s.length - 1;
        var y = s[v];
        if (!I || I.indexOf(y) > -1) {
          l = y;
          s = s.slice(0, v);
        }
      }
      if (s) {
        i.push(s);
        s = "";
        B = false;
      }
      var m = h === "+" || h === "*";
      var w = h === "?" || h === "*";
      var b = d || p;
      var D = l || u;
      var k = l || (typeof i[i.length - 1] == "string" ? i[i.length - 1] : "");
      i.push({
        name: Q || a++,
        prefix: l,
        delimiter: D,
        optional: w,
        repeat: m,
        pattern: b ? g(b) : o(D, u, k)
      });
    }
  }
  if (s || c < A.length) {
    i.push(s + A.substr(c));
  }
  return i;
}
function o(A, t, e) {
  var n = "[^" + c(A === t ? A : A + t) + "]";
  if (!e || e.indexOf(A) > -1 || e.indexOf(t) > -1) {
    return n + "+?";
  } else {
    return c(e) + "|(?:(?!" + c(e) + ")" + n + ")+?";
  }
}
function i(A, t) {
  return function (e, n) {
    var r = A.exec(e);
    if (!r) {
      return false;
    }
    var o = r[0];
    var i = r.index;
    var a = {};
    var c = n && n.decode || decodeURIComponent;
    for (var g = 1; g < r.length; g++) {
      if (r[g] !== undefined) {
        var s = t[g - 1];
        if (s.repeat) {
          a[s.name] = r[g].split(s.delimiter).map(function (A) {
            return c(A, s);
          });
        } else {
          a[s.name] = c(r[g], s);
        }
      }
    }
    return {
      path: o,
      index: i,
      params: a
    };
  };
}
function a(A, t) {
  var e = new Array(A.length);
  for (var n = 0; n < A.length; n++) {
    if (typeof A[n] == "object") {
      e[n] = new RegExp("^(?:" + A[n].pattern + ")$", s(t));
    }
  }
  return function (t, n) {
    var r = "";
    var o = n && n.encode || encodeURIComponent;
    var i = !n || n.validate !== false;
    for (var a = 0; a < A.length; a++) {
      var c = A[a];
      if (typeof c != "string") {
        var g;
        var s = t ? t[c.name] : undefined;
        if (Array.isArray(s)) {
          if (!c.repeat) {
            throw new TypeError("Expected \"" + c.name + "\" to not repeat, but got array");
          }
          if (s.length === 0) {
            if (c.optional) {
              continue;
            }
            throw new TypeError("Expected \"" + c.name + "\" to not be empty");
          }
          for (var u = 0; u < s.length; u++) {
            g = o(s[u], c);
            if (i && !e[a].test(g)) {
              throw new TypeError("Expected all \"" + c.name + "\" to match \"" + c.pattern + "\"");
            }
            r += (u === 0 ? c.prefix : c.delimiter) + g;
          }
        } else if (typeof s != "string" && typeof s != "number" && typeof s != "boolean") {
          if (!c.optional) {
            throw new TypeError("Expected \"" + c.name + "\" to be " + (c.repeat ? "an array" : "a string"));
          }
        } else {
          g = o(String(s), c);
          if (i && !e[a].test(g)) {
            throw new TypeError("Expected \"" + c.name + "\" to match \"" + c.pattern + "\", but got \"" + g + "\"");
          }
          r += c.prefix + g;
        }
      } else {
        r += c;
      }
    }
    return r;
  };
}
function c(A) {
  return A.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
function g(A) {
  return A.replace(/([=!:$/()])/g, "\\$1");
}
function s(A) {
  if (A && A.sensitive) {
    return "";
  } else {
    return "i";
  }
}
function u(A, t, n) {
  var r = (n = n || {}).strict;
  var o = n.start !== false;
  var i = n.end !== false;
  var a = n.delimiter || e;
  var g = [].concat(n.endsWith || []).map(c).concat("$").join("|");
  var u = o ? "^" : "";
  for (var I = 0; I < A.length; I++) {
    var B = A[I];
    if (typeof B == "string") {
      u += c(B);
    } else {
      var f = B.repeat ? "(?:" + B.pattern + ")(?:" + c(B.delimiter) + "(?:" + B.pattern + "))*" : B.pattern;
      if (t) {
        t.push(B);
      }
      if (B.optional) {
        if (B.prefix) {
          u += "(?:" + c(B.prefix) + "(" + f + "))?";
        } else {
          u += "(" + f + ")?";
        }
      } else {
        u += c(B.prefix) + "(" + f + ")";
      }
    }
  }
  if (i) {
    if (!r) {
      u += "(?:" + c(a) + ")?";
    }
    u += g === "$" ? "$" : "(?=" + g + ")";
  } else {
    var C = A[A.length - 1];
    var E = typeof C == "string" ? C[C.length - 1] === a : C === undefined;
    if (!r) {
      u += "(?:" + c(a) + "(?=" + g + "))?";
    }
    if (!E) {
      u += "(?=" + c(a) + "|" + g + ")";
    }
  }
  return new RegExp(u, s(n));
}
function I(A, t, e) {
  if (A instanceof RegExp) {
    return function (A, t) {
      if (!t) {
        return A;
      }
      var e = A.source.match(/\((?!\?)/g);
      if (e) {
        for (var n = 0; n < e.length; n++) {
          t.push({
            name: n,
            prefix: null,
            delimiter: null,
            optional: false,
            repeat: false,
            pattern: null
          });
        }
      }
      return A;
    }(A, t);
  } else if (Array.isArray(A)) {
    return function (A, t, e) {
      var n = [];
      for (var r = 0; r < A.length; r++) {
        n.push(I(A[r], t, e).source);
      }
      return new RegExp("(?:" + n.join("|") + ")", s(e));
    }(A, t, e);
  } else {
    return function (A, t, e) {
      return u(r(A, e), t, e);
    }(A, t, e);
  }
}