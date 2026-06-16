var n;
var r;
var o;
var i = require("./d864.js");
var a = require("./3024.js");
var c = require("./32fc.js");
var g = require("./1ec9.js");
var s = require("./e53d.js");
var u = s.process;
var I = s.setImmediate;
var B = s.clearImmediate;
var f = s.MessageChannel;
var C = s.Dispatch;
var E = 0;
var l = {};
var Q = "onreadystatechange";
function d() {
  var A = +this;
  if (l.hasOwnProperty(A)) {
    var t = l[A];
    delete l[A];
    t();
  }
}
function p(A) {
  d.call(A.data);
}
if (!I || !B) {
  I = function (A) {
    var t = [];
    for (var e = 1; arguments.length > e;) {
      t.push(arguments[e++]);
    }
    l[++E] = function () {
      a(typeof A == "function" ? A : Function(A), t);
    };
    n(E);
    return E;
  };
  B = function (A) {
    delete l[A];
  };
  if (require("./6b4c.js")(u) == "process") {
    n = function (A) {
      u.nextTick(i(d, A, 1));
    };
  } else if (C && C.now) {
    n = function (A) {
      C.now(i(d, A, 1));
    };
  } else if (f) {
    o = (r = new f()).port2;
    r.port1.onmessage = p;
    n = i(o.postMessage, o, 1);
  } else if (s.addEventListener && typeof postMessage == "function" && !s.importScripts) {
    n = function (A) {
      s.postMessage(A + "", "*");
    };
    s.addEventListener("message", p, false);
  } else {
    n = Q in g("script") ? function (A) {
      c.appendChild(g("script"))[Q] = function () {
        c.removeChild(this);
        d.call(A);
      };
    } : function (A) {
      setTimeout(i(d, A, 1), 0);
    };
  }
}
module.exports = {
  set: I,
  clear: B
};