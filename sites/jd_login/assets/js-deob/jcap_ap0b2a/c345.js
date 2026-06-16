var n = require("./c532.js");
var r = ["age", "authorization", "content-length", "content-type", "etag", "expires", "from", "host", "if-modified-since", "if-unmodified-since", "last-modified", "location", "max-forwards", "proxy-authorization", "referer", "retry-after", "user-agent"];
module.exports = function (A) {
  var t;
  var e;
  var o;
  var i = {};
  if (A) {
    n.forEach(A.split("\n"), function (A) {
      o = A.indexOf(":");
      t = n.trim(A.substr(0, o)).toLowerCase();
      e = n.trim(A.substr(o + 1));
      if (t) {
        if (i[t] && r.indexOf(t) >= 0) {
          return;
        }
        i[t] = t === "set-cookie" ? (i[t] ? i[t] : []).concat([e]) : i[t] ? i[t] + ", " + e : e;
      }
    });
    return i;
  } else {
    return i;
  }
};