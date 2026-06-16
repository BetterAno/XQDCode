var e = 0;
var n = Math.random();
module.exports = function (A) {
  return `Symbol(${A === undefined ? "" : A})_${(++e + n).toString(36)}`;
};