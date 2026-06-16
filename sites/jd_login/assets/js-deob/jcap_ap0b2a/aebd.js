module.exports = function (A, t) {
  return {
    enumerable: !(A & 1),
    configurable: !(A & 2),
    writable: !(A & 4),
    value: t
  };
};