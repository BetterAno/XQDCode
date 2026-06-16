var n = require("./2d83.js");
module.exports = function (A, t, e) {
  var r = e.config.validateStatus;
  if (!r || r(e.status)) {
    A(e);
  } else {
    t(n("Request failed with status code " + e.status, e.config, null, e.request, e));
  }
};