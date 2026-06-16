var n = require("./5168.js")("iterator");
var r = false;
try {
  var o = [7][n]();
  o.return = function () {
    r = true;
  };
  Array.from(o, function () {
    throw 2;
  });
} catch (A) {}
module.exports = function (A, t) {
  if (!t && !r) {
    return false;
  }
  var e = false;
  try {
    var o = [7];
    var i = o[n]();
    i.next = function () {
      return {
        done: e = true
      };
    };
    o[n] = function () {
      return i;
    };
    A(o);
  } catch (A) {}
  return e;
};