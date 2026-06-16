var n = require("./79aa.js");
function r(A) {
  var t;
  var e;
  this.promise = new A(function (A, n) {
    if (t !== undefined || e !== undefined) {
      throw TypeError("Bad Promise constructor");
    }
    t = A;
    e = n;
  });
  this.resolve = n(t);
  this.reject = n(e);
}
module.exports.f = function (A) {
  return new r(A);
};