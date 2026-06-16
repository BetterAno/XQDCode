var n = require("./c532.js");
module.exports = n.isStandardBrowserEnv() ? function () {
  var A;
  var t = /(msie|trident)/i.test(navigator.userAgent);
  var e = document.createElement("a");
  function r(A) {
    var n = A;
    if (t) {
      e.setAttribute("href", n);
      n = e.href;
    }
    e.setAttribute("href", n);
    return {
      href: e.href,
      protocol: e.protocol ? e.protocol.replace(/:$/, "") : "",
      host: e.host,
      search: e.search ? e.search.replace(/^\?/, "") : "",
      hash: e.hash ? e.hash.replace(/^#/, "") : "",
      hostname: e.hostname,
      port: e.port,
      pathname: e.pathname.charAt(0) === "/" ? e.pathname : "/" + e.pathname
    };
  }
  A = r(window.location.href);
  return function (t) {
    var e = n.isString(t) ? r(t) : t;
    return e.protocol === A.protocol && e.host === A.host;
  };
}() : function () {
  return true;
};