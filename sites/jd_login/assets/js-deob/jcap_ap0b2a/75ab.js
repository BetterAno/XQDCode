var A = require("./c8ba.js");
(function (A) {
  "use strict";

  var t = A.URLSearchParams && A.URLSearchParams.prototype.get ? A.URLSearchParams : null;
  var e = t && new t({
    a: 1
  }).toString() === "a=1";
  var n = t && new t("s=%2B").get("s") === "+";
  var r = "__URLSearchParams__";
  var o = !t || function () {
    var A = new t();
    A.append("s", " &");
    return A.toString() === "s=+%26";
  }();
  var i = s.prototype;
  var a = !!A.Symbol && !!A.Symbol.iterator;
  if (!t || !e || !n || !o) {
    i.append = function (A, t) {
      C(this[r], A, t);
    };
    i.delete = function (A) {
      delete this[r][A];
    };
    i.get = function (A) {
      var t = this[r];
      if (A in t) {
        return t[A][0];
      } else {
        return null;
      }
    };
    i.getAll = function (A) {
      var t = this[r];
      if (A in t) {
        return t[A].slice(0);
      } else {
        return [];
      }
    };
    i.has = function (A) {
      return A in this[r];
    };
    i.set = function (A, t) {
      this[r][A] = ["" + t];
    };
    i.toString = function () {
      var A;
      var t;
      var e;
      var n;
      var o = this[r];
      var i = [];
      for (t in o) {
        e = u(t);
        A = 0;
        n = o[t];
        for (; A < n.length; A++) {
          i.push(e + "=" + u(n[A]));
        }
      }
      return i.join("&");
    };
    var c = !!n && t && !e && A.Proxy;
    Object.defineProperty(A, "URLSearchParams", {
      value: c ? new Proxy(t, {
        construct: function (A, t) {
          return new A(new s(t[0]).toString());
        }
      }) : s
    });
    var g = A.URLSearchParams.prototype;
    g.polyfill = true;
    g.forEach = g.forEach || function (A, t) {
      var e = f(this.toString());
      Object.getOwnPropertyNames(e).forEach(function (n) {
        e[n].forEach(function (e) {
          A.call(t, e, n, this);
        }, this);
      }, this);
    };
    g.sort = g.sort || function () {
      var A;
      var t;
      var e;
      var n = f(this.toString());
      var r = [];
      for (A in n) {
        r.push(A);
      }
      r.sort();
      t = 0;
      for (; t < r.length; t++) {
        this.delete(r[t]);
      }
      for (t = 0; t < r.length; t++) {
        var o = r[t];
        var i = n[o];
        for (e = 0; e < i.length; e++) {
          this.append(o, i[e]);
        }
      }
    };
    g.keys = g.keys || function () {
      var A = [];
      this.forEach(function (t, e) {
        A.push(e);
      });
      return B(A);
    };
    g.values = g.values || function () {
      var A = [];
      this.forEach(function (t) {
        A.push(t);
      });
      return B(A);
    };
    g.entries = g.entries || function () {
      var A = [];
      this.forEach(function (t, e) {
        A.push([e, t]);
      });
      return B(A);
    };
    if (a) {
      g[A.Symbol.iterator] = g[A.Symbol.iterator] || g.entries;
    }
  }
  function s(A) {
    if ((A = A || "") instanceof URLSearchParams || A instanceof s) {
      A = A.toString();
    }
    this[r] = f(A);
  }
  function u(A) {
    var t = {
      "!": "%21",
      "'": "%27",
      "(": "%28",
      ")": "%29",
      "~": "%7E",
      "%20": "+",
      "%00": "\0"
    };
    return encodeURIComponent(A).replace(/[!'\(\)~]|%20|%00/g, function (A) {
      return t[A];
    });
  }
  function I(A) {
    return A.replace(/[ +]/g, "%20").replace(/(%[a-f0-9]{2})+/gi, function (A) {
      return decodeURIComponent(A);
    });
  }
  function B(t) {
    var e = {
      next: function () {
        var A = t.shift();
        return {
          done: A === undefined,
          value: A
        };
      }
    };
    if (a) {
      e[A.Symbol.iterator] = function () {
        return e;
      };
    }
    return e;
  }
  function f(A) {
    var t = {};
    if (typeof A == "object") {
      if (E(A)) {
        for (var e = 0; e < A.length; e++) {
          var n = A[e];
          if (!E(n) || n.length !== 2) {
            throw new TypeError("Failed to construct 'URLSearchParams': Sequence initializer must only contain pair elements");
          }
          C(t, n[0], n[1]);
        }
      } else {
        for (var r in A) {
          if (A.hasOwnProperty(r)) {
            C(t, r, A[r]);
          }
        }
      }
    } else {
      if (A.indexOf("?") === 0) {
        A = A.slice(1);
      }
      for (var o = A.split("&"), i = 0; i < o.length; i++) {
        var a = o[i];
        var c = a.indexOf("=");
        if (c > -1) {
          C(t, I(a.slice(0, c)), I(a.slice(c + 1)));
        } else if (a) {
          C(t, I(a), "");
        }
      }
    }
    return t;
  }
  function C(A, t, e) {
    var n = typeof e == "string" ? e : e != null && typeof e.toString == "function" ? e.toString() : JSON.stringify(e);
    if (t in A) {
      A[t].push(n);
    } else {
      A[t] = [n];
    }
  }
  function E(A) {
    return !!A && Object.prototype.toString.call(A) === "[object Array]";
  }
})(A !== undefined ? A : typeof window != "undefined" ? window : this);