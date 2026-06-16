var n = require("./c532.js");
function r() {
  this.handlers = [];
}
r.prototype.use = function (A, t) {
  this.handlers.push({
    fulfilled: A,
    rejected: t
  });
  return this.handlers.length - 1;
};
r.prototype.eject = function (A) {
  this.handlers[A] &&= null;
};
r.prototype.forEach = function (A) {
  n.forEach(this.handlers, function (t) {
    if (t !== null) {
      A(t);
    }
  });
};
module.exports = r;