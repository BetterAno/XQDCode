var n = require("./c532.js");
var r = require("./30b5.js");
var o = require("./f6b4.js");
var i = require("./5270.js");
var a = require("./4a7b.js");
function c(A) {
  this.defaults = A;
  this.interceptors = {
    request: new o(),
    response: new o()
  };
}
c.prototype.request = function (A) {
  if (typeof A == "string") {
    (A = arguments[1] || {}).url = arguments[0];
  } else {
    A = A || {};
  }
  if ((A = a(this.defaults, A)).method) {
    A.method = A.method.toLowerCase();
  } else if (this.defaults.method) {
    A.method = this.defaults.method.toLowerCase();
  } else {
    A.method = "get";
  }
  var t = [i, undefined];
  var e = Promise.resolve(A);
  this.interceptors.request.forEach(function (A) {
    t.unshift(A.fulfilled, A.rejected);
  });
  this.interceptors.response.forEach(function (A) {
    t.push(A.fulfilled, A.rejected);
  });
  while (t.length) {
    e = e.then(t.shift(), t.shift());
  }
  return e;
};
c.prototype.getUri = function (A) {
  A = a(this.defaults, A);
  return r(A.url, A.params, A.paramsSerializer).replace(/^\?/, "");
};
n.forEach(["delete", "get", "head", "options"], function (A) {
  c.prototype[A] = function (t, e) {
    return this.request(n.merge(e || {}, {
      method: A,
      url: t
    }));
  };
});
n.forEach(["post", "put", "patch"], function (A) {
  c.prototype[A] = function (t, e, r) {
    return this.request(n.merge(r || {}, {
      method: A,
      url: t,
      data: e
    }));
  };
});
module.exports = c;