var n = require("./1d2b.js");
var r = Object.prototype.toString;
function o(A) {
  return r.call(A) === "[object Array]";
}
function i(A) {
  return A === undefined;
}
function a(A) {
  return A !== null && typeof A == "object";
}
function c(A) {
  return r.call(A) === "[object Function]";
}
function g(A, t) {
  if (A != null) {
    if (typeof A != "object") {
      A = [A];
    }
    if (o(A)) {
      for (var e = 0, n = A.length; e < n; e++) {
        t.call(null, A[e], e, A);
      }
    } else {
      for (var r in A) {
        if (Object.prototype.hasOwnProperty.call(A, r)) {
          t.call(null, A[r], r, A);
        }
      }
    }
  }
}
module.exports = {
  isArray: o,
  isArrayBuffer: function (A) {
    return r.call(A) === "[object ArrayBuffer]";
  },
  isBuffer: function (A) {
    return A !== null && !i(A) && A.constructor !== null && !i(A.constructor) && typeof A.constructor.isBuffer == "function" && A.constructor.isBuffer(A);
  },
  isFormData: function (A) {
    return typeof FormData != "undefined" && A instanceof FormData;
  },
  isArrayBufferView: function (A) {
    if (typeof ArrayBuffer != "undefined" && ArrayBuffer.isView) {
      return ArrayBuffer.isView(A);
    } else {
      return A && A.buffer && A.buffer instanceof ArrayBuffer;
    }
  },
  isString: function (A) {
    return typeof A == "string";
  },
  isNumber: function (A) {
    return typeof A == "number";
  },
  isObject: a,
  isUndefined: i,
  isDate: function (A) {
    return r.call(A) === "[object Date]";
  },
  isFile: function (A) {
    return r.call(A) === "[object File]";
  },
  isBlob: function (A) {
    return r.call(A) === "[object Blob]";
  },
  isFunction: c,
  isStream: function (A) {
    return a(A) && c(A.pipe);
  },
  isURLSearchParams: function (A) {
    return typeof URLSearchParams != "undefined" && A instanceof URLSearchParams;
  },
  isStandardBrowserEnv: function () {
    return (typeof navigator == "undefined" || navigator.product !== "ReactNative" && navigator.product !== "NativeScript" && navigator.product !== "NS") && typeof window != "undefined" && typeof document != "undefined";
  },
  forEach: g,
  merge: function A() {
    var t = {};
    function e(e, n) {
      if (typeof t[n] == "object" && typeof e == "object") {
        t[n] = A(t[n], e);
      } else {
        t[n] = e;
      }
    }
    for (var n = 0, r = arguments.length; n < r; n++) {
      g(arguments[n], e);
    }
    return t;
  },
  deepMerge: function A() {
    var t = {};
    function e(e, n) {
      if (typeof t[n] == "object" && typeof e == "object") {
        t[n] = A(t[n], e);
      } else {
        t[n] = typeof e == "object" ? A({}, e) : e;
      }
    }
    for (var n = 0, r = arguments.length; n < r; n++) {
      g(arguments[n], e);
    }
    return t;
  },
  extend: function (A, t, e) {
    g(t, function (t, r) {
      A[r] = e && typeof t == "function" ? n(t, e) : t;
    });
    return A;
  },
  trim: function (A) {
    return A.replace(/^\s*/, "").replace(/\s*$/, "");
  }
};