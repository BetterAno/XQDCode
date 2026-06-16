module.exports = function (A, t, e) {
  var n = e === undefined;
  switch (t.length) {
    case 0:
      if (n) {
        return A();
      } else {
        return A.call(e);
      }
    case 1:
      if (n) {
        return A(t[0]);
      } else {
        return A.call(e, t[0]);
      }
    case 2:
      if (n) {
        return A(t[0], t[1]);
      } else {
        return A.call(e, t[0], t[1]);
      }
    case 3:
      if (n) {
        return A(t[0], t[1], t[2]);
      } else {
        return A.call(e, t[0], t[1], t[2]);
      }
    case 4:
      if (n) {
        return A(t[0], t[1], t[2], t[3]);
      } else {
        return A.call(e, t[0], t[1], t[2], t[3]);
      }
  }
  return A.apply(e, t);
};