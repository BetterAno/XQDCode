var n = require("./7a77.js");
function r(A) {
  if (typeof A != "function") {
    throw new TypeError("executor must be a function.");
  }
  var t;
  this.promise = new Promise(function (A) {
    t = A;
  });
  var e = this;
  A(function (A) {
    if (!e.reason) {
      e.reason = new n(A);
      t(e.reason);
    }
  });
}
r.prototype.throwIfRequested = function () {
  if (this.reason) {
    throw this.reason;
  }
};
r.source = function () {
  var A;
  return {
    token: new r(function (t) {
      A = t;
    }),
    cancel: A
  };
};
module.exports = r;