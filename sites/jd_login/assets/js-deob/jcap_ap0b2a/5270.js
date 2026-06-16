var n = require("./c532.js");
var r = require("./c401.js");
var o = require("./2e67.js");
var i = require("./2444.js");
function a(A) {
  if (A.cancelToken) {
    A.cancelToken.throwIfRequested();
  }
}
module.exports = function (A) {
  a(A);
  A.headers = A.headers || {};
  A.data = r(A.data, A.headers, A.transformRequest);
  A.headers = n.merge(A.headers.common || {}, A.headers[A.method] || {}, A.headers);
  n.forEach(["delete", "get", "head", "post", "put", "patch", "common"], function (t) {
    delete A.headers[t];
  });
  return (A.adapter || i.adapter)(A).then(function (t) {
    a(A);
    t.data = r(t.data, t.headers, A.transformResponse);
    return t;
  }, function (t) {
    if (!o(t)) {
      a(A);
      if (t && t.response) {
        t.response.data = r(t.response.data, t.response.headers, A.transformResponse);
      }
    }
    return Promise.reject(t);
  });
};