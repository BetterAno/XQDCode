var n = require("./c532.js");
var r = require("./1d2b.js");
var o = require("./0a06.js");
var i = require("./4a7b.js");
function a(A) {
  var t = new o(A);
  var e = r(o.prototype.request, t);
  n.extend(e, o.prototype, t);
  n.extend(e, t);
  return e;
}
var c = a(require("./2444.js"));
c.Axios = o;
c.create = function (A) {
  return a(i(c.defaults, A));
};
c.Cancel = require("./7a77.js");
c.CancelToken = require("./8df4.js");
c.isCancel = require("./2e67.js");
c.all = function (A) {
  return Promise.all(A);
};
c.spread = require("./0df6.js");
module.exports = c;
module.exports.default = c;