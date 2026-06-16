var e;
var n;
var r = module.exports = {};
function o() {
  throw new Error("setTimeout has not been defined");
}
function i() {
  throw new Error("clearTimeout has not been defined");
}
function a(A) {
  if (e === setTimeout) {
    return setTimeout(A, 0);
  }
  if ((e === o || !e) && setTimeout) {
    e = setTimeout;
    return setTimeout(A, 0);
  }
  try {
    return e(A, 0);
  } catch (t) {
    try {
      return e.call(null, A, 0);
    } catch (t) {
      return e.call(this, A, 0);
    }
  }
}
(function () {
  try {
    e = typeof setTimeout == "function" ? setTimeout : o;
  } catch (A) {
    e = o;
  }
  try {
    n = typeof clearTimeout == "function" ? clearTimeout : i;
  } catch (A) {
    n = i;
  }
})();
var c;
var g = [];
var s = false;
var u = -1;
function I() {
  if (s && c) {
    s = false;
    if (c.length) {
      g = c.concat(g);
    } else {
      u = -1;
    }
    if (g.length) {
      B();
    }
  }
}
function B() {
  if (!s) {
    var A = a(I);
    s = true;
    for (var t = g.length; t;) {
      c = g;
      g = [];
      while (++u < t) {
        if (c) {
          c[u].run();
        }
      }
      u = -1;
      t = g.length;
    }
    c = null;
    s = false;
    (function (A) {
      if (n === clearTimeout) {
        return clearTimeout(A);
      }
      if ((n === i || !n) && clearTimeout) {
        n = clearTimeout;
        return clearTimeout(A);
      }
      try {
        return n(A);
      } catch (t) {
        try {
          return n.call(null, A);
        } catch (t) {
          return n.call(this, A);
        }
      }
    })(A);
  }
}
function f(A, t) {
  this.fun = A;
  this.array = t;
}
function C() {}
r.nextTick = function (A) {
  var t = new Array(arguments.length - 1);
  if (arguments.length > 1) {
    for (var e = 1; e < arguments.length; e++) {
      t[e - 1] = arguments[e];
    }
  }
  g.push(new f(A, t));
  if (g.length === 1 && !s) {
    a(B);
  }
};
f.prototype.run = function () {
  this.fun.apply(null, this.array);
};
r.title = "browser";
r.browser = true;
r.env = {};
r.argv = [];
r.version = "";
r.versions = {};
r.on = C;
r.addListener = C;
r.once = C;
r.off = C;
r.removeListener = C;
r.removeAllListeners = C;
r.emit = C;
r.prependListener = C;
r.prependOnceListener = C;
r.listeners = function (A) {
  return [];
};
r.binding = function (A) {
  throw new Error("process.binding is not supported");
};
r.cwd = function () {
  return "/";
};
r.chdir = function (A) {
  throw new Error("process.chdir is not supported");
};
r.umask = function () {
  return 0;
};