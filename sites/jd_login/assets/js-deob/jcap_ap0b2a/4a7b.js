var n = require("./c532.js");
module.exports = function (A, t) {
  t = t || {};
  var e = {};
  var r = ["url", "method", "params", "data"];
  var o = ["headers", "auth", "proxy"];
  var i = ["baseURL", "url", "transformRequest", "transformResponse", "paramsSerializer", "timeout", "withCredentials", "adapter", "responseType", "xsrfCookieName", "xsrfHeaderName", "onUploadProgress", "onDownloadProgress", "maxContentLength", "validateStatus", "maxRedirects", "httpAgent", "httpsAgent", "cancelToken", "socketPath"];
  n.forEach(r, function (A) {
    if (t[A] !== undefined) {
      e[A] = t[A];
    }
  });
  n.forEach(o, function (r) {
    if (n.isObject(t[r])) {
      e[r] = n.deepMerge(A[r], t[r]);
    } else if (t[r] !== undefined) {
      e[r] = t[r];
    } else if (n.isObject(A[r])) {
      e[r] = n.deepMerge(A[r]);
    } else if (A[r] !== undefined) {
      e[r] = A[r];
    }
  });
  n.forEach(i, function (n) {
    if (t[n] !== undefined) {
      e[n] = t[n];
    } else if (A[n] !== undefined) {
      e[n] = A[n];
    }
  });
  var a = r.concat(o).concat(i);
  var c = Object.keys(t).filter(function (A) {
    return a.indexOf(A) === -1;
  });
  n.forEach(c, function (n) {
    if (t[n] !== undefined) {
      e[n] = t[n];
    } else if (A[n] !== undefined) {
      e[n] = A[n];
    }
  });
  return e;
};