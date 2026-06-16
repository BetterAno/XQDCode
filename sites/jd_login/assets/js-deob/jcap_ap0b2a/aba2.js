var n = require("./e53d.js");
var r = require("./4178.js").set;
var o = n.MutationObserver || n.WebKitMutationObserver;
var i = n.process;
var a = n.Promise;
var c = require("./6b4c.js")(i) == "process";
module.exports = function () {
  var A;
  var t;
  var e;
  function g() {
    var n;
    var r;
    for (c && (n = i.domain) && n.exit(); A;) {
      r = A.fn;
      A = A.next;
      try {
        r();
      } catch (n) {
        if (A) {
          e();
        } else {
          t = undefined;
        }
        throw n;
      }
    }
    t = undefined;
    if (n) {
      n.enter();
    }
  }
  if (c) {
    e = function () {
      i.nextTick(g);
    };
  } else if (!o || n.navigator && n.navigator.standalone) {
    if (a && a.resolve) {
      var s = a.resolve(undefined);
      e = function () {
        s.then(g);
      };
    } else {
      e = function () {
        r.call(n, g);
      };
    }
  } else {
    var u = true;
    var I = document.createTextNode("");
    new o(g).observe(I, {
      characterData: true
    });
    e = function () {
      I.data = u = !u;
    };
  }
  return function (n) {
    var r = {
      fn: n,
      next: undefined
    };
    if (t) {
      t.next = r;
    }
    if (!A) {
      A = r;
      e();
    }
    t = r;
  };
};