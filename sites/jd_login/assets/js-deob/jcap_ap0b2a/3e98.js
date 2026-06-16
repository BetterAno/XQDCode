require("./6762.js");
require("./2fdb.js");
var n = require("./482f.js");
try {
  if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, "includes", {
      value: function (A, t) {
        var e = {
          uxbUL: function (A, t) {
            return A == t;
          },
          DDTYr: function (A, t) {
            return A >>> t;
          },
          RzjdP: function (A, t) {
            return A | t;
          },
          yVcTa: function (A, t) {
            return A >= t;
          }
        };
        if (e.uxbUL(this, null)) {
          throw new TypeError("\"this\" is null or not defined");
        }
        var n = Object(this);
        var r = e.DDTYr(n.length, 0);
        if (r === 0) {
          return false;
        }
        var i = e.RzjdP(t, 0);
        for (var c = Math.max(e.yVcTa(i, 0) ? i : r - Math.abs(i), 0); c < r;) {
          if (n[c] === A) {
            return true;
          }
          c++;
        }
        return false;
      }
    });
  }
  var c = {};
  var g = 0;
  document.addEventListener("touchstart", function (A) {
    var o = {
      jQnFC: "touch"
    };
    try {
      var s = A.changedTouches[0];
      c.eid = o.jQnFC;
      c.did = s.target.id;
      c.cn = s.target.className;
      c.time = new Date().getTime();
      c.pt = [];
      c.pt.push([A.changedTouches[0].screenX, A.changedTouches[0].screenY, A.changedTouches[0].pageX, A.changedTouches[0].pageY, g]);
      g = new Date().getTime();
    } catch (A) {}
  }, false);
  document.addEventListener("touchmove", function (A) {
    try {
      var n = A.changedTouches[0];
      c.pt.push([n.screenX, n.screenY, n.pageX, n.pageY, new Date().getTime() - g]);
      g = new Date().getTime();
    } catch (A) {}
  }, false);
  document.addEventListener("touchend", function (A) {
    try {
      if (c.pt.length > 0) {
        if (c.pt.length > 400) {
          c.pt.splice(0, c.pt.length - 10);
        }
        var s = n.d("touche_message");
        if (!Array.isArray(s)) {
          s = [];
        }
        s.push(c);
        if (s.length >= 10) {
          var g = s.length - 10;
          s.splice(0, g);
        }
        Object(n.n)("touche_message", s);
      }
    } catch (A) {}
  }, false);
  document.addEventListener("click", function (A) {
    function o(A, t, e) {
      return A(t, e);
    }
    "ror";
    try {
      var i = {
        eid: "click",
        did: A.target.id,
        cn: A.target.className,
        sx: A.screenX,
        sy: A.screenY,
        px: A.pageX,
        py: A.pageY
      };
      i.time = new Date().getTime();
      var a = Object(n.d)("touche_message");
      if (!Array.isArray(a)) {
        a = [];
      }
      a.push(i);
      if (a.length >= 10) {
        var c = a.length - 10;
        a.splice(0, c);
      }
      o(n.n, "touche_message", a);
    } catch (A) {}
  }, false);
} catch (A) {}