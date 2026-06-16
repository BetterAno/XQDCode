var t = require("./f28c.js");
var n = require("./c532.js");
var r = require("./c8af.js");
var o = {
  "Content-Type": "application/x-www-form-urlencoded"
};
function i(A, t) {
  if (!n.isUndefined(A) && n.isUndefined(A["Content-Type"])) {
    A["Content-Type"] = t;
  }
}
var a = {
  adapter: function () {
    var A;
    if (typeof XMLHttpRequest != "undefined" || t !== undefined && Object.prototype.toString.call(t) === "[object process]") {
      A = require("./b50d.js");
    }
    return A;
  }(),
  transformRequest: [function (A, t) {
    r(t, "Accept");
    r(t, "Content-Type");
    if (n.isFormData(A) || n.isArrayBuffer(A) || n.isBuffer(A) || n.isStream(A) || n.isFile(A) || n.isBlob(A)) {
      return A;
    } else if (n.isArrayBufferView(A)) {
      return A.buffer;
    } else if (n.isURLSearchParams(A)) {
      i(t, "application/x-www-form-urlencoded;charset=utf-8");
      return A.toString();
    } else if (n.isObject(A)) {
      i(t, "application/json;charset=utf-8");
      return JSON.stringify(A);
    } else {
      return A;
    }
  }],
  transformResponse: [function (A) {
    if (typeof A == "string") {
      try {
        A = JSON.parse(A);
      } catch (A) {}
    }
    return A;
  }],
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  validateStatus: function (A) {
    return A >= 200 && A < 300;
  },
  headers: {
    common: {
      Accept: "application/json, text/plain, */*"
    }
  }
};
n.forEach(["delete", "get", "head"], function (A) {
  a.headers[A] = {};
});
n.forEach(["post", "put", "patch"], function (A) {
  a.headers[A] = n.merge(o);
});
module.exports = a;