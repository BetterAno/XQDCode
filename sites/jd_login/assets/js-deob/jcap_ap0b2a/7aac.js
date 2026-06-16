var n = require("./c532.js");
module.exports = n.isStandardBrowserEnv() ? {
  write: function (A, t, e, r, o, i) {
    var a = [];
    a.push(A + "=" + encodeURIComponent(t));
    if (n.isNumber(e)) {
      a.push("expires=" + new Date(e).toGMTString());
    }
    if (n.isString(r)) {
      a.push("path=" + r);
    }
    if (n.isString(o)) {
      a.push("domain=" + o);
    }
    if (i === true) {
      a.push("secure");
    }
    document.cookie = a.join("; ");
  },
  read: function (A) {
    var t = document.cookie.match(new RegExp("(^|;\\s*)(" + A + ")=([^;]*)"));
    if (t) {
      return decodeURIComponent(t[3]);
    } else {
      return null;
    }
  },
  remove: function (A) {
    this.write(A, "", Date.now() - 86400000);
  }
} : {
  write: function () {},
  read: function () {
    return null;
  },
  remove: function () {}
};