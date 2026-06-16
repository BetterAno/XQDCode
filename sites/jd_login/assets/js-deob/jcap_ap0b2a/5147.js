var n = require("./2b4c.js")("match");
module.exports = function (A) {
  var t = /./;
  try {
    "/./"[A](t);
  } catch (e) {
    try {
      t[n] = false;
      return !"/./"[A](t);
    } catch (A) {}
  }
  return true;
};