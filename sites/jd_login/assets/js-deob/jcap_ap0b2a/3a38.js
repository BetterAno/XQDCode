var e = Math.ceil;
var n = Math.floor;
module.exports = function (A) {
  if (isNaN(A = +A)) {
    return 0;
  } else {
    return (A > 0 ? n : e)(A);
  }
};