var n = require("./c532.js");
var r = require("./467f.js");
var o = require("./30b5.js");
var i = require("./83b9.js");
var a = require("./c345.js");
var c = require("./3934.js");
var g = require("./2d83.js");
module.exports = function (A) {
  return new Promise(function (t, s) {
    var u = A.data;
    var I = A.headers;
    if (n.isFormData(u)) {
      delete I["Content-Type"];
    }
    var B = new XMLHttpRequest();
    if (A.auth) {
      var f = A.auth.username || "";
      var C = A.auth.password || "";
      I.Authorization = "Basic " + btoa(f + ":" + C);
    }
    var E = i(A.baseURL, A.url);
    B.open(A.method.toUpperCase(), o(E, A.params, A.paramsSerializer), true);
    B.timeout = A.timeout;
    B.onreadystatechange = function () {
      if (B && B.readyState === 4 && (B.status !== 0 || B.responseURL && B.responseURL.indexOf("file:") === 0)) {
        var e = "getAllResponseHeaders" in B ? a(B.getAllResponseHeaders()) : null;
        var n = {
          data: A.responseType && A.responseType !== "text" ? B.response : B.responseText,
          status: B.status,
          statusText: B.statusText,
          headers: e,
          config: A,
          request: B
        };
        r(t, s, n);
        B = null;
      }
    };
    B.onabort = function () {
      if (B) {
        s(g("Request aborted", A, "ECONNABORTED", B));
        B = null;
      }
    };
    B.onerror = function () {
      s(g("Network Error", A, null, B));
      B = null;
    };
    B.ontimeout = function () {
      var t = "timeout of " + A.timeout + "ms exceeded";
      if (A.timeoutErrorMessage) {
        t = A.timeoutErrorMessage;
      }
      s(g(t, A, "ECONNABORTED", B));
      B = null;
    };
    if (n.isStandardBrowserEnv()) {
      var l = require("./7aac.js");
      var Q = (A.withCredentials || c(E)) && A.xsrfCookieName ? l.read(A.xsrfCookieName) : undefined;
      if (Q) {
        I[A.xsrfHeaderName] = Q;
      }
    }
    if ("setRequestHeader" in B) {
      n.forEach(I, function (A, t) {
        if (u === undefined && t.toLowerCase() === "content-type") {
          delete I[t];
        } else {
          B.setRequestHeader(t, A);
        }
      });
    }
    if (!n.isUndefined(A.withCredentials)) {
      B.withCredentials = !!A.withCredentials;
    }
    if (A.responseType) {
      try {
        B.responseType = A.responseType;
      } catch (t) {
        if (A.responseType !== "json") {
          throw t;
        }
      }
    }
    if (typeof A.onDownloadProgress == "function") {
      B.addEventListener("progress", A.onDownloadProgress);
    }
    if (typeof A.onUploadProgress == "function" && B.upload) {
      B.upload.addEventListener("progress", A.onUploadProgress);
    }
    if (A.cancelToken) {
      A.cancelToken.promise.then(function (A) {
        if (B) {
          B.abort();
          s(A);
          B = null;
        }
      });
    }
    if (u === undefined) {
      u = null;
    }
    B.send(u);
  });
};