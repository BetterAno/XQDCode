function n(A, t) {
  var e = [];
  var n = {};
  for (var r = 0; r < t.length; r++) {
    var o = t[r];
    var i = o[0];
    var a = {
      id: A + ":" + r,
      css: o[1],
      media: o[2],
      sourceMap: o[3]
    };
    if (n[i]) {
      n[i].parts.push(a);
    } else {
      e.push(n[i] = {
        id: i,
        parts: [a]
      });
    }
  }
  return e;
}
var r = typeof document != "undefined";
if (typeof DEBUG != "undefined" && DEBUG && !r) {
  throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");
}
var o = {};
var i = r && (document.head || document.getElementsByTagName("head")[0]);
var a = null;
var c = 0;
var g = false;
function s() {}
var u = null;
var I = "data-vue-ssr-id";
var B = typeof navigator != "undefined" && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase());
export default function f(A, t, e, r) {
  g = e;
  u = r || {};
  var i = n(A, t);
  C(i);
  return function (t) {
    var e = [];
    for (var r = 0; r < i.length; r++) {
      var a = i[r];
      var c = o[a.id];
      c.refs--;
      e.push(c);
    }
    if (t) {
      C(i = n(A, t));
    } else {
      i = [];
    }
    r = 0;
    for (; r < e.length; r++) {
      if ((c = e[r]).refs === 0) {
        for (var g = 0; g < c.parts.length; g++) {
          c.parts[g]();
        }
        delete o[c.id];
      }
    }
  };
}
function C(A) {
  for (var t = 0; t < A.length; t++) {
    var e = A[t];
    var n = o[e.id];
    if (n) {
      n.refs++;
      for (var r = 0; r < n.parts.length; r++) {
        n.parts[r](e.parts[r]);
      }
      for (; r < e.parts.length; r++) {
        n.parts.push(l(e.parts[r]));
      }
      if (n.parts.length > e.parts.length) {
        n.parts.length = e.parts.length;
      }
    } else {
      var i = [];
      for (r = 0; r < e.parts.length; r++) {
        i.push(l(e.parts[r]));
      }
      o[e.id] = {
        id: e.id,
        refs: 1,
        parts: i
      };
    }
  }
}
function E() {
  var A = document.createElement("style");
  A.type = "text/css";
  i.appendChild(A);
  return A;
}
function l(A) {
  var t;
  var e;
  var n = document.querySelector("style[" + I + "~=\"" + A.id + "\"]");
  if (n) {
    if (g) {
      return s;
    }
    n.parentNode.removeChild(n);
  }
  if (B) {
    var r = c++;
    n = a ||= E();
    t = d.bind(null, n, r, false);
    e = d.bind(null, n, r, true);
  } else {
    n = E();
    t = p.bind(null, n);
    e = function () {
      n.parentNode.removeChild(n);
    };
  }
  t(A);
  return function (n) {
    if (n) {
      if (n.css === A.css && n.media === A.media && n.sourceMap === A.sourceMap) {
        return;
      }
      t(A = n);
    } else {
      e();
    }
  };
}
var Q = function () {
  var A = [];
  return function (t, e) {
    A[t] = e;
    return A.filter(Boolean).join("\n");
  };
}();
function d(A, t, e, n) {
  var r = e ? "" : n.css;
  if (A.styleSheet) {
    A.styleSheet.cssText = Q(t, r);
  } else {
    var o = document.createTextNode(r);
    var i = A.childNodes;
    if (i[t]) {
      A.removeChild(i[t]);
    }
    if (i.length) {
      A.insertBefore(o, i[t]);
    } else {
      A.appendChild(o);
    }
  }
}
function p(A, t) {
  var e = t.css;
  var n = t.media;
  var r = t.sourceMap;
  if (n) {
    A.setAttribute("media", n);
  }
  if (u.ssrId) {
    A.setAttribute(I, t.id);
  }
  if (r) {
    e += "\n/*# sourceURL=" + r.sources[0] + " */";
    e += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(r)))) + " */";
  }
  if (A.styleSheet) {
    A.styleSheet.cssText = e;
  } else {
    while (A.firstChild) {
      A.removeChild(A.firstChild);
    }
    A.appendChild(document.createTextNode(e));
  }
}