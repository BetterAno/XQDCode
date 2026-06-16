function n(A) {
  this.message = A;
}
n.prototype.toString = function () {
  return "Cancel" + (this.message ? ": " + this.message : "");
};
n.prototype.__CANCEL__ = true;
module.exports = n;