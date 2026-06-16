var n = require("./2b4c.js")("unscopables");
var r = Array.prototype;
if (r[n] == null) {
  require("./32e9.js")(r, n, {});
}
module.exports = function (A) {
  r[n][A] = true;
};