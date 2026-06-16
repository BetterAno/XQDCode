var n = function (A) {
  "use strict";

  var t;
  var e = Object.prototype;
  var n = e.hasOwnProperty;
  var r = Object.defineProperty || function (A, t, e) {
    A[t] = e.value;
  };
  var o = typeof Symbol == "function" ? Symbol : {};
  var i = o.iterator || "@@iterator";
  var a = o.asyncIterator || "@@asyncIterator";
  var c = o.toStringTag || "@@toStringTag";
  function g(A, t, e) {
    Object.defineProperty(A, t, {
      value: e,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return A[t];
  }
  try {
    g({}, "");
  } catch (A) {
    g = function (A, t, e) {
      return A[t] = e;
    };
  }
  function s(A, t, e, n) {
    var o = t && t.prototype instanceof l ? t : l;
    var i = Object.create(o.prototype);
    var a = new _(n || []);
    r(i, "_invoke", {
      value: b(A, e, a)
    });
    return i;
  }
  function u(A, t, e) {
    try {
      return {
        type: "normal",
        arg: A.call(t, e)
      };
    } catch (A) {
      return {
        type: "throw",
        arg: A
      };
    }
  }
  A.wrap = s;
  var I = "suspendedStart";
  var B = "suspendedYield";
  var f = "executing";
  var C = "completed";
  var E = {};
  function l() {}
  function Q() {}
  function d() {}
  var p = {};
  g(p, i, function () {
    return this;
  });
  var h = Object.getPrototypeOf;
  var v = h && h(h(x([])));
  if (v && v !== e && n.call(v, i)) {
    p = v;
  }
  var y = d.prototype = l.prototype = Object.create(p);
  function m(A) {
    ["next", "throw", "return"].forEach(function (t) {
      g(A, t, function (A) {
        return this._invoke(t, A);
      });
    });
  }
  function w(A, t) {
    function e(r, o, i, a) {
      var c = u(A[r], A, o);
      if (c.type !== "throw") {
        var g = c.arg;
        var s = g.value;
        if (s && typeof s == "object" && n.call(s, "__await")) {
          return t.resolve(s.__await).then(function (A) {
            e("next", A, i, a);
          }, function (A) {
            e("throw", A, i, a);
          });
        } else {
          return t.resolve(s).then(function (A) {
            g.value = A;
            i(g);
          }, function (A) {
            return e("throw", A, i, a);
          });
        }
      }
      a(c.arg);
    }
    var o;
    r(this, "_invoke", {
      value: function (A, n) {
        function r() {
          return new t(function (t, r) {
            e(A, n, t, r);
          });
        }
        return o = o ? o.then(r, r) : r();
      }
    });
  }
  function b(A, t, e) {
    var n = I;
    return function (r, o) {
      if (n === f) {
        throw new Error("Generator is already running");
      }
      if (n === C) {
        if (r === "throw") {
          throw o;
        }
        return M();
      }
      e.method = r;
      e.arg = o;
      while (true) {
        var i = e.delegate;
        if (i) {
          var a = D(i, e);
          if (a) {
            if (a === E) {
              continue;
            }
            return a;
          }
        }
        if (e.method === "next") {
          e.sent = e._sent = e.arg;
        } else if (e.method === "throw") {
          if (n === I) {
            n = C;
            throw e.arg;
          }
          e.dispatchException(e.arg);
        } else if (e.method === "return") {
          e.abrupt("return", e.arg);
        }
        n = f;
        var c = u(A, t, e);
        if (c.type === "normal") {
          n = e.done ? C : B;
          if (c.arg === E) {
            continue;
          }
          return {
            value: c.arg,
            done: e.done
          };
        }
        if (c.type === "throw") {
          n = C;
          e.method = "throw";
          e.arg = c.arg;
        }
      }
    };
  }
  function D(A, e) {
    var n = e.method;
    var r = A.iterator[n];
    if (r === t) {
      e.delegate = null;
      if (n !== "throw" || !A.iterator.return || !(e.method = "return", e.arg = t, D(A, e), e.method === "throw")) {
        if (n !== "return") {
          e.method = "throw";
          e.arg = new TypeError("The iterator does not provide a '" + n + "' method");
        }
      }
      return E;
    }
    var o = u(r, A.iterator, e.arg);
    if (o.type === "throw") {
      e.method = "throw";
      e.arg = o.arg;
      e.delegate = null;
      return E;
    }
    var i = o.arg;
    if (i) {
      if (i.done) {
        e[A.resultName] = i.value;
        e.next = A.nextLoc;
        if (e.method !== "return") {
          e.method = "next";
          e.arg = t;
        }
        e.delegate = null;
        return E;
      } else {
        return i;
      }
    } else {
      e.method = "throw";
      e.arg = new TypeError("iterator result is not an object");
      e.delegate = null;
      return E;
    }
  }
  function k(A) {
    var t = {
      tryLoc: A[0]
    };
    if (1 in A) {
      t.catchLoc = A[1];
    }
    if (2 in A) {
      t.finallyLoc = A[2];
      t.afterLoc = A[3];
    }
    this.tryEntries.push(t);
  }
  function S(A) {
    var t = A.completion || {};
    t.type = "normal";
    delete t.arg;
    A.completion = t;
  }
  function _(A) {
    this.tryEntries = [{
      tryLoc: "root"
    }];
    A.forEach(k, this);
    this.reset(true);
  }
  function x(A) {
    if (A != null) {
      var e = A[i];
      if (e) {
        return e.call(A);
      }
      if (typeof A.next == "function") {
        return A;
      }
      if (!isNaN(A.length)) {
        var r = -1;
        var o = function e() {
          while (++r < A.length) {
            if (n.call(A, r)) {
              e.value = A[r];
              e.done = false;
              return e;
            }
          }
          e.value = t;
          e.done = true;
          return e;
        };
        return o.next = o;
      }
    }
    throw new TypeError(typeof A + " is not iterable");
  }
  function M() {
    return {
      value: t,
      done: true
    };
  }
  Q.prototype = d;
  r(y, "constructor", {
    value: d,
    configurable: true
  });
  r(d, "constructor", {
    value: Q,
    configurable: true
  });
  Q.displayName = g(d, c, "GeneratorFunction");
  A.isGeneratorFunction = function (A) {
    var t = typeof A == "function" && A.constructor;
    return !!t && (t === Q || (t.displayName || t.name) === "GeneratorFunction");
  };
  A.mark = function (A) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(A, d);
    } else {
      A.__proto__ = d;
      g(A, c, "GeneratorFunction");
    }
    A.prototype = Object.create(y);
    return A;
  };
  A.awrap = function (A) {
    return {
      __await: A
    };
  };
  m(w.prototype);
  g(w.prototype, a, function () {
    return this;
  });
  A.AsyncIterator = w;
  A.async = function (t, e, n, r, o = Promise) {
    var i = new w(s(t, e, n, r), o);
    if (A.isGeneratorFunction(e)) {
      return i;
    } else {
      return i.next().then(function (A) {
        if (A.done) {
          return A.value;
        } else {
          return i.next();
        }
      });
    }
  };
  m(y);
  g(y, c, "Generator");
  g(y, i, function () {
    return this;
  });
  g(y, "toString", function () {
    return "[object Generator]";
  });
  A.keys = function (A) {
    var t = Object(A);
    var e = [];
    for (var n in t) {
      e.push(n);
    }
    e.reverse();
    return function A() {
      while (e.length) {
        var n = e.pop();
        if (n in t) {
          A.value = n;
          A.done = false;
          return A;
        }
      }
      A.done = true;
      return A;
    };
  };
  A.values = x;
  _.prototype = {
    constructor: _,
    reset: function (A) {
      this.prev = 0;
      this.next = 0;
      this.sent = this._sent = t;
      this.done = false;
      this.delegate = null;
      this.method = "next";
      this.arg = t;
      this.tryEntries.forEach(S);
      if (!A) {
        for (var e in this) {
          if (e.charAt(0) === "t" && n.call(this, e) && !isNaN(+e.slice(1))) {
            this[e] = t;
          }
        }
      }
    },
    stop: function () {
      this.done = true;
      var A = this.tryEntries[0].completion;
      if (A.type === "throw") {
        throw A.arg;
      }
      return this.rval;
    },
    dispatchException: function (A) {
      if (this.done) {
        throw A;
      }
      var e = this;
      function r(n, r) {
        a.type = "throw";
        a.arg = A;
        e.next = n;
        if (r) {
          e.method = "next";
          e.arg = t;
        }
        return !!r;
      }
      for (var o = this.tryEntries.length - 1; o >= 0; --o) {
        var i = this.tryEntries[o];
        var a = i.completion;
        if (i.tryLoc === "root") {
          return r("end");
        }
        if (i.tryLoc <= this.prev) {
          var c = n.call(i, "catchLoc");
          var g = n.call(i, "finallyLoc");
          if (c && g) {
            if (this.prev < i.catchLoc) {
              return r(i.catchLoc, true);
            }
            if (this.prev < i.finallyLoc) {
              return r(i.finallyLoc);
            }
          } else if (c) {
            if (this.prev < i.catchLoc) {
              return r(i.catchLoc, true);
            }
          } else {
            if (!g) {
              throw new Error("try statement without catch or finally");
            }
            if (this.prev < i.finallyLoc) {
              return r(i.finallyLoc);
            }
          }
        }
      }
    },
    abrupt: function (A, t) {
      for (var e = this.tryEntries.length - 1; e >= 0; --e) {
        var r = this.tryEntries[e];
        if (r.tryLoc <= this.prev && n.call(r, "finallyLoc") && this.prev < r.finallyLoc) {
          var o = r;
          break;
        }
      }
      if (o && (A === "break" || A === "continue") && o.tryLoc <= t && t <= o.finallyLoc) {
        o = null;
      }
      var i = o ? o.completion : {};
      i.type = A;
      i.arg = t;
      if (o) {
        this.method = "next";
        this.next = o.finallyLoc;
        return E;
      } else {
        return this.complete(i);
      }
    },
    complete: function (A, t) {
      if (A.type === "throw") {
        throw A.arg;
      }
      if (A.type === "break" || A.type === "continue") {
        this.next = A.arg;
      } else if (A.type === "return") {
        this.rval = this.arg = A.arg;
        this.method = "return";
        this.next = "end";
      } else if (A.type === "normal" && t) {
        this.next = t;
      }
      return E;
    },
    finish: function (A) {
      for (var t = this.tryEntries.length - 1; t >= 0; --t) {
        var e = this.tryEntries[t];
        if (e.finallyLoc === A) {
          this.complete(e.completion, e.afterLoc);
          S(e);
          return E;
        }
      }
    },
    catch: function (A) {
      for (var t = this.tryEntries.length - 1; t >= 0; --t) {
        var e = this.tryEntries[t];
        if (e.tryLoc === A) {
          var n = e.completion;
          if (n.type === "throw") {
            var r = n.arg;
            S(e);
          }
          return r;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function (A, e, n) {
      this.delegate = {
        iterator: x(A),
        resultName: e,
        nextLoc: n
      };
      if (this.method === "next") {
        this.arg = t;
      }
      return E;
    }
  };
  return A;
}(module.exports);
try {
  regeneratorRuntime = n;
} catch (A) {
  if (typeof globalThis == "object") {
    globalThis.regeneratorRuntime = n;
  } else {
    Function("r", "regeneratorRuntime = r")(n);
  }
}