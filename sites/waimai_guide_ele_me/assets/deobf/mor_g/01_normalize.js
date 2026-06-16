"use strict";

(window.mor_modules = window.mor_modules || []).push([[502], {
  Gkou: function (Ze, Re, n) {
    var G;
    G = {
      value: !0
    };
    var J = n("eDMh"),
      k = function () {
        function i() {
          var me = this;
          this.pluginName = "SupportLifecycle";
          this.apply = function (ue) {
            var le = function (Ie) {
                return typeof Ie == "function";
              },
              Se = ["appOnLaunch", "appOnConstruct", "appOnShow", "appOnHide", "appOnError"];
            Se.map(function (fe) {
              ue[fe].tap(me.pluginName, function (Ie) {
                if (le(J[fe])) {
                  J[fe].call(this, Ie);
                }
              });
            });
          };
        }
        return i;
      }();
    Re.Z = k;
  },
  IqOO: function (Ze, Re, n) {
    n.d(Re, {
      UU: function () {
        return $;
      },
      kW: function () {
        return tr;
      },
      wE: function () {
        return Ge;
      }
    });
    var G = n("3CEr"),
      J = n("Bj0A"),
      k = n("gEaW"),
      i = n("1Mcg"),
      me = n.n(i),
      ue = n("KHZl"),
      le,
      Se = 0,
      fe = 30,
      Ie,
      pe = 0,
      je = 30,
      c,
      U = 400;
    function de() {
      Se++;
      pe++;
      if (le) {
        clearTimeout(le);
      }
      if (Se >= fe) {
        Se = 0;
        console.log("[H5] d|click showDeviceCallBack");
        if (Ie) {
          Ie();
        }
      }
      if (pe >= je) {
        pe = 0;
        console.log("[H5] d|click showDebugToolCallBack");
        if (c) {
          c();
        }
      }
      le = setTimeout(function () {
        Se = 0;
        pe = 0;
      }, U);
    }
    window.document.addEventListener("click", function () {
      try {
        de();
      } catch (s) {
        console.error("[H5] = ", s);
      }
    });
    function ve(s) {
      if (!isNaN(s) && s < 1e3) {
        U = s;
      }
    }
    function Oe(s, r) {
      r = parseInt(r, 10);
      if (!isNaN(r) && r > fe) {
        fe = r;
      }
      Ie = s;
    }
    function Te(s, r) {
      r = parseInt(r, 10);
      if (!isNaN(r) && r > je) {
        je = r;
      }
      c = s;
    }
    var $e = n("yw0p"),
      Ye = n("05u5"),
      Ce = n("CW13");
    function K() {
      var s,
        r,
        u = typeof Symbol == "function" ? Symbol : {},
        d = u.iterator || "@@iterator",
        y = u.toStringTag || "@@toStringTag";
      function B(re, X, q, Ve) {
        var or = X && X.prototype instanceof be ? X : be,
          We = Object.create(or.prototype);
        O(We, "_invoke", function (He, nr, Fe) {
          var Pe,
            ge,
            he,
            cr = 0,
            lr = Fe || [],
            Er = !1,
            F = {
              p: 0,
              n: 0,
              v: s,
              a: g,
              f: g.bind(s, 4),
              d: function (A, W) {
                Pe = A;
                ge = 0;
                he = s;
                F.n = W;
                return z;
              }
            };
          function g(m, A) {
            ge = m;
            he = A;
            r = 0;
            for (; !Er && cr && !W && r < lr.length; r++) {
              var W,
                te = lr[r],
                Ee = F.p,
                R = te[2];
              if (m > 3) {
                if (W = R === A) {
                  he = te[(ge = te[4]) ? 5 : (ge = 3, 3)];
                  te[4] = te[5] = s;
                }
              } else {
                if (te[0] <= Ee) {
                  if (W = m < 2 && Ee < te[1]) {
                    ge = 0;
                    F.v = A;
                    F.n = te[1];
                  } else {
                    if (Ee < R && (W = m < 3 || te[0] > A || A > R)) {
                      te[4] = m;
                      te[5] = A;
                      F.n = R;
                      ge = 0;
                    }
                  }
                }
              }
            }
            if (W || m > 1) return z;
            throw Er = !0, A;
          }
          return function (m, A, W) {
            if (cr > 1) throw TypeError("Generator is already running");
            if (Er && A === 1) {
              g(A, W);
            }
            ge = A;
            he = W;
            for (; (r = ge < 2 ? s : he) || !Er;) {
              if (!Pe) {
                if (ge) {
                  if (ge < 3) {
                    if (ge > 1) {
                      F.n = -1;
                    }
                    g(ge, he);
                  } else {
                    F.n = he;
                  }
                } else {
                  F.v = he;
                }
              }
              try {
                cr = 2;
                if (Pe) {
                  if (!ge) {
                    m = "next";
                  }
                  if (r = Pe[m]) {
                    if (!(r = r.call(Pe, he))) throw TypeError("iterator result is not an object");
                    if (!r.done) return r;
                    he = r.value;
                    if (ge < 2) {
                      ge = 0;
                    }
                  } else {
                    if (ge === 1 && (r = Pe.return)) {
                      r.call(Pe);
                    }
                    if (ge < 2) {
                      he = TypeError("The iterator does not provide a '" + m + "' method");
                      ge = 1;
                    }
                  }
                  Pe = s;
                } else if ((r = (Er = F.n < 0) ? he : He.call(nr, F)) !== z) break;
              } catch (te) {
                Pe = s;
                ge = 1;
                he = te;
              } finally {
                cr = 1;
              }
            }
            return {
              value: r,
              done: Er
            };
          };
        }(re, q, Ve), !0);
        return We;
      }
      var z = {};
      function be() {}
      function ne() {}
      function ie() {}
      r = Object.getPrototypeOf;
      var Le = [][d] ? r(r([][d]())) : (O(r = {}, d, function () {
          return this;
        }), r),
        we = ie.prototype = be.prototype = Object.create(Le);
      function Ne(re) {
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(re, ie);
        } else {
          re.__proto__ = ie;
          O(re, y, "GeneratorFunction");
        }
        re.prototype = Object.create(we);
        return re;
      }
      ne.prototype = ie;
      O(we, "constructor", ie);
      O(ie, "constructor", ne);
      ne.displayName = "GeneratorFunction";
      O(ie, y, "GeneratorFunction");
      O(we);
      O(we, y, "Generator");
      O(we, d, function () {
        return this;
      });
      O(we, "toString", function () {
        return "[object Generator]";
      });
      return (K = function () {
        return {
          w: B,
          m: Ne
        };
      })();
    }
    function O(s, r, u, d) {
      var y = Object.defineProperty;
      try {
        y({}, "", {});
      } catch (B) {
        y = 0;
      }
      O = function (z, be, ne, ie) {
        function Le(we, Ne) {
          O(z, we, function (re) {
            return this._invoke(we, Ne, re);
          });
        }
        if (be) {
          if (y) {
            y(z, be, {
              value: ne,
              enumerable: !ie,
              configurable: !ie,
              writable: !ie
            });
          } else {
            z[be] = ne;
          }
        } else {
          Le("next", 0);
          Le("throw", 1);
          Le("return", 2);
        }
      };
      O(s, r, u, d);
    }
    var P = function (r, u, d) {
        return new Promise(function (y, B) {
          var z = function (Le) {
              try {
                ne(d.next(Le));
              } catch (we) {
                B(we);
              }
            },
            be = function (Le) {
              try {
                ne(d.throw(Le));
              } catch (we) {
                B(we);
              }
            },
            ne = function (Le) {
              return Le.done ? y(Le.value) : Promise.resolve(Le.value).then(z, be);
            };
          ne((d = d.apply(r, u)).next());
        });
      },
      E;
    function w() {
      if (typeof E != "boolean") {
        E = (0, Ce.G)();
      }
      setTimeout(function () {
        p();
      }, 1e3);
      console.log("[H5] abtest|isHitUser = ", E);
      return E;
    }
    function p() {
      return P(this, null, K().m(function s() {
        var r, u;
        return K().w(function (d) {
          for (;;) switch (d.n) {
            case 0:
              if ((0, k.default)().mtop) {
                d.n = 1;
                break;
              }
              return d.a(2);
            case 1:
              d.n = 2;
              return (0, k.default)().mtop({
                api: "mtop.alsc.waimai.victoria.ab.shunt.get",
                v: "1.0",
                data: {
                  ab_module: 90007,
                  ab_context: JSON.stringify({
                    groupId: JSON.stringify(["592205"])
                  })
                }
              }).catch(function (y) {
                console.error("[H5] abtest|isHitUser", y);
              });
            case 2:
              r = d.v;
              if (r && r.data && r.data.hitFactors && r.data.hitFactors.debug_factor) {
                u = r.data.hitFactors.debug_factor;
                console.log("[H5] abtest|isHitUser|result = ", u);
                if (u) {
                  if (u.toString() === "1") {
                    (0, Ce.lX)(!0);
                  } else {
                    (0, Ce.lX)(!1);
                  }
                }
              } else {
                (0, Ce.lX)();
                console.log("[H5] abtest|isHitUser|result = ", 0);
              }
            case 3:
              return d.a(2);
          }
        }, s);
      }));
    }
    var C = Object.defineProperty,
      L = Object.defineProperties,
      H = Object.getOwnPropertyDescriptors,
      M = Object.getOwnPropertySymbols,
      V = Object.prototype.hasOwnProperty,
      Y = Object.prototype.propertyIsEnumerable,
      oe = function (r, u, d) {
        return u in r ? C(r, u, {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: d
        }) : r[u] = d;
      },
      N = function (r, u) {
        for (var d in u || (u = {})) {
          if (V.call(u, d)) {
            oe(r, d, u[d]);
          }
        }
        if (M) {
          var y = (0, J.Z)(M(u)),
            B;
          try {
            for (y.s(); !(B = y.n()).done;) {
              var d = B.value;
              if (Y.call(u, d)) {
                oe(r, d, u[d]);
              }
            }
          } catch (z) {
            y.e(z);
          } finally {
            y.f();
          }
        }
        return r;
      },
      se = function (r, u) {
        return L(r, H(u));
      };
    window.__eleDebug = window.__eleDebug || {};
    window.__eleDebug.setDebugConfig = Ce.qV;
    var x = !1,
      Ae,
      De = "__rd";
    var r;
    if (!((r = window == null ? void 0 : window.ebridge) != null && r.isTB)) {
      my.request({
        url: "https://shadow.elemecdn.com/crayfish/ppe-h5.ele.me/my-switch-config",
        method: "GET",
        success: function (d) {
          try {
            var y = d || {},
              B = y.data;
            (0, Ce.qV)(B);
          } catch (z) {
            console.error("[H5] loadConfigFromCDN error = ", z);
          }
        }
      });
    }
    function xe() {
      if (!window.__eleDebug || !window.__eleDebug.debugConfig) {
        window.__eleDebug = window.__eleDebug || {};
        window.__eleDebug.debugConfig = (0, Ce.o_)() || {};
      }
      return window.__eleDebug.debugConfig || {};
    }
    function qe() {
      var s = xe(),
        r = s || {},
        u = r.redirect,
        d = r.redirectTimeout,
        y = d === void 0 ? 1e3 : d,
        B = r.searchQuery,
        z = B === void 0 ? {} : B,
        be = r.outsideUids,
        ne,
        ie = !1;
      if (be && be.length > 0) {
        ie = be.some(function (Ne) {
          var re = (0, Ce.bG)() || {},
            X = re.user_id,
            q = re.havana_id;
          return o("equal", Ne, X) || o("equal", Ne, q);
        });
      }
      if (u && !ie && u.from && u.to && window.location.href.indexOf(u.from) !== -1 && u.to !== window.location.href && window.location.href.indexOf(De) === -1 && !Ye.Z.isDebugPage()) {
        var Le = $e.Z.getQuery(window.location.href),
          we = $e.Z.getQuery(u.to);
        ne = new URL(window.location.pathname, u.to).href;
        ne = $e.Z.appendQueryDic(ne, se(N(N({}, Le), we), (0, G.Z)({}, De, 1)));
      }
      if (z && Object.keys(z).length > 0 && window.location.href.indexOf(De) === -1 && !Ye.Z.isDebugPage()) {
        ne = ne || window.location.href;
        z[De] = 1;
        ne = $e.Z.appendQueryDic(ne, z);
      }
      if (ne && window.location.href.indexOf(De) === -1 && me().getSafeURL(ne) && !Ye.Z.isDebugPage()) {
        if (Ae) {
          clearTimeout(Ae);
        }
        Ae = setTimeout(function () {
          console.log("[H5] d|redirect to = ", ne);
          window.location.replace(me().getSafeURL(ne));
        }, y);
      }
    }
    function tr(s) {
      var r = xe(),
        u = r.fireflyUrl;
      if ((s || window.location.href.indexOf("__isDebug=1") !== -1 || window.location.href.indexOf("__firefly=1") !== -1) && !window.firefly && u) {
        var d = document.createElement("script");
        d.setAttribute("name", "firefly.min.js");
        d.src = u;
        d.onload = function () {};
        d.onerror = function (y) {
          console.error("[CDN\u811A\u672C\u52A0\u8F7D\u5931\u8D25] = ", u, y);
        };
        document.body.appendChild(d);
      }
    }
    function Ge(s) {
      var r = xe(),
        u = r.vconsoleUrl;
      if ((s || window.location.href.indexOf("__vconsole=1") !== -1) && !window.VConsole && u) {
        var d = document.createElement("script");
        d.setAttribute("name", "vconsole.min.js");
        d.src = u;
        d.onload = function () {
          window._vConsoleInstance = new window.VConsole();
        };
        d.onerror = function (y) {
          console.error("[CDN\u811A\u672C\u52A0\u8F7D\u5931\u8D25] = ", u, y);
        };
        document.body.appendChild(d);
      }
    }
    function $(s) {
      var r = xe(),
        u = r.erudaUrl;
      if ((s || window.location.href.indexOf("__eruda=1") !== -1) && !window.eruda && u) {
        var d = document.createElement("script");
        d.setAttribute("name", "eruda.min.js");
        d.src = u;
        d.onload = function () {
          window.eruda.init();
        };
        d.onerror = function (y) {
          console.error("[CDN\u811A\u672C\u52A0\u8F7D\u5931\u8D25] = ", u, y);
        };
        document.body.appendChild(d);
      }
    }
    function f(s) {
      return s.split(".").reduce(function (r, u, d) {
        return d === 0 && u === "$ele()" ? (0, k.default)() : d === 0 ? window : r && r[u];
      }, {});
    }
    function o(s) {
      var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "",
        u = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "",
        d = !1;
      if (r && u) {
        if (!s || s === "equal") {
          d = r == u;
        } else {
          if (s === "contain") {
            d = typeof u == "string" && typeof r == "string" && u.indexOf(r) !== -1;
          }
        }
      }
      return d;
    }
    function v(s) {
      var r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "",
        u = arguments.length > 2 ? arguments[2] : void 0,
        d = !1;
      if (s === "property") {
        var y = f(r);
        d = u === y;
      }
      return d;
    }
    function S() {
      var s = (0, Ce.bG)(),
        r = (0, Ce.Zw)(),
        u = {
          title: "\u8BBE\u5907\u4FE1\u606F",
          content: JSON.stringify({
            userInfo: s,
            eleUID: getApp().$ele().authLogin.getUserIdSync(),
            appInfo: {
              version: ue.version,
              build: ue.build_num,
              branch: ue.branch
            },
            pluginInfo: {
              version: (0, k.default)().pluginInfo && (0, k.default)().pluginInfo.version,
              build: (0, k.default)().pluginInfo && (0, k.default)().pluginInfo.build_num
            },
            deviceId: r
          }, null, 2)
        };
      if (my && my.showToast) {
        my.alert(u);
      }
      (0, k.default)().exlog.jserror("ReportDebug", "\u8FDE\u7EED\u70B9\u51FB\u9875\u9762v2", u);
      navigator.clipboard.writeText(r);
      console.warn("[H5] d|\u8BBE\u5907\u4FE1\u606F = ", r);
      getApp().$answer.logKeyEvent({
        event: "Debug|\u8FDE\u7EED\u70B9\u51FB\u9875\u9762",
        desc: "deviceId"
      });
    }
    function b() {
      (0, Ce.FD)(!0);
      console.warn("[H5] d| next time need report log");
      getApp().$answer.logKeyEvent({
        event: "Debug|\u4E0A\u62A5\u65E5\u5FD7",
        desc: ""
      });
    }
    function _() {
      if (window.location.href.indexOf("__isDebug=1") > -1 || Ye.Z.isDebugPage()) {
        var s = function (y) {
          r.style.left = y.pageX - 25 + "px";
          r.style.top = y.pageY - 25 + "px";
        };
        window.__debugURL = window.location.href;
        var r = document.createElement("button");
        document.body.appendChild(r);
        r.innerHTML = "Debug";
        r.style.color = "red";
        r.style.position = "fixed";
        r.style.zIndex = "99999";
        r.style.width = "50px";
        r.style.height = "50px";
        r.style.borderRadius = "25px";
        r.style.background = "black";
        r.style.border = "none";
        r.style.bottom = "100px";
        r.style.right = "10px";
        r.onclick = function () {
          if (window.location.href.indexOf("/debug/pages/index/index") === -1) {
            window.__debugURL = window.location.href;
            my.navigateTo({
              url: "/debug/pages/index/index".concat(window.location.search)
            });
          }
        };
        r.addEventListener("mousedown", function (d) {
          document.addEventListener("mousemove", s);
        });
        r.addEventListener("mouseup", function () {
          document.removeEventListener("mousemove", s);
        });
        r.addEventListener("touchmove", function (d) {
          var y = d.targetTouches[0];
          s(y);
        });
        var u = document.createElement("script");
        u.setAttribute("defer", "");
        u.src = "https://g.alicdn.com/code/npm/@ali/ltracker-h5-plugin-validate/1.0.4/index.min.js";
        document.body.appendChild(u);
      }
    }
    function I(s) {
      var r = s || {},
        u = r.triggerType,
        d = u === void 0 ? "or" : u,
        y = r.trigger,
        B = y === void 0 ? [] : y,
        z = !1;
      if (Ye.Z.isDebugPage() || w()) return !0;
      try {
        var be = d === "or" ? B.some : B.every;
        z = be.call(B, function (ne) {
          var ie = ne.matchType,
            Le = ne.userId,
            we = ne.deviceId,
            Ne = ne.from,
            re = ne.userAgent,
            X = ne.h5Version,
            q = ne.triggerType,
            Ve = q === void 0 ? "or" : q,
            or = ne.trigger,
            We = or === void 0 ? [] : or,
            He = ne.key,
            nr = ne.value;
          if (Le) {
            var Fe = (0, Ce.bG)() || {},
              Pe = Fe.user_id,
              ge = Fe.havana_id;
            return o(ie, Le, Pe) || o(ie, Le, ge);
          }
          if (Ne) {
            var he = (0, Ce.XL)() || {},
              cr = he.from;
            return o(ie, Ne, cr);
          }
          if (we) {
            var lr = (0, Ce.Zw)() || "";
            return o(ie, we, lr);
          }
          if (re) {
            var Er = window.navigator.userAgent || "";
            return o(ie, re, Er);
          }
          if (X) {
            var F = "".concat(ue.version, "-").concat(ue.build_num);
            return o(ie, X, F);
          }
          return Ve && We && We.length > 0 ? I({
            triggerType: Ve,
            trigger: We
          }) : v(ie, He, nr);
        });
      } catch (ne) {
        console.error("[H5] d|fail ", ne);
      }
      return z;
    }
    function T() {
      var s = xe(),
        r = s.status,
        u = r === void 0 ? !1 : r,
        d = s.deviceClickCount,
        y = s.debugClickCount,
        B = s.clickDelay,
        z = s.triggerType,
        be = s.trigger;
      if (u) return u && (x = I({
        triggerType: z,
        trigger: be
      })), console.log("[H5] d| hit whitelist = ", x), $(), Ge(), tr(), _(), ve(B), Oe(b, y), Te(S, d), x && (setTimeout(function () {
        (0, k.default)().exlog.jserror("needDebug");
      }, 2e3), me().addSingleURLToWhitelist("ele.me"), qe()), x;
    }
    try {
      T();
    } catch (s) {
      console.error("[H5] d| setup config", s);
      (0, k.default)().exlog.jserror("needDebug", "fail", s);
    }
  },
  "05u5": function (Ze, Re, n) {
    var G = n("yw0p");
    Re.Z = {
      isDebugPage: function () {
        return window.location.href.startsWith("https://ppe-h5.ele.me") || window.location.href.startsWith("https://tb-h5.ele.me") || window.location.href.startsWith("https://h5.eleme.test");
      },
      getQueryDebugParams: function (k) {
        var i = G.Z.getQuery(window.location.search) || {};
        console.log("[H5] d| url query = ", i);
        return i;
      },
      stringToBoolean: function (k) {
        Object.keys(k).forEach(function (i) {
          switch (k[i]) {
            case "true":
              k[i] = !0;
              break;
            case "false":
              k[i] = !1;
              break;
            default:
              break;
          }
        });
      }
    };
  },
  CW13: function (Ze, Re, n) {
    n.d(Re, {
      FD: function () {
        return Ye;
      },
      G: function () {
        return fe;
      },
      GA: function () {
        return ve;
      },
      XL: function () {
        return c;
      },
      Zk: function () {
        return $e;
      },
      Zw: function () {
        return de;
      },
      _R: function () {
        return Te;
      },
      bG: function () {
        return le;
      },
      lX: function () {
        return Ie;
      },
      o_: function () {
        return pe;
      },
      qV: function () {
        return je;
      }
    });
    var G = n("gEaW");
    function J() {
      var K,
        O,
        P = typeof Symbol == "function" ? Symbol : {},
        E = P.iterator || "@@iterator",
        w = P.toStringTag || "@@toStringTag";
      function p(N, se, x, Ae) {
        var De = se && se.prototype instanceof L ? se : L,
          xe = Object.create(De.prototype);
        k(xe, "_invoke", function (qe, tr, Ge) {
          var $,
            f,
            o,
            v = 0,
            S = Ge || [],
            b = !1,
            _ = {
              p: 0,
              n: 0,
              v: K,
              a: I,
              f: I.bind(K, 4),
              d: function (s, r) {
                $ = s;
                f = 0;
                o = K;
                _.n = r;
                return C;
              }
            };
          function I(T, s) {
            f = T;
            o = s;
            O = 0;
            for (; !b && v && !r && O < S.length; O++) {
              var r,
                u = S[O],
                d = _.p,
                y = u[2];
              if (T > 3) {
                if (r = y === s) {
                  o = u[(f = u[4]) ? 5 : (f = 3, 3)];
                  u[4] = u[5] = K;
                }
              } else {
                if (u[0] <= d) {
                  if (r = T < 2 && d < u[1]) {
                    f = 0;
                    _.v = s;
                    _.n = u[1];
                  } else {
                    if (d < y && (r = T < 3 || u[0] > s || s > y)) {
                      u[4] = T;
                      u[5] = s;
                      _.n = y;
                      f = 0;
                    }
                  }
                }
              }
            }
            if (r || T > 1) return C;
            throw b = !0, s;
          }
          return function (T, s, r) {
            if (v > 1) throw TypeError("Generator is already running");
            if (b && s === 1) {
              I(s, r);
            }
            f = s;
            o = r;
            for (; (O = f < 2 ? K : o) || !b;) {
              if (!$) {
                if (f) {
                  if (f < 3) {
                    if (f > 1) {
                      _.n = -1;
                    }
                    I(f, o);
                  } else {
                    _.n = o;
                  }
                } else {
                  _.v = o;
                }
              }
              try {
                v = 2;
                if ($) {
                  if (!f) {
                    T = "next";
                  }
                  if (O = $[T]) {
                    if (!(O = O.call($, o))) throw TypeError("iterator result is not an object");
                    if (!O.done) return O;
                    o = O.value;
                    if (f < 2) {
                      f = 0;
                    }
                  } else {
                    if (f === 1 && (O = $.return)) {
                      O.call($);
                    }
                    if (f < 2) {
                      o = TypeError("The iterator does not provide a '" + T + "' method");
                      f = 1;
                    }
                  }
                  $ = K;
                } else if ((O = (b = _.n < 0) ? o : qe.call(tr, _)) !== C) break;
              } catch (u) {
                $ = K;
                f = 1;
                o = u;
              } finally {
                v = 1;
              }
            }
            return {
              value: O,
              done: b
            };
          };
        }(N, x, Ae), !0);
        return xe;
      }
      var C = {};
      function L() {}
      function H() {}
      function M() {}
      O = Object.getPrototypeOf;
      var V = [][E] ? O(O([][E]())) : (k(O = {}, E, function () {
          return this;
        }), O),
        Y = M.prototype = L.prototype = Object.create(V);
      function oe(N) {
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(N, M);
        } else {
          N.__proto__ = M;
          k(N, w, "GeneratorFunction");
        }
        N.prototype = Object.create(Y);
        return N;
      }
      H.prototype = M;
      k(Y, "constructor", M);
      k(M, "constructor", H);
      H.displayName = "GeneratorFunction";
      k(M, w, "GeneratorFunction");
      k(Y);
      k(Y, w, "Generator");
      k(Y, E, function () {
        return this;
      });
      k(Y, "toString", function () {
        return "[object Generator]";
      });
      return (J = function () {
        return {
          w: p,
          m: oe
        };
      })();
    }
    function k(K, O, P, E) {
      var w = Object.defineProperty;
      try {
        w({}, "", {});
      } catch (p) {
        w = 0;
      }
      k = function (C, L, H, M) {
        function V(Y, oe) {
          k(C, Y, function (N) {
            return this._invoke(Y, oe, N);
          });
        }
        if (L) {
          if (w) {
            w(C, L, {
              value: H,
              enumerable: !M,
              configurable: !M,
              writable: !M
            });
          } else {
            C[L] = H;
          }
        } else {
          V("next", 0);
          V("throw", 1);
          V("return", 2);
        }
      };
      k(K, O, P, E);
    }
    var i = function (O, P, E) {
        return new Promise(function (w, p) {
          var C = function (V) {
              try {
                H(E.next(V));
              } catch (Y) {
                p(Y);
              }
            },
            L = function (V) {
              try {
                H(E.throw(V));
              } catch (Y) {
                p(Y);
              }
            },
            H = function (V) {
              return V.done ? w(V.value) : Promise.resolve(V.value).then(C, L);
            };
          H((E = E.apply(O, P)).next());
        });
      },
      me;
    function ue(K) {}
    function le() {
      if (!me) {
        me = (0, G.default)().utils.storageExpire.getSync("USER_INFO", {});
      }
      return me;
    }
    function Se() {
      return i(this, null, J().m(function K() {
        return J().w(function (O) {
          for (;;) switch (O.n) {
            case 0:
              if (me) {
                O.n = 2;
                break;
              }
              O.n = 1;
              return (0, G.default)().utils.storageExpire.get("USER_INFO", {});
            case 1:
              me = O.v;
            case 2:
              return O.a(2, me);
          }
        }, K);
      }));
    }
    var fe = (0, G.default)().utils.storageExpire.getCache(function () {
      return (0, G.default)().utils.storageExpire.getSync("DEBUG_IS_HIT_USER", !1);
    });
    function Ie(K) {
      if (K) {
        (0, G.default)().utils.storageExpire.set("DEBUG_IS_HIT_USER", K);
      } else {
        (0, G.default)().utils.storageExpire.del("DEBUG_IS_HIT_USER");
      }
    }
    var pe = (0, G.default)().utils.storageExpire.getCache(function () {
      var K = (0, G.default)().utils.storageExpire.getSync("DEBUG_CONFIG", {});
      return K && K.debug;
    });
    function je(K) {
      var O = K || {},
        P = O.debug,
        E = P || {},
        w = E.status,
        p = w === void 0 ? !1 : w,
        C = E.searchQuery,
        L = C || {},
        H = L.__Dreport;
      if (H == 0) {
        $e();
      }
      if (p) {
        (0, G.default)().utils.storageExpire.set("DEBUG_CONFIG", K);
      } else {
        (0, G.default)().utils.storageExpire.del("DEBUG_CONFIG");
        window.localStorage.removeItem("TiGa-ELEME_DEBUG_CONFIG");
      }
    }
    var c = (0, G.default)().utils.storageExpire.getCache(function () {
      return (0, G.default)().utils.storageExpire.getSync("URL_QUERY_PARAMS", {});
    });
    function U(K) {
      return (0, G.default)().utils.storageExpire.set("URL_QUERY_PARAMS", K);
    }
    var de = (0, G.default)().utils.storageExpire.getCache(function () {
        var K = my.getStorageSync({
          key: "ELEME_DEVICE_ID"
        });
        return K && K.data;
      }),
      ve = (0, G.default)().utils.storageExpire.getCache(function () {
        var K = my.getStorageSync({
          key: "ELEME_DEVICE_ID"
        });
        return K && K.data;
      });
    function Oe(K) {
      my.setStorageSync("ELEME_DEVICE_ID", K);
    }
    var Te = (0, G.default)().utils.storageExpire.getCache(function () {
      return (0, G.default)().utils.storageExpire.getSync("DEBUG_REPORT", !1);
    });
    function $e() {
      var K = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !1;
      (0, G.default)().utils.storageExpire.del("DEBUG_REPORT");
    }
    function Ye() {
      var K = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !1;
      (0, G.default)().utils.storageExpire.setSync("DEBUG_REPORT", K, 1 * 60 * 60);
    }
    window.__db_setDebugReport = Ye;
    var Ce = {
      setUserInfo: ue,
      getUserInfo: le,
      getUserInfoAsync: Se,
      setDebugConfig: je,
      getDebugConfig: pe,
      getUrlQueryParams: c,
      setUrlQueryParams: U,
      getDeviceId: de,
      getWaimaiDeviceId: ve,
      setDeviceId: Oe,
      getIsHitUser: fe,
      setIsHitUser: Ie,
      setDebugReport: Ye,
      getDebugReport: Te
    };
  },
  Gw60: function (Ze, Re, n) {
    n.d(Re, {
      P1: function () {
        return i;
      },
      WC: function () {
        return k;
      },
      pS: function () {
        return J;
      }
    });
    var G = n("lk4z");
    function J(ue) {
      return ue && String(ue).startsWith("104");
    }
    function k(ue) {
      return ue && Object.values(G.xI).indexOf(ue) >= 0;
    }
    function i(ue) {
      var le = ue.businessComeFrom,
        Se = ue.from,
        fe = ue.channel_code,
        Ie = fe === G.ki.businessCode,
        pe = le === G.mZ.gonghuiding,
        je = Se === G.mZ.greenbuy,
        c = fe === G.xI.medicare,
        U = Se === G.mZ.guanaitong;
      return !!(Ie || pe || je || c || U);
    }
    var me = {
      isNewRetailChannel: J,
      isMedicalChannel: k,
      isHideSugAndFound: i
    };
  },
  lk4z: function (Ze, Re, n) {
    n.d(Re, {
      $k: function () {
        return Ce;
      },
      AZ: function () {
        return U;
      },
      Df: function () {
        return $;
      },
      G7: function () {
        return pe;
      },
      Jn: function () {
        return ne;
      },
      NQ: function () {
        return ue;
      },
      Np: function () {
        return Te;
      },
      Or: function () {
        return k;
      },
      Wd: function () {
        return V;
      },
      X4: function () {
        return s;
      },
      X8: function () {
        return M;
      },
      av: function () {
        return B;
      },
      cw: function () {
        return me;
      },
      dq: function () {
        return I;
      },
      fA: function () {
        return P;
      },
      fF: function () {
        return Se;
      },
      fm: function () {
        return fe;
      },
      g8: function () {
        return d;
      },
      gh: function () {
        return K;
      },
      iN: function () {
        return i;
      },
      jD: function () {
        return Ie;
      },
      jI: function () {
        return je;
      },
      kU: function () {
        return Ye;
      },
      ki: function () {
        return y;
      },
      lB: function () {
        return tr;
      },
      mZ: function () {
        return be;
      },
      np: function () {
        return O;
      },
      pU: function () {
        return r;
      },
      qR: function () {
        return J;
      },
      qc: function () {
        return Oe;
      },
      rt: function () {
        return T;
      },
      uK: function () {
        return de;
      },
      wh: function () {
        return ie;
      },
      xI: function () {
        return z;
      },
      y_: function () {
        return E;
      }
    });
    var G = n("zThL"),
      J = "Page_Search",
      k = "pages/search/search",
      i = "Page_SearchResult",
      me = "recommend",
      ue = "suggest",
      le = "result",
      Se = "normal",
      fe = "searchIndex",
      Ie = "searchResult",
      pe = {
        SORT_FILTER_HEADER: "mat_header-sortFilterHeader",
        QUICK_FILTER_HEADER: "mat_header-quickFilterHeader",
        IMAGE_FILTER_HEADER: "mat_knowledge_mbox_card",
        SHOP_MODE: "mat_shopmode-shop-item",
        SHOP_MODE_DRAG_FOOD: "mat_shopmode-shop-dargfood-item",
        SHOP_MODE_V2: "mat_shopmode-shop-item-v2",
        CATE_MODE: "mat_catemode-shop-item",
        CATE_MODE_BIG_FOOD: "mat_catemode-bigfood-item",
        SHOP_SMART_UI_CARD: "mat_jingmi-1178",
        TOP_EMPTY: "mat_top-empty-item",
        MIDDLE_EMPTY: "mat_middle-empty-item",
        RECOMMEND_TITLE: "mat_recommend-title-item",
        INTRODUCER: "mat_middle-introducer-item",
        MEDICAL_EMPTY: "mat_medical-empty-item",
        VIRTUAL_SHOP: "mat_header-virtual-shop",
        RUN_ERRAND_SHOP: "mat_header-runerrand-shop",
        OUT_SIDE_SHOP: "mat_header-outside-shop",
        HOT_BOARD_ITEM: "mat_header-topic",
        BANNER_COUPON: "mat_header-banner-coupon",
        H5_RECOMMEND_TITLE: "h5_recommend-title-item",
        H5_SHOP_MODE: "h5_shopmode-shop-item",
        INSTRUCTION_CARD: "mat_instruction_card",
        INSTRUCTION_CARD_V2: "ms_eleme-search-weex-v2_instruction_card",
        FEEDBACK_CARD: "mat_feedback_card",
        NO_RESULT_TIPS_ITEM: "mat_no_result_tips_item",
        OUT_OF_RANGE_ITEM: "mat_out_of_range_item",
        PROCUREMENT_SERVICE_ITEM: "mat_procurement_service_item",
        FEEDBACK_SHOP_CARD: "mat_shopmode-feedback-shop-item-card",
        FEEDBACK_SHOP_CLOSE_CARD: "mat_shopmode-feedback-shop-item-close-card",
        FEEDBACK_SHOP_CARD_ET: "ms_eleme-search-weex-v2_screen_shops_tips_item"
      },
      je = {
        HISTORY: "HISTORY",
        HOT_BOARDS: "HOT_BOARDS",
        RESTAURANTS: "RESTAURANTS",
        CHANNEL_ITEMS: "CHANNEL_ITEMS",
        SEARCH_HOT_WORDS: "SEARCH_HOT_WORDS",
        REC_WORDS: "REC_WORDS"
      },
      c = {
        BRAND: 1,
        SHOP: 2,
        FOOD: 3,
        CATEGORY: 4
      },
      U = {
        SEARCH_FOUND_KEY: "SEARCH_FOUND_KEY"
      },
      de = {
        OPEN: 1,
        BUSYING: 2,
        TEMP_PHONE_ONLY: 3,
        CLOSING: 4,
        BOOK_ONLY: 5,
        PHONE_ONLY: 6,
        RESTING: 8,
        WILL_CLOSING: 9,
        SUSPEND_BUSINESS: 10,
        SUSPEND_ORDER: 11,
        NO_DELIVERY_ONLY_SELF_FETCH: 12,
        TO_CLOSE_ONLY_SELF_FETCH: 14,
        NO_DELIVERY_ONLY_BOOK: 16,
        IS_DY_ENV_AND_NOT_DY_SIGN_SHOP: 20
      },
      ve = {
        NEW: "isNew",
        PREMIUM: "isPremium",
        STAR: "isStar",
        OTHER: "other"
      },
      Oe = "ELEME_HISTORICAL_SEARCH",
      Te = "ELEME_HISTORICAL_MEDICAL_SEARCH",
      $e = "ELEME_HISTORICAL_MEDICARE_SEARCH",
      Ye = "ELEME_HISTORICAL_SUPERMARKET_SEARCH",
      Ce = "ELEME_HISTORICAL_FRESH_SEARCH",
      K = "ELEME_HISTORICAL_FLOWER_SEARCH",
      O = "ELEME_HISTORICAL_KITCHEN_SEARCH",
      P = "ELEME_HISTORICAL_NEWRETIAL_COMMON_SEARCH",
      E = "STORAGE_KEY_FOUND",
      w = 1,
      p = 2,
      C = 3,
      L = "SUGGEST_CARD_REC_WORDS",
      H = "SUGGEST_CARD_WORD",
      M = "SUGGEST_CARD_SHOP",
      V = "SUGGEST_CARD_AD_SHOP",
      Y = "SUGGEST_CARD_FOOT",
      oe = "SUGGEST_CARD_NO_RESULT",
      N = "SUGGEST_CARD_OP_WORD",
      se = "SUGGEST_CARD_GEN_WORD",
      x = "\u5386\u53F2\u8BCD",
      Ae = "\u641C\u7D22\u53D1\u73B0\u70ED\u8BCD",
      De = "\u731C\u4F60\u60F3\u641C\u8BCD",
      xe = "\u8054\u60F3\u8BCD",
      qe = "\u8054\u60F3\u8BCD-\u731C\u4F60\u60F3\u641C",
      tr = "\u76F4\u63A5\u641C\u7D22",
      Ge = "\u9996\u9875\u641C\u7D22\u6846\u4E0B\u70ED\u8BCD",
      $ = "\u5E95\u7EB9\u8BCD",
      f = "\u70ED\u641C\u699C",
      o = "\u641C\u7D22\u6846\u4E0B\u70ED\u8BCD\u641C\u7D22",
      v = "\u56FE\u6587\u7B5B\u9009",
      S = "\u699C\u5355",
      b = "\u4E0B\u7F6E\u8BCD",
      _ = "SRP\u8BCD\u4E91\u5361\u7247",
      I = {
        0: tr,
        1: $,
        2: "",
        3: xe,
        4: x,
        5: Ae,
        6: "",
        7: "",
        8: "",
        10: S,
        9: Ge,
        21: b,
        22: _,
        100: ""
      },
      T = "ES0006588916",
      s = (0, G.Z)({}, T, "58"),
      r = {
        defaultAddress: "0",
        cacheAddress: "1",
        realAddress: "3",
        realPoi: "4",
        userAddress: "5",
        userPoi: "6"
      },
      u = {
        deleted: -1,
        normal: 0,
        goShop: 1,
        agentFeeChaned: 2,
        undeliverable: 3
      },
      d = {
        defaultLocation: "defaultLocation",
        settingTip: "setting",
        areaMulti: "multi"
      },
      y = {
        businessCode: "105",
        dingdingPindan: "10602",
        tbxsd: "20201",
        tbxsdtab: "20202",
        tbxsd401: "20401",
        tbxsd402: "20402",
        tbxsd403: "20403",
        tbxsd404: "20404"
      },
      B = {
        supermarket: "10401",
        fresh: "10402",
        flower: "10403",
        kitchen: "10404",
        citygo: "10405",
        sub_supermarket: "10406",
        store: "10407",
        snack: "10408",
        milk_drinks: "10409",
        beauty: "10410",
        infant_mom: "10411",
        pet: "10412",
        mobil: "10413"
      },
      z = {
        medical_channel: "102",
        medicare: "202"
      },
      be = {
        gonghuiding: "gonghuiding",
        greenbuy: "mobile.greenbuy",
        guanaitong: "mobile.guanaitongnew"
      },
      ne = {
        Page_SearchResult: "srp",
        Page_Home: "home",
        Page_ShopDetail: "shop",
        Page_Address: "address",
        ushop: "shop"
      },
      ie = {
        supportIds: "supports",
        averageCostIds: "averageCosts"
      },
      Le = {
        SPM_PAGE_NAME: J,
        SPM_PAGE_RESULT_NAME: i,
        STATUS_RESULT: le,
        STATUS_NORMAL: Se,
        SEARCH_INDEX_PAGE: fe,
        SEARCH_RESULT_PAGE: Ie,
        STATUS_RECOMMEND: me,
        STATUS_SUGGEST: ue,
        TYPE_SERACH_RESULT_TEMPLATE: pe,
        TYPE_SERACH_FOUND_MODEL: je,
        TYPE_WORD: c,
        SHOP_STATUS: de,
        SHOP_EXTRA_STATUS: ve,
        STORAGE_KEY_HISTORICAL: Oe,
        ELEMENT_TYPE_SHOP: w,
        ELEMENT_TYPE_WORD: p,
        ELEMENT_TYPE_MODULE: C,
        SEARCH_REFER_HISTORICAL: x,
        SEARCH_REFER_POPULAR: Ae,
        SEARCH_REFER_GUESS: De,
        SEARCH_REFER_RELATION: xe,
        SEARCH_REFER_RELATION_GUESS: qe,
        SEARCH_REFER_DIRECT: tr,
        SEARCH_REFER_HOME_HOT: Ge,
        SEARCH_REFER_PLACEHOLDER: $,
        SEARCH_REFER_HOT_LIST: f,
        ENTRY_CODE_MAP: I,
        NEW_RETIAL_CHANNEL_MAP: B,
        MEDICAL_CHANNEL_MAP: z,
        PREFETCH_STORAGE_KEYS: U,
        ELEME_HISTORICAL_MEDICARE_SEARCH: $e,
        STORAGE_KEY_MEDICAL_HISTORICAL: Te,
        STORAGE_KEY_SUPERMARKET_HISTORICAL: Ye,
        STORAGE_KEY_FRESH_HISTORICAL: Ce,
        STORAGE_KEY_FLOWER_HISTORICAL: K,
        STORAGE_KEY_KITCHEN_HISTORICAL: O,
        STORAGE_KEY_NEWRETIAL_COMMON_HISTORICAL: P,
        STORAGE_KEY_FOUND: E,
        COMMON_CHANNEL_MAP: y,
        SUGGEST_CARD_REC_WORDS: L,
        SUGGEST_CARD_WORD: H,
        SUGGEST_CARD_SHOP: M,
        SUGGEST_CARD_AD_SHOP: V,
        SUGGEST_CARD_FOOT: Y,
        SUGGEST_CARD_NO_RESULT: oe,
        SUGGEST_CARD_OP_WORD: N,
        SUGGEST_CARD_GEN_WORD: se,
        BUSINESS_COME_FROM: be,
        ENTER_MIDDLE_MAP: ne,
        FILTER_INNER_MAP: ie
      };
  },
  hr2I: function (Ze, Re, n) {
    n.d(Re, {
      S: function () {
        return k;
      }
    });
    var G = n("6EqU"),
      J = n.n(G);
    Re.Z = function () {
      var i = "a2f6g";
      try {
        if (J()().utils.platform.IS_DY_ENV || J()().utils.platform.IS_DYLT_ENV) {
          i = "a2ogi";
        } else {
          if (J()().utils.platform.IS_TB_ENV || J()().utils.platform.IS_LT_ENV) {
            i = "a2f6g";
          } else {
            if (J()().utils.platform.IS_WX_ENV) {
              i = "a2ogi";
            } else {
              if (J()().utils.platform.IS_WEB_ENV) {
                i = "h5";
              } else {
                i = "a2f6g";
              }
            }
          }
        }
      } catch (me) {}
      return i;
    };
    var k = function () {
      return "a2f6g";
    };
  },
  Qiv0: function (Ze, Re, n) {
    n.d(Re, {
      x: function () {
        return K;
      }
    });
    var G = n("k6Di"),
      J = n("79Ja"),
      k = n("byvu"),
      i = n("gd2s"),
      me = n("6Yeu"),
      ue = n("udpn"),
      le = n("zqUE"),
      Se = function () {
        function O(P) {
          var E = P.next,
            w = P.error,
            p = P.complete,
            C = P.unsubscribe;
          (0, G.Z)(this, O);
          if (!E) throw new Error("[rx-like] Subscription.constructor: next is required");
          this._next = E;
          this.closed = !1;
          this._error = w || this._error;
          this._complete = p || this._complete;
          this._unsubscribe = C || this._unsubscribe;
        }
        return (0, J.Z)(O, [{
          key: "unsubscribe",
          value: function (E) {
            if (!this.closed) {
              this.closed = !0;
              this._unsubscribe();
              if (E) {
                E();
              }
            }
          }
        }, {
          key: "next",
          value: function (E) {
            if (!this.closed) {
              this._next(E);
            }
          }
        }, {
          key: "error",
          value: function (E) {
            if (!this.closed) {
              this._error(E);
            }
          }
        }, {
          key: "_error",
          value: function (E) {
            console.log("[rx-like] Subscription._error: ".concat(E.message));
            console.trace(E);
          }
        }, {
          key: "complete",
          value: function () {
            this._complete.apply(this, arguments);
          }
        }, {
          key: "_complete",
          value: function () {
            console.log("%c[rx-like] Subscription.Complete%s", "color: #1989fa;");
          }
        }, {
          key: "_unsubscribe",
          value: function () {
            this.closed = !0;
          }
        }]);
      }();
    function fe(O, P, E) {
      P = (0, ue.Z)(P);
      return (0, i.Z)(O, (0, me.Z)() ? Reflect.construct(P, E || [], (0, ue.Z)(O).constructor) : P.apply(O, E));
    }
    var Ie = function (O) {
        function P(E) {
          var w = E.next,
            p = E.error,
            C = E.complete,
            L = E.unsubscribe;
          (0, G.Z)(this, P);
          return fe(this, P, [{
            next: w,
            error: p,
            complete: C,
            unsubscribe: L
          }]);
        }
        (0, le.Z)(P, O);
        return (0, J.Z)(P);
      }(Se),
      pe = n("+BzW");
    function je() {
      var O,
        P,
        E = typeof Symbol == "function" ? Symbol : {},
        w = E.iterator || "@@iterator",
        p = E.toStringTag || "@@toStringTag";
      function C(se, x, Ae, De) {
        var xe = x && x.prototype instanceof H ? x : H,
          qe = Object.create(xe.prototype);
        c(qe, "_invoke", function (tr, Ge, $) {
          var f,
            o,
            v,
            S = 0,
            b = $ || [],
            _ = !1,
            I = {
              p: 0,
              n: 0,
              v: O,
              a: T,
              f: T.bind(O, 4),
              d: function (r, u) {
                f = r;
                o = 0;
                v = O;
                I.n = u;
                return L;
              }
            };
          function T(s, r) {
            o = s;
            v = r;
            P = 0;
            for (; !_ && S && !u && P < b.length; P++) {
              var u,
                d = b[P],
                y = I.p,
                B = d[2];
              if (s > 3) {
                if (u = B === r) {
                  v = d[(o = d[4]) ? 5 : (o = 3, 3)];
                  d[4] = d[5] = O;
                }
              } else {
                if (d[0] <= y) {
                  if (u = s < 2 && y < d[1]) {
                    o = 0;
                    I.v = r;
                    I.n = d[1];
                  } else {
                    if (y < B && (u = s < 3 || d[0] > r || r > B)) {
                      d[4] = s;
                      d[5] = r;
                      I.n = B;
                      o = 0;
                    }
                  }
                }
              }
            }
            if (u || s > 1) return L;
            throw _ = !0, r;
          }
          return function (s, r, u) {
            if (S > 1) throw TypeError("Generator is already running");
            if (_ && r === 1) {
              T(r, u);
            }
            o = r;
            v = u;
            for (; (P = o < 2 ? O : v) || !_;) {
              if (!f) {
                if (o) {
                  if (o < 3) {
                    if (o > 1) {
                      I.n = -1;
                    }
                    T(o, v);
                  } else {
                    I.n = v;
                  }
                } else {
                  I.v = v;
                }
              }
              try {
                S = 2;
                if (f) {
                  if (!o) {
                    s = "next";
                  }
                  if (P = f[s]) {
                    if (!(P = P.call(f, v))) throw TypeError("iterator result is not an object");
                    if (!P.done) return P;
                    v = P.value;
                    if (o < 2) {
                      o = 0;
                    }
                  } else {
                    if (o === 1 && (P = f.return)) {
                      P.call(f);
                    }
                    if (o < 2) {
                      v = TypeError("The iterator does not provide a '" + s + "' method");
                      o = 1;
                    }
                  }
                  f = O;
                } else if ((P = (_ = I.n < 0) ? v : tr.call(Ge, I)) !== L) break;
              } catch (d) {
                f = O;
                o = 1;
                v = d;
              } finally {
                S = 1;
              }
            }
            return {
              value: P,
              done: _
            };
          };
        }(se, Ae, De), !0);
        return qe;
      }
      var L = {};
      function H() {}
      function M() {}
      function V() {}
      P = Object.getPrototypeOf;
      var Y = [][w] ? P(P([][w]())) : (c(P = {}, w, function () {
          return this;
        }), P),
        oe = V.prototype = H.prototype = Object.create(Y);
      function N(se) {
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(se, V);
        } else {
          se.__proto__ = V;
          c(se, p, "GeneratorFunction");
        }
        se.prototype = Object.create(oe);
        return se;
      }
      M.prototype = V;
      c(oe, "constructor", V);
      c(V, "constructor", M);
      M.displayName = "GeneratorFunction";
      c(V, p, "GeneratorFunction");
      c(oe);
      c(oe, p, "Generator");
      c(oe, w, function () {
        return this;
      });
      c(oe, "toString", function () {
        return "[object Generator]";
      });
      return (je = function () {
        return {
          w: C,
          m: N
        };
      })();
    }
    function c(O, P, E, w) {
      var p = Object.defineProperty;
      try {
        p({}, "", {});
      } catch (C) {
        p = 0;
      }
      c = function (L, H, M, V) {
        function Y(oe, N) {
          c(L, oe, function (se) {
            return this._invoke(oe, N, se);
          });
        }
        if (H) {
          if (p) {
            p(L, H, {
              value: M,
              enumerable: !V,
              configurable: !V,
              writable: !V
            });
          } else {
            L[H] = M;
          }
        } else {
          Y("next", 0);
          Y("throw", 1);
          Y("return", 2);
        }
      };
      c(O, P, E, w);
    }
    var U = function (P, E, w) {
        return new Promise(function (p, C) {
          var L = function (Y) {
              try {
                M(w.next(Y));
              } catch (oe) {
                C(oe);
              }
            },
            H = function (Y) {
              try {
                M(w.throw(Y));
              } catch (oe) {
                C(oe);
              }
            },
            M = function (Y) {
              return Y.done ? p(Y.value) : Promise.resolve(Y.value).then(L, H);
            };
          M((w = w.apply(P, E)).next());
        });
      },
      de = function () {
        function O(P) {
          var E = P.source,
            w = P.operators;
          (0, G.Z)(this, O);
          this._source = E || null;
          this._operators = w || [];
        }
        return (0, J.Z)(O, [{
          key: "pipe",
          value: function () {
            for (var E, w = arguments.length, p = new Array(w), C = 0; C < w; C++) p[C] = arguments[C];
            return (E = this._source).pipe.apply(E, (0, pe.Z)(this._operators).concat(p));
          }
        }, {
          key: "subscribe",
          value: function (E, w, p) {
            var C = this,
              L = this._source.subscribe(function (H) {
                return U(C, null, je().m(function M() {
                  var V, Y, oe, N, se;
                  return je().w(function (x) {
                    for (;;) switch (x.p = x.n) {
                      case 0:
                        x.p = 0;
                        V = (0, k.Z)(this._operators);
                        x.p = 1;
                        V.s();
                      case 2:
                        if ((Y = V.n()).done) {
                          x.n = 5;
                          break;
                        }
                        oe = Y.value;
                        x.n = 3;
                        return Promise.resolve(oe.call(this, H));
                      case 3:
                        H = x.v;
                      case 4:
                        x.n = 2;
                        break;
                      case 5:
                        x.n = 7;
                        break;
                      case 6:
                        x.p = 6;
                        N = x.v;
                        V.e(N);
                      case 7:
                        x.p = 7;
                        V.f();
                        return x.f(7);
                      case 8:
                        E(H);
                        x.n = 10;
                        break;
                      case 9:
                        x.p = 9;
                        se = x.v;
                        if (w) {
                          w(se);
                        }
                      case 10:
                        return x.a(2);
                    }
                  }, M, this, [[1, 6, 7, 8], [0, 9]]);
                }));
              }, w, p);
            return L;
          }
        }]);
      }(),
      ve = Object.defineProperty,
      Oe = Object.getOwnPropertySymbols,
      Te = Object.prototype.hasOwnProperty,
      $e = Object.prototype.propertyIsEnumerable,
      Ye = function (P, E, w) {
        return E in P ? ve(P, E, {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: w
        }) : P[E] = w;
      },
      Ce = function (P, E) {
        for (var w in E || (E = {})) {
          if (Te.call(E, w)) {
            Ye(P, w, E[w]);
          }
        }
        if (Oe) {
          var p = (0, k.Z)(Oe(E)),
            C;
          try {
            for (p.s(); !(C = p.n()).done;) {
              var w = C.value;
              if ($e.call(E, w)) {
                Ye(P, w, E[w]);
              }
            }
          } catch (L) {
            p.e(L);
          } finally {
            p.f();
          }
        }
        return P;
      },
      K = function () {
        function O(P) {
          (0, G.Z)(this, O);
          this._subscriptions = [];
          this.setValue(P);
        }
        return (0, J.Z)(O, [{
          key: "setValue",
          value: function (E) {
            this._value = E;
          }
        }, {
          key: "getValue",
          value: function () {
            return this._value;
          }
        }, {
          key: "pipe",
          value: function () {
            for (var E = arguments.length, w = new Array(E), p = 0; p < E; p++) w[p] = arguments[p];
            return new de({
              source: this,
              operators: w
            });
          }
        }, {
          key: "subscribe",
          value: function (E, w, p) {
            var C = this,
              L = new Ie({
                next: E,
                error: w,
                complete: p,
                unsubscribe: function () {
                  C._subscriptions.splice(C._subscriptions.indexOf(L), 1);
                }
              });
            this._trySubscribe(L);
            return L;
          }
        }, {
          key: "_trySubscribe",
          value: function (E) {
            this._subscriptions.push(E);
            try {
              E.next(this.getValue());
            } catch (w) {
              E.error(w);
            }
          }
        }, {
          key: "next",
          value: function (E) {
            this.setValue(E);
            this._next(this.getValue());
          }
        }, {
          key: "mergeNext",
          value: function (E) {
            this.next(Ce(Ce({}, this.getValue()), E));
          }
        }, {
          key: "_next",
          value: function (E) {
            this._subscriptions.forEach(this._forEachNext.bind(this, E));
          }
        }, {
          key: "_forEachNext",
          value: function (E, w) {
            w.next(E);
          }
        }]);
      }();
  },
  bNyJ: function (Ze, Re, n) {
    n.d(Re, {
      NR: function () {
        return me;
      },
      Qk: function () {
        return Se;
      },
      Vg: function () {
        return fe;
      },
      ZH: function () {
        return le;
      },
      at: function () {
        return ue;
      },
      rO: function () {
        return Ie;
      }
    });
    var G = n("6EqU"),
      J = n.n(G),
      k = function () {
        return !!(typeof window != "undefined" && window.ebridge && window.ebridge.isMINIAPP && getApp().query.appid === "8251537" && /AliApp\(TB\//i.test(navigator.userAgent));
      },
      i = function () {
        return !!(typeof window != "undefined" && window.ebridge && window.ebridge.isMINIAPP && getApp().query.appid === "2021001110676437" && /AliApp\(AP\//i.test(navigator.userAgent));
      },
      me = function () {
        return J()().utils.platform.IS_WEB_ENV && (k() || i());
      },
      ue = function () {
        return typeof navigator == "undefined" || !navigator.userAgent ? !1 : !!(/AliApp\(TB/i.test(navigator.userAgent) && (/WindVane\//i.test(navigator.userAgent) || le()));
      },
      le = function () {
        return /ArkWeb\//i.test(navigator.userAgent);
      },
      Se = function () {
        return ue() ? window.themis && window.themis.appContext && window.themis.appContext.solution == "UNIAPP" : !1;
      },
      fe = function () {
        return typeof location == "undefined" || !location.href || !ue() ? !1 : location.href.indexOf("disableNav=YES") >= 0;
      },
      Ie = function (je, c) {
        console.log("searchUniAppQuery, from: %s, dest: %s", je, c);
        if (!Se()) return {};
        if (c !== "sp" && c !== "srp") throw new Error("searchUniAppQuery, ".concat(c, " is not supported."));
        var U = {
            forceThemis: !0
          },
          de = window.location.origin.toLowerCase();
        switch (de) {
          case "http://ppe-h5.ele.me":
            U.uniapp_id = "1100356";
            if (c === "sp") {
              U.uniapp_page = "eleme_tb_search_ppe_http";
            } else {
              U.uniapp_page = "eleme_tb_search_result_ppe_http";
            }
            break;
          case "http://h5.ele.me":
            U.uniapp_id = "1100356";
            if (c === "sp") {
              U.uniapp_page = "eleme_tb_search_http";
            } else {
              U.uniapp_page = "eleme_tb_search_result_http";
            }
            break;
          case "https://ppe-h5.ele.me":
            U.uniapp_id = "1100351";
            if (c === "sp") {
              U.uniapp_page = "eleme_tb_search";
            } else {
              U.uniapp_page = "eleme_tb_search_result";
            }
            break;
          case "https://h5.ele.me":
          default:
            U.uniapp_id = "1100347";
            if (c === "sp") {
              U.uniapp_page = "eleme_tb_search";
            } else {
              U.uniapp_page = "eleme_tb_search_result";
            }
            break;
        }
        console.log("searchUniAppQuery, query: ", c, U);
        return U;
      };
  },
  "Gm/5": function (Ze, Re, n) {
    var G = n("6EqU"),
      J = n.n(G),
      k = function (me) {
        return J()().utils.hashToUrl(me);
      };
    Re.Z = k;
  },
  g96g: function (Ze, Re, n) {
    n.d(Re, {
      GB: function () {
        return Ie;
      },
      Hd: function () {
        return je;
      },
      M7: function () {
        return pe;
      },
      Xl: function () {
        return fe;
      },
      dA: function () {
        return Se;
      },
      wK: function () {
        return i;
      }
    });
    var G = n("6EqU"),
      J = n.n(G),
      k = n("Gm/5");
    function i(c) {
      if (!c) return "";
      if (c.indexOf("rgb") >= 0) return c;
      var U = c.slice(c.indexOf("#") === 0 ? 1 : 0);
      if (!(U.length === 3 || U.length === 6 || U.length === 8)) return "";
      if (U.length === 3) {
        U = U.split("").map(function (Te) {
          return Te + Te;
        }).join("");
      }
      if (U.length === 6) {
        U = "FF".concat(U);
      }
      if (U.length === 8) {
        U = "".concat(U.substring(2)).concat(U.substring(0, 1));
      }
      for (var de = [], ve = 0; ve < U.length - 1; ve += 2) {
        var Oe = U.substring(ve, ve + 2);
        if (ve > 5) {
          de.push(parseFloat((parseInt(Oe, 16) / 255).toFixed(2)));
        } else {
          de.push(parseInt(Oe, 16));
        }
      }
      return "rgba(".concat(de.join(","), ")");
    }
    function me(c) {
      var U = "";
      if (c.background && c.background.rgbFrom && c.background.rgbTo) {
        var de = "#".concat(c.background.rgbFrom.replace("#", "")),
          ve = "#".concat(c.background.rgbTo.replace("#", ""));
        U = "linear-gradient(to right, ".concat(de, ", ").concat(ve, ")");
      } else U = i(c.background);
      var Oe = i(c.nameColor || c.color),
        Te = i(c.border);
      return `
    color: `.concat(Oe, `;
    background: `).concat(U, `;
    border-color: `).concat(Te, `;
  `);
    }
    var ue = function (U, de, ve) {
        var Oe = new Promise(function ($e) {
            setTimeout($e, de);
          }),
          Te = Oe.then(function () {
            return Promise.reject(ve || "TIME_OUT");
          });
        return Promise.race([U, Te]);
      },
      le = function () {
        var U = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {},
          de = {};
        Object.keys(U).forEach(function (ve) {
          de[ve] = decodeURIComponent(U[ve]);
        });
        return de;
      },
      Se = function () {
        var U = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
          de = U.length;
        function ve(Oe) {
          return Array.from(new Array(Oe)).map(function () {
            return U[Math.floor(Math.random() * de)];
          }).join("");
        }
        return "".concat(Date.now().toString(36)).concat(ve(6));
      },
      fe = function () {
        var U = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
        return Object.keys(U).reduce(function (de, ve) {
          var Oe = U[ve];
          de.push("".concat(ve, "=").concat(encodeURIComponent(Oe)));
          return de;
        }, []).join("&");
      };
    function Ie(c) {
      var U = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
        de = J()().utils.platform.IS_WX_ENV || J()().utils.platform.IS_DY_ENV || J()().utils.platform.IS_DYLT_ENV ? "/ele-search" : "",
        ve = Object.keys(U).length ? "?".concat(fe(U)) : "";
      return de + c + ve;
    }
    var pe = function (U, de) {
      for (var ve = U.split(".").map(Number), Oe = de.split(".").map(Number), Te = 0; Te < Math.max(ve.length, Oe.length); Te++) {
        var $e = ve[Te] || 0,
          Ye = Oe[Te] || 0;
        if ($e > Ye) return 1;
        if ($e < Ye) return -1;
      }
      return 0;
    };
    function je() {
      return getApp().$ele().utils.getsubSubChannel();
    }
  },
  SyfN: function (Ze, Re) {
    var n = "ELEME_SEARCH_",
      G = {},
      J = {
        get: function (i) {
          return new Promise(function (me, ue) {
            if (!i) {
              ue("key is required");
            }
            return G[i] ? me(G[i]) : my.getStorage({
              key: n + i,
              success: function (Se) {
                if (!Se.data) return ue("");
                try {
                  var fe = typeof Se.data == "string" ? JSON.parse(Se.data) : Se.data,
                    Ie = fe.data;
                  G[i] = Ie;
                  me(Ie);
                } catch (pe) {
                  ue(pe);
                }
                return Se;
              },
              fail: function () {
                ue("");
              }
            });
          }).catch(function () {});
        },
        set: function (i, me) {
          return new Promise(function (ue, le) {
            if (!i) throw new Error("key is required");
            G[i] = me;
            return my.setStorage({
              key: n + i,
              data: JSON.stringify({
                data: me
              }),
              success: ue,
              fail: le
            });
          });
        },
        clear: function (i) {
          return new Promise(function (me, ue) {
            if (!i) throw new Error("key is required");
            G[i] = null;
            my.removeStorage({
              key: n + i,
              success: me,
              fail: ue
            });
          });
        }
      };
    Re.Z = Object.freeze(J);
  },
  y6Kz: function (Ze, Re, n) {
    n.d(Re, {
      Gn: function () {
        return c;
      },
      It: function () {
        return je;
      },
      SV: function () {
        return pe;
      },
      dV: function () {
        return U;
      },
      xv: function () {
        return fe;
      }
    });
    var G = n("6EqU"),
      J = n.n(G),
      k = n("bNyJ"),
      i = "mtop.relationrecommend.ElemeTinyAppRecommend.recommend",
      me = "mtop.relationrecommend.TinyAppRecommend.recommend",
      ue = J()().utils.platform.IS_ALIPAY_ENV || J()().utils.platform.IS_TB_ENV,
      le = J()().utils.platform.IS_WX_ENV,
      Se = J()().utils.platform.IS_WEB_ENV,
      fe = Se || ue || le ? i : me,
      Ie = typeof getApp == "function" && getApp() && getApp().$ele() && getApp().$ele().useSV2,
      pe = Ie || !J()().utils.platform.IS_WX_ENV ? "2.0" : "4.0",
      je = "15.0",
      c = "5.0",
      U = {
        getCoupon: {
          api: "mtop.alsc.upp.decisionsend.send",
          exlogApiName: "coupon_decisionsend_send",
          headers: {
            asac: "2A21325S1P7A6C9IQAEI27"
          },
          ext_headers: {
            asac: "2A21325S1P7A6C9IQAEI27"
          },
          ext_querys: {
            asac: "2A21325S1P7A6C9IQAEI27"
          }
        },
        34496: {
          api: "mtop.relationrecommend.elemerecommend.recommend",
          exlogApiName: "receive_coupon_34496",
          headers: {
            asac: "2A22125C9IZW8IQ7MK82CT"
          },
          ext_headers: {
            asac: "2A22125C9IZW8IQ7MK82CT"
          },
          ext_querys: {
            asac: "2A22125C9IZW8IQ7MK82CT"
          }
        },
        28665: {
          exlogApiName: "inner_filter",
          headers: {
            "x-ele-scene": "search_filter"
          },
          ext_headers: {
            "x-ele-scene": "search_filter"
          }
        },
        26551: {
          exlogApiName: "tpp_mergeSearch_result",
          headers: {
            "x-ele-scene": "search"
          },
          ext_headers: {
            "x-ele-scene": "search"
          },
          transformRequest: [function (ve) {
            if (typeof ve.headers["x-ele-ua"] == "string" && (0, k.at)()) {
              var Oe = de(window.navigator.userAgent) || "";
              ve.headers["x-ele-ua"] += " TBVersion/".concat(Oe);
            }
            return ve;
          }]
        },
        22816: {
          exlogApiName: "tpp_search_found",
          headers: {
            "x-ele-scene": "search_middle_page"
          },
          ext_headers: {
            "x-ele-scene": "search_middle_page"
          }
        },
        28820: {
          exlogApiName: "tpp_suggest",
          headers: {
            "x-ele-scene": "search_suggest"
          },
          ext_headers: {
            "x-ele-scene": "search_suggest"
          }
        },
        36888: {
          headers: {
            "x-ele-scene": "search_vane"
          }
        },
        24732: {
          api: "mtop.relationrecommend.WirelessRecommend.recommend"
        }
      };
    function de(ve) {
      var Oe = ve && ve.match(/TB\/([\d.]+)/);
      return Oe ? Oe[1] : null;
    }
  },
  PxK8: function (Ze, Re, n) {
    n.d(Re, {
      J: function () {
        return E;
      }
    });
    var G = n("byvu"),
      J = n("6EqU"),
      k = n.n(J),
      i = n("2RJ+"),
      me = n("FtFw"),
      ue = n("y6Kz"),
      le = n("bNyJ");
    function Se() {
      var w,
        p,
        C = typeof Symbol == "function" ? Symbol : {},
        L = C.iterator || "@@iterator",
        H = C.toStringTag || "@@toStringTag";
      function M(De, xe, qe, tr) {
        var Ge = xe && xe.prototype instanceof Y ? xe : Y,
          $ = Object.create(Ge.prototype);
        fe($, "_invoke", function (f, o, v) {
          var S,
            b,
            _,
            I = 0,
            T = v || [],
            s = !1,
            r = {
              p: 0,
              n: 0,
              v: w,
              a: u,
              f: u.bind(w, 4),
              d: function (y, B) {
                S = y;
                b = 0;
                _ = w;
                r.n = B;
                return V;
              }
            };
          function u(d, y) {
            b = d;
            _ = y;
            p = 0;
            for (; !s && I && !B && p < T.length; p++) {
              var B,
                z = T[p],
                be = r.p,
                ne = z[2];
              if (d > 3) {
                if (B = ne === y) {
                  _ = z[(b = z[4]) ? 5 : (b = 3, 3)];
                  z[4] = z[5] = w;
                }
              } else {
                if (z[0] <= be) {
                  if (B = d < 2 && be < z[1]) {
                    b = 0;
                    r.v = y;
                    r.n = z[1];
                  } else {
                    if (be < ne && (B = d < 3 || z[0] > y || y > ne)) {
                      z[4] = d;
                      z[5] = y;
                      r.n = ne;
                      b = 0;
                    }
                  }
                }
              }
            }
            if (B || d > 1) return V;
            throw s = !0, y;
          }
          return function (d, y, B) {
            if (I > 1) throw TypeError("Generator is already running");
            if (s && y === 1) {
              u(y, B);
            }
            b = y;
            _ = B;
            for (; (p = b < 2 ? w : _) || !s;) {
              if (!S) {
                if (b) {
                  if (b < 3) {
                    if (b > 1) {
                      r.n = -1;
                    }
                    u(b, _);
                  } else {
                    r.n = _;
                  }
                } else {
                  r.v = _;
                }
              }
              try {
                I = 2;
                if (S) {
                  if (!b) {
                    d = "next";
                  }
                  if (p = S[d]) {
                    if (!(p = p.call(S, _))) throw TypeError("iterator result is not an object");
                    if (!p.done) return p;
                    _ = p.value;
                    if (b < 2) {
                      b = 0;
                    }
                  } else {
                    if (b === 1 && (p = S.return)) {
                      p.call(S);
                    }
                    if (b < 2) {
                      _ = TypeError("The iterator does not provide a '" + d + "' method");
                      b = 1;
                    }
                  }
                  S = w;
                } else if ((p = (s = r.n < 0) ? _ : f.call(o, r)) !== V) break;
              } catch (z) {
                S = w;
                b = 1;
                _ = z;
              } finally {
                I = 1;
              }
            }
            return {
              value: p,
              done: s
            };
          };
        }(De, qe, tr), !0);
        return $;
      }
      var V = {};
      function Y() {}
      function oe() {}
      function N() {}
      p = Object.getPrototypeOf;
      var se = [][L] ? p(p([][L]())) : (fe(p = {}, L, function () {
          return this;
        }), p),
        x = N.prototype = Y.prototype = Object.create(se);
      function Ae(De) {
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(De, N);
        } else {
          De.__proto__ = N;
          fe(De, H, "GeneratorFunction");
        }
        De.prototype = Object.create(x);
        return De;
      }
      oe.prototype = N;
      fe(x, "constructor", N);
      fe(N, "constructor", oe);
      oe.displayName = "GeneratorFunction";
      fe(N, H, "GeneratorFunction");
      fe(x);
      fe(x, H, "Generator");
      fe(x, L, function () {
        return this;
      });
      fe(x, "toString", function () {
        return "[object Generator]";
      });
      return (Se = function () {
        return {
          w: M,
          m: Ae
        };
      })();
    }
    function fe(w, p, C, L) {
      var H = Object.defineProperty;
      try {
        H({}, "", {});
      } catch (M) {
        H = 0;
      }
      fe = function (V, Y, oe, N) {
        function se(x, Ae) {
          fe(V, x, function (De) {
            return this._invoke(x, Ae, De);
          });
        }
        if (Y) {
          if (H) {
            H(V, Y, {
              value: oe,
              enumerable: !N,
              configurable: !N,
              writable: !N
            });
          } else {
            V[Y] = oe;
          }
        } else {
          se("next", 0);
          se("throw", 1);
          se("return", 2);
        }
      };
      fe(w, p, C, L);
    }
    var Ie = Object.defineProperty,
      pe = Object.defineProperties,
      je = Object.getOwnPropertyDescriptors,
      c = Object.getOwnPropertySymbols,
      U = Object.prototype.hasOwnProperty,
      de = Object.prototype.propertyIsEnumerable,
      ve = function (p, C, L) {
        return C in p ? Ie(p, C, {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: L
        }) : p[C] = L;
      },
      Oe = function (p, C) {
        for (var L in C || (C = {})) {
          if (U.call(C, L)) {
            ve(p, L, C[L]);
          }
        }
        if (c) {
          var H = (0, G.Z)(c(C)),
            M;
          try {
            for (H.s(); !(M = H.n()).done;) {
              var L = M.value;
              if (de.call(C, L)) {
                ve(p, L, C[L]);
              }
            }
          } catch (V) {
            H.e(V);
          } finally {
            H.f();
          }
        }
        return p;
      },
      Te = function (p, C) {
        return pe(p, je(C));
      },
      $e = function (p, C, L) {
        return new Promise(function (H, M) {
          var V = function (se) {
              try {
                oe(L.next(se));
              } catch (x) {
                M(x);
              }
            },
            Y = function (se) {
              try {
                oe(L.throw(se));
              } catch (x) {
                M(x);
              }
            },
            oe = function (se) {
              return se.done ? H(se.value) : Promise.resolve(se.value).then(V, Y);
            };
          oe((L = L.apply(p, C)).next());
        });
      },
      Ye = "__ele_search_h5_prefetch_id__",
      Ce = 5e3,
      K = function (p, C) {
        var L = Oe({
          v: "1.0",
          needWua: !0,
          isNeedWua: !0,
          needEcodeSign: !0,
          secType: 1,
          method: "POST"
        }, p);
        L = Te(Oe({}, L), {
          data: {
            type: "originaljson",
            appId: p.appId,
            params: JSON.stringify(Oe({
              _input_charset: "UTF-8",
              _output_charset: "UTF-8",
              gatewayApiType: "mtop",
              mtop_api_version: "1.0"
            }, C))
          }
        });
        return L;
      },
      O = function (p, C) {
        return $e(void 0, null, Se().m(function L() {
          return Se().w(function (H) {
            for (;;) switch (H.n) {
              case 0:
                H.n = 1;
                return i.Z.request(p, C);
              case 1:
                return H.a(2, H.v);
            }
          }, L);
        }));
      },
      P = function (p, C) {
        return $e(void 0, null, Se().m(function L() {
          var H, M, V, Y, oe, N, se, x, Ae, De, xe, qe, tr;
          return Se().w(function (Ge) {
            for (;;) switch (Ge.p = Ge.n) {
              case 0:
                Ge.p = 0;
                console.log("esRequest esPrefetchRequest config=".concat(JSON.stringify(p), ", reqParam=").concat(JSON.stringify(C)));
                N = JSON.parse((H = localStorage.getItem(Ye)) != null ? H : "{}");
                se = new Date().getTime();
                console.log("esRequest esPrefetchRequest checkData id=".concat((M = N == null ? void 0 : N.id) != null ? M : "id-null", " time=").concat((V = N == null ? void 0 : N.time) != null ? V : "time-null", " appId=").concat((Y = N == null ? void 0 : N.appId) != null ? Y : "appId-null", " condition=").concat((N == null ? void 0 : N.id) !== void 0 && (N == null ? void 0 : N.time) !== void 0 && (N == null ? void 0 : N.appId) !== void 0));
                if (!((N == null ? void 0 : N.id) !== void 0 && (N == null ? void 0 : N.time) !== void 0 && (N == null ? void 0 : N.appId) !== void 0)) {
                  Ge.n = 2;
                  break;
                }
                x = (N == null ? void 0 : N.appId) === (p == null ? void 0 : p.appId);
                Ae = se - (N == null ? void 0 : N.time);
                console.log("esRequest esPrefetchRequest checkInterval intervalTime=".concat(Ae, " config?.appId=").concat(p == null ? void 0 : p.appId, " sameAppId=").concat(x, " condition=").concat(Ae < Ce));
                if (!x) {
                  Ge.n = 2;
                  break;
                }
                localStorage.removeItem(Ye);
                if (!(Ae < Ce)) {
                  Ge.n = 2;
                  break;
                }
                De = K(p, C);
                Ge.n = 1;
                return k()().utils.searchMtopRequest(Te(Oe({}, De), {
                  prefetchId: N == null ? void 0 : N.id
                }), {
                  isStore: !0
                });
              case 1:
                xe = Ge.v;
                console.log("esRequest esPrefetchRequest use searchMtopRequest complete, isPrefetch=".concat((oe = xe == null ? void 0 : xe.statInfo) == null ? void 0 : oe.isPrefetch, ", prefetchParams=").concat(JSON.stringify(De)));
                return Ge.a(2, xe);
              case 2:
                Ge.n = 4;
                break;
              case 3:
                Ge.p = 3;
                tr = Ge.v;
                console.error(tr, "esPrefetchRequest error");
              case 4:
                Ge.n = 5;
                return O(p, C);
              case 5:
                qe = Ge.v;
                console.log("esRequest esPrefetchRequest use esBridgeRequest complete");
                return Ge.a(2, qe);
            }
          }, L, null, [[0, 3]]);
        }));
      },
      E = function (p, C) {
        return $e(void 0, null, Se().m(function L() {
          var H, M, V, Y, oe, N, se, x;
          return Se().w(function (Ae) {
            for (;;) switch (Ae.p = Ae.n) {
              case 0:
                H = new Date().getTime();
                console.log("request " + H);
                M = ue.dV[p];
                Ae.p = 1;
                k()().exlog.performance("2021001193603467_mtop_".concat(M.exlogApiName), "", "start", "rpc");
                V = (0, le.at)();
                Y = {};
                oe = Oe({
                  api: ue.xv,
                  topic: C["x-ele-scene"],
                  SV: ue.SV,
                  appId: p,
                  ignoreSessionExpired: !0
                }, M);
                N = Oe({
                  appId: p
                }, C);
                if (!V) {
                  Ae.n = 3;
                  break;
                }
                Ae.n = 2;
                return P(oe, N);
              case 2:
                Y = Ae.v;
                Ae.n = 5;
                break;
              case 3:
                Ae.n = 4;
                return O(oe, N);
              case 4:
                Y = Ae.v;
              case 5:
                k()().exlog.performance("2021001193603467_mtop_".concat(M.exlogApiName), "", "end", "rpc");
                k()().exlog.rate("2021001193603467_mtop_".concat(M.exlogApiName), "", "", {
                  _ext: "1"
                });
                se = new Date().getTime();
                console.log("esRequest response " + se + " duration=" + (se - H));
                return Ae.a(2, Y);
              case 6:
                Ae.p = 6;
                x = Ae.v;
                console.error(x, "mtop err");
                k()().exlog.rpcerror("2021001193603467_mtop_".concat(M.exlogApiName), x.message || x, {
                  name: me.pluginName,
                  version: me.version,
                  request: C,
                  response: x
                });
                k()().exlog.rate("2021001193603467_mtop_".concat(M.exlogApiName), x.message || x, {
                  name: me.pluginName,
                  version: me.version,
                  request: C,
                  response: x
                }, {
                  _ext: "0"
                });
                return Ae.a(2, Promise.reject(x));
            }
          }, L, null, [[1, 6]]);
        }));
      };
  },
  eDMh: function (Ze, Re, n) {
    n.r(Re);
    n.d(Re, {
      appOnConstruct: function () {
        return lr;
      },
      appOnLaunch: function () {
        return Er;
      }
    });
    var G = n("byvu"),
      J = n("GhP9"),
      k = n("6EqU"),
      i = n.n(k),
      me = n("f83b"),
      ue = n.n(me),
      le = n("0uKv"),
      Se = n.n(le),
      fe = JSON.parse('{"publicPages":{"pages/search/search":"pages/search/search","pages/search-result/search-result":"pages/search-result/search-result"},"pages":["pages/search/search","pages/search-result/search-result"],"main":"index","subpackage":{"packagejsonPath":"./package.wx.json","root":"ele-search","pages":["pages/search/search","pages/search-result/search-result"]},"router":{"mode":"browser","baseName":"/minisearch","customRoutes":{"/pages/search/search":"/","/pages/search-result/search-result":"/result"}}}'),
      Ie = n("FtFw"),
      pe = n("g3bB"),
      je = n("2RJ+"),
      c = n("k6Di"),
      U = n("79Ja"),
      de = n("5peE"),
      ve = {
        name: "aife",
        id: 0x72e1777b76c10
      },
      Oe = function (g, m) {
        if (i()().answer) {
          i()().answer.logTiming({
            id: "\u52A8\u6001\u63D2\u4EF6\u52A0\u8F7D\u6210\u529F\u7387",
            value: g ? 1 : 0,
            tags: {
              pluginId: m,
              scene: "homepage"
            },
            level: g ? "info" : "error"
          });
        }
      },
      Te = function (g) {
        var m = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 3,
          A = Date.now();
        return new Promise(function (W, te) {
          if (!m) return Oe(!1, g), te(new Error("".concat(g, " \u52A0\u8F7D\u5931\u8D25")));
          m--;
          my.loadPlugin({
            plugin: "".concat(g, "@*"),
            success: function () {
              if (i()().answer) {
                i()().answer.logTrace({
                  metric_name: "\u52A8\u6001\u63D2\u4EF6\u52A0\u8F7D\u8017\u65F6",
                  fields: {
                    time: Date.now() - A
                  },
                  tags: {
                    pluginId: g,
                    scene: "homepage"
                  }
                });
              }
              Oe(!0, g);
              W(requirePlugin("dynamic-plugin://".concat(g)));
            },
            fail: function (R) {
              var ce = R.error,
                ee = R.errorMessage;
              if (i()().answer) {
                i()().answer.logCount({
                  id: "\u63D2\u4EF6\u52A0\u8F7D\u5931\u8D25",
                  extra: R,
                  tags: {
                    error: ce,
                    errorMessage: ee,
                    pluginId: g,
                    repeatCount: m
                  }
                });
              }
              Te(g, m);
            }
          });
        });
      },
      $e = Te,
      Ye = n("w753");
    function Ce() {
      var F,
        g,
        m = typeof Symbol == "function" ? Symbol : {},
        A = m.iterator || "@@iterator",
        W = m.toStringTag || "@@toStringTag";
      function te(Ue, yr, ir, Rr) {
        var Sr = yr && yr.prototype instanceof R ? yr : R,
          dr = Object.create(Sr.prototype);
        K(dr, "_invoke", function (Tr, pr, Lr) {
          var Xe,
            ye,
            Be,
            fr = 0,
            Ar = Lr || [],
            ur = !1,
            Qe = {
              p: 0,
              n: 0,
              v: F,
              a: mr,
              f: mr.bind(F, 4),
              d: function (ke, er) {
                Xe = ke;
                ye = 0;
                Be = F;
                Qe.n = er;
                return Ee;
              }
            };
          function mr(ze, ke) {
            ye = ze;
            Be = ke;
            g = 0;
            for (; !ur && fr && !er && g < Ar.length; g++) {
              var er,
                Ke = Ar[g],
                Ir = Qe.p,
                Or = Ke[2];
              if (ze > 3) {
                if (er = Or === ke) {
                  Be = Ke[(ye = Ke[4]) ? 5 : (ye = 3, 3)];
                  Ke[4] = Ke[5] = F;
                }
              } else {
                if (Ke[0] <= Ir) {
                  if (er = ze < 2 && Ir < Ke[1]) {
                    ye = 0;
                    Qe.v = ke;
                    Qe.n = Ke[1];
                  } else {
                    if (Ir < Or && (er = ze < 3 || Ke[0] > ke || ke > Or)) {
                      Ke[4] = ze;
                      Ke[5] = ke;
                      Qe.n = Or;
                      ye = 0;
                    }
                  }
                }
              }
            }
            if (er || ze > 1) return Ee;
            throw ur = !0, ke;
          }
          return function (ze, ke, er) {
            if (fr > 1) throw TypeError("Generator is already running");
            if (ur && ke === 1) {
              mr(ke, er);
            }
            ye = ke;
            Be = er;
            for (; (g = ye < 2 ? F : Be) || !ur;) {
              if (!Xe) {
                if (ye) {
                  if (ye < 3) {
                    if (ye > 1) {
                      Qe.n = -1;
                    }
                    mr(ye, Be);
                  } else {
                    Qe.n = Be;
                  }
                } else {
                  Qe.v = Be;
                }
              }
              try {
                fr = 2;
                if (Xe) {
                  if (!ye) {
                    ze = "next";
                  }
                  if (g = Xe[ze]) {
                    if (!(g = g.call(Xe, Be))) throw TypeError("iterator result is not an object");
                    if (!g.done) return g;
                    Be = g.value;
                    if (ye < 2) {
                      ye = 0;
                    }
                  } else {
                    if (ye === 1 && (g = Xe.return)) {
                      g.call(Xe);
                    }
                    if (ye < 2) {
                      Be = TypeError("The iterator does not provide a '" + ze + "' method");
                      ye = 1;
                    }
                  }
                  Xe = F;
                } else if ((g = (ur = Qe.n < 0) ? Be : Tr.call(pr, Qe)) !== Ee) break;
              } catch (Ke) {
                Xe = F;
                ye = 1;
                Be = Ke;
              } finally {
                fr = 1;
              }
            }
            return {
              value: g,
              done: ur
            };
          };
        }(Ue, ir, Rr), !0);
        return dr;
      }
      var Ee = {};
      function R() {}
      function ce() {}
      function ee() {}
      g = Object.getPrototypeOf;
      var Q = [][A] ? g(g([][A]())) : (K(g = {}, A, function () {
          return this;
        }), g),
        ae = ee.prototype = R.prototype = Object.create(Q);
      function Je(Ue) {
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(Ue, ee);
        } else {
          Ue.__proto__ = ee;
          K(Ue, W, "GeneratorFunction");
        }
        Ue.prototype = Object.create(ae);
        return Ue;
      }
      ce.prototype = ee;
      K(ae, "constructor", ee);
      K(ee, "constructor", ce);
      ce.displayName = "GeneratorFunction";
      K(ee, W, "GeneratorFunction");
      K(ae);
      K(ae, W, "Generator");
      K(ae, A, function () {
        return this;
      });
      K(ae, "toString", function () {
        return "[object Generator]";
      });
      return (Ce = function () {
        return {
          w: te,
          m: Je
        };
      })();
    }
    function K(F, g, m, A) {
      var W = Object.defineProperty;
      try {
        W({}, "", {});
      } catch (te) {
        W = 0;
      }
      K = function (Ee, R, ce, ee) {
        function Q(ae, Je) {
          K(Ee, ae, function (Ue) {
            return this._invoke(ae, Je, Ue);
          });
        }
        if (R) {
          if (W) {
            W(Ee, R, {
              value: ce,
              enumerable: !ee,
              configurable: !ee,
              writable: !ee
            });
          } else {
            Ee[R] = ce;
          }
        } else {
          Q("next", 0);
          Q("throw", 1);
          Q("return", 2);
        }
      };
      K(F, g, m, A);
    }
    var O = Object.defineProperty,
      P = Object.defineProperties,
      E = Object.getOwnPropertyDescriptors,
      w = Object.getOwnPropertySymbols,
      p = Object.prototype.hasOwnProperty,
      C = Object.prototype.propertyIsEnumerable,
      L = function (g, m, A) {
        return m in g ? O(g, m, {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: A
        }) : g[m] = A;
      },
      H = function (g, m) {
        for (var A in m || (m = {})) {
          if (p.call(m, A)) {
            L(g, A, m[A]);
          }
        }
        if (w) {
          var W = (0, G.Z)(w(m)),
            te;
          try {
            for (W.s(); !(te = W.n()).done;) {
              var A = te.value;
              if (C.call(m, A)) {
                L(g, A, m[A]);
              }
            }
          } catch (Ee) {
            W.e(Ee);
          } finally {
            W.f();
          }
        }
        return g;
      },
      M = function (g, m) {
        return P(g, E(m));
      },
      V = function (g, m, A) {
        return new Promise(function (W, te) {
          var Ee = function (Q) {
              try {
                ce(A.next(Q));
              } catch (ae) {
                te(ae);
              }
            },
            R = function (Q) {
              try {
                ce(A.throw(Q));
              } catch (ae) {
                te(ae);
              }
            },
            ce = function (Q) {
              return Q.done ? W(Q.value) : Promise.resolve(Q.value).then(Ee, R);
            };
          ce((A = A.apply(g, m)).next());
        });
      },
      Y = Ye.Z.getInstance(),
      oe = ve.name,
      N = ve.id;
    function se(F) {
      var g = F.spm || (F.properties || {}).spm || (F.properties || {}).alsc_spmid || ((F.properties || {}).extParam || {}).alsc_spmid;
      return g;
    }
    function x(F) {
      var g = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {},
        m = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      console.log("[][][]upload", F, g.state, g.data);
      if (i()().answer) {
        i()().answer.logCount({
          id: "aife_search_".concat(F),
          tags: g,
          extra: m
        });
      }
    }
    var Ae = 0,
      De = function () {
        function F() {
          (0, c.Z)(this, F);
          this.items = [];
        }
        return (0, U.Z)(F, [{
          key: "push",
          value: function (m) {
            this.items.push(m);
          }
        }, {
          key: "isEmpty",
          value: function () {
            return this.items.length === 0;
          }
        }, {
          key: "forEachAndDelete",
          value: function (m) {
            for (var A = this.items.length - 1; A >= 0; A--) {
              var W = this.items[A];
              m(W);
              this.items.splice(A, 1);
            }
          }
        }]);
      }();
    function xe() {
      var F = this,
        g = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : !1;
      if (!i()().aife) {
        i()().aife = {
          ssp: {
            getFeature: function () {
              return V(F, null, Ce().m(function Ee() {
                return Ce().w(function (R) {
                  for (;;) switch (R.n) {
                    case 0:
                      return R.a(2, {
                        result: []
                      });
                  }
                }, Ee);
              }));
            }
          },
          pageManager: {
            getSecondToLastPage: function () {
              return {};
            },
            pushPage: function () {
              return {};
            }
          }
        };
      }
      if (!!i()().utils.platform.IS_ALIPAY_ENV) {
        var m = function (Ee) {
            if (Ae === 1) {
              W.push(Ee);
            }
            i()().utils.getEventEmitter().emit("events:aife:dispatch:search", {
              detail: {
                event: Ee
              }
            });
          },
          A = new de.mf("observerName", m, m, m);
        de.ZP.observe(A);
        Ae = 1;
        var W = new De();
        $e(N).then(function (te) {
          return V(F, null, Ce().m(function Ee() {
            var R = this,
              ce;
            return Ce().w(function (ee) {
              for (;;) switch (ee.n) {
                case 0:
                  if (!(!g || !te)) {
                    ee.n = 1;
                    break;
                  }
                  return ee.a(2);
                case 1:
                  if (i()().loadAife) {
                    ee.n = 2;
                    break;
                  }
                  return ee.a(2);
                case 2:
                  ee.n = 3;
                  return i()().loadAife();
                case 3:
                  ce = ee.v;
                  if (ce.update$ele) {
                    ee.n = 4;
                    break;
                  }
                  return ee.a(2);
                case 4:
                  i()().aife = ce;
                  ce.update$ele({
                    $ele: i(),
                    getCurrentPages
                  });
                  ce.addConfig({
                    search_result_no_order: {
                      buildParams: function () {
                        return {
                          bizInfos: JSON.stringify({}),
                          needReverseGeoAddress: 0
                        };
                      },
                      dealError: function () {},
                      adapter: function (ae) {
                        if (ae.data && ae.code === "200" && ae.isSuccess) {
                          ae.data.responseData = te.adaptors.chihuoTaskCardAdaptor(ae.data.responseData);
                          i()().utils.getEventEmitter().emit("events:aife", {
                            detail: {
                              pluginName: oe,
                              pluginId: N,
                              content: ae.data,
                              sceneCode: "search_result_no_order"
                            }
                          });
                        }
                      }
                    },
                    miniapp_foot_print_search: {
                      buildParams: function () {
                        return V(R, null, Ce().m(function ae() {
                          var Je, Ue, yr, ir, Rr, Sr, dr, Tr;
                          return Ce().w(function (pr) {
                            for (;;) switch (pr.p = pr.n) {
                              case 0:
                                Je = "footPrint";
                                Ue = {
                                  result: []
                                };
                                pr.p = 1;
                                pr.n = 2;
                                return i()().aife.ssp.getFeature("shop_browse_wind_list");
                              case 2:
                                Ue = pr.v;
                                pr.n = 4;
                                break;
                              case 3:
                                pr.p = 3;
                                Tr = pr.v;
                              case 4:
                                x(Je, {
                                  state: "sspFeature",
                                  data: Ue
                                }, {});
                                yr = function (Xe) {
                                  if (!Xe || !Xe.length) return [];
                                  var ye = new Set(),
                                    Be = [],
                                    fr = (0, G.Z)(Xe),
                                    Ar;
                                  try {
                                    for (fr.s(); !(Ar = fr.n()).done;) {
                                      var ur = Ar.value;
                                      if (!ye.has(ur.longRestaurantId)) {
                                        ye.add(ur.longRestaurantId);
                                        Be.unshift({
                                          shopid: ur.longRestaurantId
                                        });
                                      }
                                    }
                                  } catch (Qe) {
                                    fr.e(Qe);
                                  } finally {
                                    fr.f();
                                  }
                                  ye.clear();
                                  return Be;
                                };
                                ir = yr(Ue.result);
                                console.log("[log]\u5904\u7406-before", Ue.result);
                                console.log("[log]\u5904\u7406-after", ir);
                                Rr = {
                                  detail: {
                                    pluginName: oe,
                                    pluginId: N,
                                    content: {
                                      restaurantList: ir,
                                      pageType: "FOOTPRINT",
                                      sourceScene: "SEARCH",
                                      lastShop: ir[ir.length - 1].shopid
                                    },
                                    sceneCode: "ELEME_SUPERNATANT_PAGE"
                                  }
                                };
                                Sr = Y.query$.getValue().value || {};
                                console.log("[log]query", Sr);
                                console.log("[log]\u4E4B\u524D\u7684shop", i()().windFootPrint);
                                console.log("[log]\u73B0\u5728\u7684shop", ir);
                                dr = "0";
                                if (ir.length > 1) {
                                  if (!i()().windFootPrint && Sr.refreshFootPrint) {
                                    dr = "1";
                                    i()().windFootPrint = ir;
                                  } else {
                                    if (!i()().windFootPrint) {
                                      i()().windFootPrint = ir;
                                    }
                                    if (i()().windFootPrint[0].shopid !== ir[0].shopid) {
                                      dr = "1";
                                    } else {
                                      dr = "0";
                                    }
                                  }
                                }
                                i()().windFootPrint = ir;
                                x(Je, {
                                  state: "emit_".concat(dr),
                                  data: {
                                    query: Sr,
                                    features: Ue,
                                    restaurantList: ir
                                  }
                                }, {});
                                if (dr === "1") {
                                  i()().utils.getEventEmitter().emit("events:aife", Rr);
                                }
                                return pr.a(2, ir);
                            }
                          }, ae, null, [[1, 3]]);
                        }));
                      },
                      adapter: function () {}
                    },
                    out_of_store_voucher_occasion: {
                      adapter: function (ae) {
                        if (!(!ae || !ae.data)) {
                          var Je = ae.data.responseData;
                          if (Je && Je.rights) {
                            i()().utils.getEventEmitter().emit("events:aife", {
                              detail: {
                                pluginName: oe,
                                pluginId: N,
                                content: M(H({
                                  couponCount: Je.couponCount,
                                  title: Je.richTextTitle || Je.title
                                }, Je.rights[0]), {
                                  userTrackInfo: Je.userTrackInfo
                                }),
                                sceneCode: "out_of_store_voucher_occasion"
                              }
                            });
                          }
                        }
                      }
                    }
                  });
                  if (!W.isEmpty()) {
                    W.forEachAndDelete(function (Q) {
                      Q.properties.spm = se(Q);
                      ce._runCEP.bind(ce)(Q);
                    });
                  }
                  Ae = 2;
                  i()().utils.getEventEmitter().on("events:aife:dispatch:search", function (Q) {
                    if (!(!Q || !Q.detail)) {
                      Q.detail.event.properties.spm = se(Q.detail.event);
                      ce._runCEP.bind(ce)(Q.detail.event);
                    }
                  });
                case 5:
                  return ee.a(2);
              }
            }, Ee);
          }));
        });
      }
    }
    var qe = Object.defineProperty,
      tr = Object.defineProperties,
      Ge = Object.getOwnPropertyDescriptors,
      $ = Object.getOwnPropertySymbols,
      f = Object.prototype.hasOwnProperty,
      o = Object.prototype.propertyIsEnumerable,
      v = function (g, m, A) {
        return m in g ? qe(g, m, {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: A
        }) : g[m] = A;
      },
      S = function (g, m) {
        for (var A in m || (m = {})) {
          if (f.call(m, A)) {
            v(g, A, m[A]);
          }
        }
        if ($) {
          var W = (0, G.Z)($(m)),
            te;
          try {
            for (W.s(); !(te = W.n()).done;) {
              var A = te.value;
              if (o.call(m, A)) {
                v(g, A, m[A]);
              }
            }
          } catch (Ee) {
            W.e(Ee);
          } finally {
            W.f();
          }
        }
        return g;
      },
      b = function (g, m) {
        return tr(g, Ge(m));
      },
      _ = function (F) {
        return function (g) {
          var m = g.getApp();
          i()().hostArsenal = m;
          i()().loadAife = m.loadAife;
          i()().appInfo = b(S({}, i()().appInfo), {
            systemInfo: i()().systemInfo
          });
          i()().env = i()().appInfo && i()().appInfo.env;
          i()().query = m.query || i()().query;
          i()().from = m.from || i()().from;
          i()().fromLocation = m.fromLocation || i()().fromLocation;
          i()().sub_channel = m.sub_channel || i()().sub_channel;
          i()().scene = m.scene || i()().scene;
          i()().havana = m.havana || i()().havana;
          i()().aLocation = m.aLocation || {};
          i()().navigate = m.navigate;
          if (i()().hostArsenal.answer && i()().hostArsenal.answer.setOptions) {
            i()().answer = i()().hostArsenal.answer;
            try {
              i()().answer.logTiming({
                id: "\u4F7F\u7528\u5BBF\u4E3Banswer",
                value: 1,
                tags: {
                  pluginId: 0x72e17023c418b
                }
              });
            } catch (W) {}
          } else {
            i()().answer = (0, pe.Z)(i());
            try {
              i()().answer.logTiming({
                id: "\u4F7F\u7528\u5BBF\u4E3Banswer",
                value: 0,
                tags: {
                  pluginId: 0x72e17023c418b
                }
              });
            } catch (W) {}
          }
          i()().$searchParams = {};
          i()().miniPerformance = m.miniPerformance || i()().miniPerformance;
          i()().ESBridge = je.Z;
          var A = g.getApp().aplus.config;
          J.aplus.init(b(S({}, A), {
            version: F.version
          }));
          i()().aplus = J.aplus;
          xe(!0);
        };
      },
      I = Object.defineProperty,
      T = Object.getOwnPropertySymbols,
      s = Object.prototype.hasOwnProperty,
      r = Object.prototype.propertyIsEnumerable,
      u = function (g, m, A) {
        return m in g ? I(g, m, {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: A
        }) : g[m] = A;
      },
      d = function (g, m) {
        for (var A in m || (m = {})) {
          if (s.call(m, A)) {
            u(g, A, m[A]);
          }
        }
        if (T) {
          var W = (0, G.Z)(T(m)),
            te;
          try {
            for (W.s(); !(te = W.n()).done;) {
              var A = te.value;
              if (r.call(m, A)) {
                u(g, A, m[A]);
              }
            }
          } catch (Ee) {
            W.e(Ee);
          } finally {
            W.f();
          }
        }
        return g;
      },
      y = d(d({}, fe), Ie),
      B = {
        pageConfig: {
          Page_Search: {
            title: "Page_Search",
            spmb: 12273696,
            path: "pages/search/search"
          },
          Page_SearchResult: {
            title: "Page_SearchResult",
            spmb: 13154471,
            path: "pages/search-result/search-result"
          }
        }
      },
      z = [_(y)],
      be = n("bNyJ"),
      ne = n("+2i/"),
      ie = n.n(ne),
      Le = {
        click_config: {
          "a2f6g.13154471.searchFoodList.dx429365": {
            paramlist: {
              rank_id: "rankid",
              restaurant_id: "shopid",
              entity_type: "entity_type",
              entity_subtype: "entity_subtype"
            }
          },
          "a2f6g.13154471.searchFoodList.": {
            paramlist: {
              rank_id: "rankid",
              restaurant_id: "shopid",
              entity_type: "entity_type",
              entity_subtype: "entity_subtype",
              item_id: "itemid",
              eleme_item_id: "eleme_item_id"
            }
          },
          "a2f6g.13154471.SearchFooditem.": {
            paramlist: {
              rank_id: "rankid",
              restaurant_id: "shopid",
              entity_type: "entity_type",
              entity_subtype: "entity_subtype",
              item_id: "itemid",
              eleme_item_id: "eleme_item_id"
            }
          },
          "a2f6g.12273696.SuggestRestaurant.": {
            paramlist: {
              rank_id: "rankid",
              restaurant_id: "shopid",
              entity_type: "entity_type",
              entity_subtype: "entity_subtype"
            }
          },
          "a2f6g.13154471.SearchStapleFooditem.": {
            paramlist: {
              rank_id: "rankid",
              restaurant_id: "shopid",
              entity_type: "entity_type",
              entity_subtype: "entity_subtype"
            }
          }
        }
      },
      we = Le;
    function Ne() {
      var F,
        g,
        m = typeof Symbol == "function" ? Symbol : {},
        A = m.iterator || "@@iterator",
        W = m.toStringTag || "@@toStringTag";
      function te(Ue, yr, ir, Rr) {
        var Sr = yr && yr.prototype instanceof R ? yr : R,
          dr = Object.create(Sr.prototype);
        re(dr, "_invoke", function (Tr, pr, Lr) {
          var Xe,
            ye,
            Be,
            fr = 0,
            Ar = Lr || [],
            ur = !1,
            Qe = {
              p: 0,
              n: 0,
              v: F,
              a: mr,
              f: mr.bind(F, 4),
              d: function (ke, er) {
                Xe = ke;
                ye = 0;
                Be = F;
                Qe.n = er;
                return Ee;
              }
            };
          function mr(ze, ke) {
            ye = ze;
            Be = ke;
            g = 0;
            for (; !ur && fr && !er && g < Ar.length; g++) {
              var er,
                Ke = Ar[g],
                Ir = Qe.p,
                Or = Ke[2];
              if (ze > 3) {
                if (er = Or === ke) {
                  Be = Ke[(ye = Ke[4]) ? 5 : (ye = 3, 3)];
                  Ke[4] = Ke[5] = F;
                }
              } else {
                if (Ke[0] <= Ir) {
                  if (er = ze < 2 && Ir < Ke[1]) {
                    ye = 0;
                    Qe.v = ke;
                    Qe.n = Ke[1];
                  } else {
                    if (Ir < Or && (er = ze < 3 || Ke[0] > ke || ke > Or)) {
                      Ke[4] = ze;
                      Ke[5] = ke;
                      Qe.n = Or;
                      ye = 0;
                    }
                  }
                }
              }
            }
            if (er || ze > 1) return Ee;
            throw ur = !0, ke;
          }
          return function (ze, ke, er) {
            if (fr > 1) throw TypeError("Generator is already running");
            if (ur && ke === 1) {
              mr(ke, er);
            }
            ye = ke;
            Be = er;
            for (; (g = ye < 2 ? F : Be) || !ur;) {
              if (!Xe) {
                if (ye) {
                  if (ye < 3) {
                    if (ye > 1) {
                      Qe.n = -1;
                    }
                    mr(ye, Be);
                  } else {
                    Qe.n = Be;
                  }
                } else {
                  Qe.v = Be;
                }
              }
              try {
                fr = 2;
                if (Xe) {
                  if (!ye) {
                    ze = "next";
                  }
                  if (g = Xe[ze]) {
                    if (!(g = g.call(Xe, Be))) throw TypeError("iterator result is not an object");
                    if (!g.done) return g;
                    Be = g.value;
                    if (ye < 2) {
                      ye = 0;
                    }
                  } else {
                    if (ye === 1 && (g = Xe.return)) {
                      g.call(Xe);
                    }
                    if (ye < 2) {
                      Be = TypeError("The iterator does not provide a '" + ze + "' method");
                      ye = 1;
                    }
                  }
                  Xe = F;
                } else if ((g = (ur = Qe.n < 0) ? Be : Tr.call(pr, Qe)) !== Ee) break;
              } catch (Ke) {
                Xe = F;
                ye = 1;
                Be = Ke;
              } finally {
                fr = 1;
              }
            }
            return {
              value: g,
              done: ur
            };
          };
        }(Ue, ir, Rr), !0);
        return dr;
      }
      var Ee = {};
      function R() {}
      function ce() {}
      function ee() {}
      g = Object.getPrototypeOf;
      var Q = [][A] ? g(g([][A]())) : (re(g = {}, A, function () {
          return this;
        }), g),
        ae = ee.prototype = R.prototype = Object.create(Q);
      function Je(Ue) {
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(Ue, ee);
        } else {
          Ue.__proto__ = ee;
          re(Ue, W, "GeneratorFunction");
        }
        Ue.prototype = Object.create(ae);
        return Ue;
      }
      ce.prototype = ee;
      re(ae, "constructor", ee);
      re(ee, "constructor", ce);
      ce.displayName = "GeneratorFunction";
      re(ee, W, "GeneratorFunction");
      re(ae);
      re(ae, W, "Generator");
      re(ae, A, function () {
        return this;
      });
      re(ae, "toString", function () {
        return "[object Generator]";
      });
      return (Ne = function () {
        return {
          w: te,
          m: Je
        };
      })();
    }
    function re(F, g, m, A) {
      var W = Object.defineProperty;
      try {
        W({}, "", {});
      } catch (te) {
        W = 0;
      }
      re = function (Ee, R, ce, ee) {
        function Q(ae, Je) {
          re(Ee, ae, function (Ue) {
            return this._invoke(ae, Je, Ue);
          });
        }
        if (R) {
          if (W) {
            W(Ee, R, {
              value: ce,
              enumerable: !ee,
              configurable: !ee,
              writable: !ee
            });
          } else {
            Ee[R] = ce;
          }
        } else {
          Q("next", 0);
          Q("throw", 1);
          Q("return", 2);
        }
      };
      re(F, g, m, A);
    }
    var X = Object.defineProperty,
      q = Object.defineProperties,
      Ve = Object.getOwnPropertyDescriptors,
      or = Object.getOwnPropertySymbols,
      We = Object.prototype.hasOwnProperty,
      He = Object.prototype.propertyIsEnumerable,
      nr = function (g, m, A) {
        return m in g ? X(g, m, {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: A
        }) : g[m] = A;
      },
      Fe = function (g, m) {
        for (var A in m || (m = {})) {
          if (We.call(m, A)) {
            nr(g, A, m[A]);
          }
        }
        if (or) {
          var W = (0, G.Z)(or(m)),
            te;
          try {
            for (W.s(); !(te = W.n()).done;) {
              var A = te.value;
              if (He.call(m, A)) {
                nr(g, A, m[A]);
              }
            }
          } catch (Ee) {
            W.e(Ee);
          } finally {
            W.f();
          }
        }
        return g;
      },
      Pe = function (g, m) {
        return q(g, Ve(m));
      },
      ge = function (g, m, A) {
        return new Promise(function (W, te) {
          var Ee = function (Q) {
              try {
                ce(A.next(Q));
              } catch (ae) {
                te(ae);
              }
            },
            R = function (Q) {
              try {
                ce(A.throw(Q));
              } catch (ae) {
                te(ae);
              }
            },
            ce = function (Q) {
              return Q.done ? W(Q.value) : Promise.resolve(Q.value).then(Ee, R);
            };
          ce((A = A.apply(g, m)).next());
        });
      };
    window.$ele = i();
    i()().pluginInfo = Fe({}, Ie);
    function he() {
      i()().init({
        LTracker: J.LTracker
      });
      i()().utils.platform.IS_H5_ENV = i()().utils.platform.IS_WEB_ENV;
      i()().utils.searchMtopRequest = ue().create({
        mpHostMap: {
          ppe: {
            mainDomain: "ele.me",
            subDomain: "ppe-waimai-guide",
            prefix: ""
          },
          online: {
            mainDomain: "ele.me",
            subDomain: "waimai-guide",
            prefix: ""
          },
          prod: {
            mainDomain: "ele.me",
            subDomain: "waimai-guide",
            prefix: ""
          },
          default: {
            mainDomain: "ele.me",
            subDomain: "waimai-guide",
            prefix: ""
          },
          beta: {
            mainDomain: "eleme.test",
            subDomain: "ppe-waimai-guide",
            prefix: ""
          },
          daily: {
            mainDomain: "eleme.test",
            subDomain: "acs-waptest.eleme.test",
            prefix: ""
          }
        },
        timeout: 1e4,
        fromToChannel: !0,
        useXEleUaWithUa: !1,
        transformResponse: function (m) {
          return m;
        }
      }, i());
      var F = Pe(Fe({
        spma: "a2f6g"
      }, B), {
        version: y.version
      });
      J.aplus.init(F);
      J.aplus.setBaseInfo({
        is_h5: "1"
      });
      i()().aplus = J.aplus;
    }
    function cr() {
      var F = this,
        g,
        m;
      i()().answer = getApp().$ele().answer;
      i()().authLogin = getApp().$ele().authLogin;
      i()().utils.getLocation = getApp().$ele().utils.getLocation;
      i()().utils.navigate = getApp().$ele().utils.navigate;
      i()().utils.getDeviceId = getApp().$ele().utils.getDeviceId;
      i()().utils.getEventEmitter = function () {
        return getApp().$event;
      };
      i()().utils.platform.isQUARKMini = getApp().$ele().utils.platform.isQUARKMini;
      i()().utils.platform.platformName = getApp().$ele().utils.platform.platformName;
      function A(ce) {
        for (var ee = window.location.search.substring(1), Q = ee.split("&"), ae = 0; ae < Q.length; ae++) {
          var Je = Q[ae].split("=");
          if (ce === Je[0]) return Je[1];
        }
        return "";
      }
      i()().utils.navigate = function () {
        var ce = arguments[0];
        if (Number(A("appid")) === 0x72e17397d9ed5 && i()().utils.platform.IS_ALIPAY_ENV) {
          ce.navType = "postMessage";
        }
        if ((0, be.NR)()) {
          ce.navType = "postMessage";
          ce.ebridgeNavType = 0;
          console.log("[H5] \u624B\u6DD8&\u652F\u4ED8\u5B9D\u5C0F\u7A0B\u5E8F\u73AF\u5883\uFF0Cebridge \u53D1 postMessage \u7ED9\u5C0F\u7A0B\u5E8F\u8DEF\u7531 options.ebridgeNavType = 0");
        }
        return getApp().$ele().utils.navigate(ce);
      };
      i()().utils.goToLocationPage = getApp().$ele().utils.goToLocationPage;
      var W = window.location.origin.indexOf("ppe") >= 0 || getApp().env === "ppe",
        te = W;
      i()().isDebug = te;
      i()().appInfo = Pe(Fe({}, getApp().$ele().appInfo), {
        systemInfo: getApp().$ele().systemInfo,
        env: getApp().env,
        isDebug: te
      });
      i()().exlog = getApp().$ele().exlog;
      i()().exlog.init({
        bizType: "KOUBEI",
        biz: "h5.12273696",
        biz_version: y.version,
        getFrom: function () {
          return ge(F, null, Ne().m(function ee() {
            return Ne().w(function (Q) {
              for (;;) switch (Q.n) {
                case 0:
                  return Q.a(2, getApp().query.h5_from);
              }
            }, ee);
          }));
        },
        getUserId: function () {
          return ge(F, null, Ne().m(function ee() {
            return Ne().w(function (Q) {
              for (;;) switch (Q.n) {
                case 0:
                  return Q.a(2, i()().authLogin.getUserId());
              }
            }, ee);
          }));
        },
        getUTDID: function () {
          return ge(F, null, Ne().m(function ee() {
            var Q;
            return Ne().w(function (ae) {
              for (;;) switch (ae.n) {
                case 0:
                  ae.n = 1;
                  return i()().utils.getDeviceId();
                case 1:
                  Q = ae.v;
                  return ae.a(2, Q);
              }
            }, ee);
          }));
        }
      });
      console.log(Se(), "adLog");
      Se().init();
      i()().appOnLaunch = !0;
      console.log("[debug] ++plugin appOnLaunch $ele() = ", i()());
      var Ee = ((g = i()().appInfo) == null ? void 0 : g.version) || "0.0.0",
        R = ((m = i()().appInfo) == null ? void 0 : m.appId) || "";
      ie().init({
        platform: "h5",
        appId: R,
        version: Ee,
        $ele: i()
      }, we);
    }
    var lr = function (g) {
        console.error("appOnConstruct [debug] ++plugin appOnConstruct", g);
      },
      Er = function (g) {
        console.error("\u8FDB\u5165appOnLaunch[ -------------------------------- ]::-23");
        he(g);
        setTimeout(function () {
          cr(g);
        }, 0);
      };
  },
  w753: function (Ze, Re, n) {
    n.d(Re, {
      Z: function () {
        return Ge;
      }
    });
    var G = n("CgWt"),
      J = n("+BzW"),
      k = n("k6Di"),
      i = n("79Ja"),
      me = n("byvu"),
      ue = n("6EqU"),
      le = n.n(ue),
      Se = n("PxK8"),
      fe = n("y6Kz");
    function Ie() {
      var $,
        f,
        o = typeof Symbol == "function" ? Symbol : {},
        v = o.iterator || "@@iterator",
        S = o.toStringTag || "@@toStringTag";
      function b(y, B, z, be) {
        var ne = B && B.prototype instanceof I ? B : I,
          ie = Object.create(ne.prototype);
        pe(ie, "_invoke", function (Le, we, Ne) {
          var re,
            X,
            q,
            Ve = 0,
            or = Ne || [],
            We = !1,
            He = {
              p: 0,
              n: 0,
              v: $,
              a: nr,
              f: nr.bind($, 4),
              d: function (Pe, ge) {
                re = Pe;
                X = 0;
                q = $;
                He.n = ge;
                return _;
              }
            };
          function nr(Fe, Pe) {
            X = Fe;
            q = Pe;
            f = 0;
            for (; !We && Ve && !ge && f < or.length; f++) {
              var ge,
                he = or[f],
                cr = He.p,
                lr = he[2];
              if (Fe > 3) {
                if (ge = lr === Pe) {
                  q = he[(X = he[4]) ? 5 : (X = 3, 3)];
                  he[4] = he[5] = $;
                }
              } else {
                if (he[0] <= cr) {
                  if (ge = Fe < 2 && cr < he[1]) {
                    X = 0;
                    He.v = Pe;
                    He.n = he[1];
                  } else {
                    if (cr < lr && (ge = Fe < 3 || he[0] > Pe || Pe > lr)) {
                      he[4] = Fe;
                      he[5] = Pe;
                      He.n = lr;
                      X = 0;
                    }
                  }
                }
              }
            }
            if (ge || Fe > 1) return _;
            throw We = !0, Pe;
          }
          return function (Fe, Pe, ge) {
            if (Ve > 1) throw TypeError("Generator is already running");
            if (We && Pe === 1) {
              nr(Pe, ge);
            }
            X = Pe;
            q = ge;
            for (; (f = X < 2 ? $ : q) || !We;) {
              if (!re) {
                if (X) {
                  if (X < 3) {
                    if (X > 1) {
                      He.n = -1;
                    }
                    nr(X, q);
                  } else {
                    He.n = q;
                  }
                } else {
                  He.v = q;
                }
              }
              try {
                Ve = 2;
                if (re) {
                  if (!X) {
                    Fe = "next";
                  }
                  if (f = re[Fe]) {
                    if (!(f = f.call(re, q))) throw TypeError("iterator result is not an object");
                    if (!f.done) return f;
                    q = f.value;
                    if (X < 2) {
                      X = 0;
                    }
                  } else {
                    if (X === 1 && (f = re.return)) {
                      f.call(re);
                    }
                    if (X < 2) {
                      q = TypeError("The iterator does not provide a '" + Fe + "' method");
                      X = 1;
                    }
                  }
                  re = $;
                } else if ((f = (We = He.n < 0) ? q : Le.call(we, He)) !== _) break;
              } catch (he) {
                re = $;
                X = 1;
                q = he;
              } finally {
                Ve = 1;
              }
            }
            return {
              value: f,
              done: We
            };
          };
        }(y, z, be), !0);
        return ie;
      }
      var _ = {};
      function I() {}
      function T() {}
      function s() {}
      f = Object.getPrototypeOf;
      var r = [][v] ? f(f([][v]())) : (pe(f = {}, v, function () {
          return this;
        }), f),
        u = s.prototype = I.prototype = Object.create(r);
      function d(y) {
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(y, s);
        } else {
          y.__proto__ = s;
          pe(y, S, "GeneratorFunction");
        }
        y.prototype = Object.create(u);
        return y;
      }
      T.prototype = s;
      pe(u, "constructor", s);
      pe(s, "constructor", T);
      T.displayName = "GeneratorFunction";
      pe(s, S, "GeneratorFunction");
      pe(u);
      pe(u, S, "Generator");
      pe(u, v, function () {
        return this;
      });
      pe(u, "toString", function () {
        return "[object Generator]";
      });
      return (Ie = function () {
        return {
          w: b,
          m: d
        };
      })();
    }
    function pe($, f, o, v) {
      var S = Object.defineProperty;
      try {
        S({}, "", {});
      } catch (b) {
        S = 0;
      }
      pe = function (_, I, T, s) {
        function r(u, d) {
          pe(_, u, function (y) {
            return this._invoke(u, d, y);
          });
        }
        if (I) {
          if (S) {
            S(_, I, {
              value: T,
              enumerable: !s,
              configurable: !s,
              writable: !s
            });
          } else {
            _[I] = T;
          }
        } else {
          r("next", 0);
          r("throw", 1);
          r("return", 2);
        }
      };
      pe($, f, o, v);
    }
    var je = Object.defineProperty,
      c = Object.defineProperties,
      U = Object.getOwnPropertyDescriptors,
      de = Object.getOwnPropertySymbols,
      ve = Object.prototype.hasOwnProperty,
      Oe = Object.prototype.propertyIsEnumerable,
      Te = function (f, o, v) {
        return o in f ? je(f, o, {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: v
        }) : f[o] = v;
      },
      $e = function (f, o) {
        for (var v in o || (o = {})) {
          if (ve.call(o, v)) {
            Te(f, v, o[v]);
          }
        }
        if (de) {
          var S = (0, me.Z)(de(o)),
            b;
          try {
            for (S.s(); !(b = S.n()).done;) {
              var v = b.value;
              if (Oe.call(o, v)) {
                Te(f, v, o[v]);
              }
            }
          } catch (_) {
            S.e(_);
          } finally {
            S.f();
          }
        }
        return f;
      },
      Ye = function (f, o) {
        return c(f, U(o));
      },
      Ce = function (f, o, v) {
        return new Promise(function (S, b) {
          var _ = function (r) {
              try {
                T(v.next(r));
              } catch (u) {
                b(u);
              }
            },
            I = function (r) {
              try {
                T(v.throw(r));
              } catch (u) {
                b(u);
              }
            },
            T = function (r) {
              return r.done ? S(r.value) : Promise.resolve(r.value).then(_, I);
            };
          T((v = v.apply(f, o)).next());
        });
      },
      K = function ($) {
        return Ce(void 0, null, Ie().m(function f() {
          return Ie().w(function (o) {
            for (;;) switch (o.n) {
              case 0:
                return o.a(2, (0, Se.J)("22816", Ye($e({
                  "x-ele-scene": "search_middle_page",
                  isMtopMiniApp: !0
                }, $), {
                  sversion: fe.It,
                  apiVersion: fe.Gn
                })).then(function (v) {
                  return v && v.data && v.data.result && v.data.result[0] ? v.data.result[0] : v && v.data && v.data.errorInfo ? {
                    errorInfo: v.data.errorInfo
                  } : null;
                }));
            }
          }, f);
        }));
      },
      O = n("Qiv0"),
      P = n("SyfN"),
      E = n("g96g"),
      w = n("Gw60"),
      p = n("lk4z"),
      C = n("hr2I"),
      L = n("bNyJ");
    function H() {
      var $,
        f,
        o = typeof Symbol == "function" ? Symbol : {},
        v = o.iterator || "@@iterator",
        S = o.toStringTag || "@@toStringTag";
      function b(y, B, z, be) {
        var ne = B && B.prototype instanceof I ? B : I,
          ie = Object.create(ne.prototype);
        M(ie, "_invoke", function (Le, we, Ne) {
          var re,
            X,
            q,
            Ve = 0,
            or = Ne || [],
            We = !1,
            He = {
              p: 0,
              n: 0,
              v: $,
              a: nr,
              f: nr.bind($, 4),
              d: function (Pe, ge) {
                re = Pe;
                X = 0;
                q = $;
                He.n = ge;
                return _;
              }
            };
          function nr(Fe, Pe) {
            X = Fe;
            q = Pe;
            f = 0;
            for (; !We && Ve && !ge && f < or.length; f++) {
              var ge,
                he = or[f],
                cr = He.p,
                lr = he[2];
              if (Fe > 3) {
                if (ge = lr === Pe) {
                  q = he[(X = he[4]) ? 5 : (X = 3, 3)];
                  he[4] = he[5] = $;
                }
              } else {
                if (he[0] <= cr) {
                  if (ge = Fe < 2 && cr < he[1]) {
                    X = 0;
                    He.v = Pe;
                    He.n = he[1];
                  } else {
                    if (cr < lr && (ge = Fe < 3 || he[0] > Pe || Pe > lr)) {
                      he[4] = Fe;
                      he[5] = Pe;
                      He.n = lr;
                      X = 0;
                    }
                  }
                }
              }
            }
            if (ge || Fe > 1) return _;
            throw We = !0, Pe;
          }
          return function (Fe, Pe, ge) {
            if (Ve > 1) throw TypeError("Generator is already running");
            if (We && Pe === 1) {
              nr(Pe, ge);
            }
            X = Pe;
            q = ge;
            for (; (f = X < 2 ? $ : q) || !We;) {
              if (!re) {
                if (X) {
                  if (X < 3) {
                    if (X > 1) {
                      He.n = -1;
                    }
                    nr(X, q);
                  } else {
                    He.n = q;
                  }
                } else {
                  He.v = q;
                }
              }
              try {
                Ve = 2;
                if (re) {
                  if (!X) {
                    Fe = "next";
                  }
                  if (f = re[Fe]) {
                    if (!(f = f.call(re, q))) throw TypeError("iterator result is not an object");
                    if (!f.done) return f;
                    q = f.value;
                    if (X < 2) {
                      X = 0;
                    }
                  } else {
                    if (X === 1 && (f = re.return)) {
                      f.call(re);
                    }
                    if (X < 2) {
                      q = TypeError("The iterator does not provide a '" + Fe + "' method");
                      X = 1;
                    }
                  }
                  re = $;
                } else if ((f = (We = He.n < 0) ? q : Le.call(we, He)) !== _) break;
              } catch (he) {
                re = $;
                X = 1;
                q = he;
              } finally {
                Ve = 1;
              }
            }
            return {
              value: f,
              done: We
            };
          };
        }(y, z, be), !0);
        return ie;
      }
      var _ = {};
      function I() {}
      function T() {}
      function s() {}
      f = Object.getPrototypeOf;
      var r = [][v] ? f(f([][v]())) : (M(f = {}, v, function () {
          return this;
        }), f),
        u = s.prototype = I.prototype = Object.create(r);
      function d(y) {
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(y, s);
        } else {
          y.__proto__ = s;
          M(y, S, "GeneratorFunction");
        }
        y.prototype = Object.create(u);
        return y;
      }
      T.prototype = s;
      M(u, "constructor", s);
      M(s, "constructor", T);
      T.displayName = "GeneratorFunction";
      M(s, S, "GeneratorFunction");
      M(u);
      M(u, S, "Generator");
      M(u, v, function () {
        return this;
      });
      M(u, "toString", function () {
        return "[object Generator]";
      });
      return (H = function () {
        return {
          w: b,
          m: d
        };
      })();
    }
    function M($, f, o, v) {
      var S = Object.defineProperty;
      try {
        S({}, "", {});
      } catch (b) {
        S = 0;
      }
      M = function (_, I, T, s) {
        function r(u, d) {
          M(_, u, function (y) {
            return this._invoke(u, d, y);
          });
        }
        if (I) {
          if (S) {
            S(_, I, {
              value: T,
              enumerable: !s,
              configurable: !s,
              writable: !s
            });
          } else {
            _[I] = T;
          }
        } else {
          r("next", 0);
          r("throw", 1);
          r("return", 2);
        }
      };
      M($, f, o, v);
    }
    var V = Object.defineProperty,
      Y = Object.defineProperties,
      oe = Object.getOwnPropertyDescriptors,
      N = Object.getOwnPropertySymbols,
      se = Object.prototype.hasOwnProperty,
      x = Object.prototype.propertyIsEnumerable,
      Ae = function (f, o, v) {
        return o in f ? V(f, o, {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: v
        }) : f[o] = v;
      },
      De = function (f, o) {
        for (var v in o || (o = {})) {
          if (se.call(o, v)) {
            Ae(f, v, o[v]);
          }
        }
        if (N) {
          var S = (0, me.Z)(N(o)),
            b;
          try {
            for (S.s(); !(b = S.n()).done;) {
              var v = b.value;
              if (x.call(o, v)) {
                Ae(f, v, o[v]);
              }
            }
          } catch (_) {
            S.e(_);
          } finally {
            S.f();
          }
        }
        return f;
      },
      xe = function (f, o) {
        return Y(f, oe(o));
      },
      qe = function (f, o, v) {
        return new Promise(function (S, b) {
          var _ = function (r) {
              try {
                T(v.next(r));
              } catch (u) {
                b(u);
              }
            },
            I = function (r) {
              try {
                T(v.throw(r));
              } catch (u) {
                b(u);
              }
            },
            T = function (r) {
              return r.done ? S(r.value) : Promise.resolve(r.value).then(_, I);
            };
          T((v = v.apply(f, o)).next());
        });
      },
      tr = function () {
        function $() {
          (0, k.Z)(this, $);
          this.query$ = new O.x({
            value: {}
          });
          this.search$ = new O.x({
            params: {},
            keyword: "",
            status: p.fF
          });
          this.guess$ = new O.x({
            kw: ""
          });
          this.searchBarAutoFocus$ = new O.x({
            value: !0,
            refer: ""
          });
          this.recommend$ = new O.x({
            historicalList: [],
            medicalHistoricalList: [],
            supermarketHistoricalList: [],
            freshHistoricalList: [],
            flowerHistoricalList: [],
            kitchenHistoricalList: [],
            commonNewRetailHistoricalList: [],
            searchFound: {}
          });
          this.loading$ = new O.x({
            recommendLoading: !1
          });
          this.searchMiddleGlobal$ = new O.x({
            homeTrack: "",
            refreshOption: ""
          });
          this.error$ = new O.x({
            isError: !1,
            errTip: {}
          });
          this._rankId = "";
          this.isRecommendMedical = !1;
          this.isRecommendNewRetail = !1;
          this._searchBasicParams = {};
          this.isFirstScreen = !0;
        }
        return (0, i.Z)($, [{
          key: "reset",
          value: function () {
            this.search$.next({
              params: {},
              keyword: "",
              status: p.fF
            });
            this.loading$.next({
              recommendLoading: !1
            });
            this.error$.next({
              isError: !1,
              errTip: {}
            });
            this.searchMiddleGlobal$.next({
              homeTrack: "",
              refreshOption: ""
            });
            this.resetGuessValue();
            this.resetSearchBarAutoFocusValue();
          }
        }, {
          key: "setSearchParams",
          value: function (o) {
            this._searchBasicParams = Object.assign(this._searchBasicParams, o);
          }
        }, {
          key: "resetGuessValue",
          value: function () {
            this.guess$.next({
              kw: ""
            });
          }
        }, {
          key: "resetSearchBarAutoFocusValue",
          value: function () {
            this.searchBarAutoFocus$.next({
              value: !0,
              refer: ""
            });
          }
        }, {
          key: "getSearchParams",
          value: function () {
            return De(De({}, this._searchBasicParams), this.search$.getValue().params);
          }
        }, {
          key: "navigateToSearchResult",
          value: function (o) {
            var v = o.keyword,
              S = o.refer,
              b = o.guideTrack,
              _ = o.cb,
              I = o.searchExtraParams,
              T = o.spmcd;
            if (v) {
              var s = this.search$.getValue(),
                r = s.status,
                u = s.keyword;
              console.log(r, r === p.NQ, u);
              this.guess$.mergeNext({
                kw: r === p.NQ ? u : v
              });
              this.searchBarAutoFocus$.mergeNext({
                value: !1
              });
              this.recordHistory(v);
              var d = {
                  keyword: v,
                  refer: S
                },
                y = "";
              if (I) {
                d.search_extra_params = encodeURIComponent(JSON.stringify(I));
                y = I.searchEntryCode;
              }
              var B = De(De(xe(De({}, this.query$.getValue().value), {
                track: encodeURIComponent(b),
                entry_code: y,
                startTime: +new Date(),
                spm: "".concat((0, C.S)(), ".12273696.").concat(T)
              }), d), (0, L.rO)("sp.service.".concat(T), "srp"));
              my.navigateTo({
                url: (0, E.GB)("/pages/search-result/search-result", B),
                success: typeof _ == "function" ? _() : function () {}
              });
            }
          }
        }, {
          key: "recordHistory",
          value: function (o) {
            var v = this,
              S = this.getHistoryStorageKey(),
              b = this.getHistoryListKey(),
              _ = this.recommend$.getValue()[b] || [];
            _ = [o].concat((0, J.Z)(_.filter(function (I) {
              return I !== o;
            }))).filter(function (I, T) {
              if (T < 10) return I;
            });
            P.Z.set(S, _).then(function () {
              var I = {};
              I[b] = _;
              v.recommend$.mergeNext(I);
            });
          }
        }, {
          key: "clearHistory",
          value: function () {
            var o = this,
              v = this.getHistoryStorageKey(),
              S = this.getHistoryListKey();
            P.Z.set(v, []).then(function () {
              var b = {};
              b[S] = [];
              o.recommend$.mergeNext(b);
            });
          }
        }, {
          key: "deleteHistoryItem",
          value: function (o) {
            var v = this,
              S = this.getHistoryStorageKey(),
              b = this.getHistoryListKey(),
              _ = this.recommend$.getValue()[b] || [],
              I = _.filter(function (T) {
                return T !== o;
              });
            P.Z.set(S, I).then(function () {
              var T = {};
              T[b] = I;
              v.recommend$.mergeNext(T);
            });
          }
        }, {
          key: "getEnterMiddle",
          value: function () {
            var o = "";
            if ((0, L.at)()) {
              o = p.Jn.Page_Home;
            }
            try {
              var v = le()().aife.pageManager.getSecondToLastPage(getCurrentPages),
                S = v.properties.pageConfig;
              if (S.pageName) {
                o = p.Jn[S.pageName];
              } else {
                o = "";
              }
            } catch (b) {}
            le()().answer.logKeyEvent({
              event: "getEnterMiddle",
              desc: "enterMiddle",
              extra: {
                enterMiddle: o
              }
            });
            return o;
          }
        }, {
          key: "getEdgeFeature",
          value: function () {
            return qe(this, null, H().m(function o() {
              var v, S, b, _, I, T, s, r, u, d, y, B, z, be, ne;
              return H().w(function (ie) {
                for (;;) switch (ie.p = ie.n) {
                  case 0:
                    ie.p = 0;
                    ie.n = 1;
                    return le()().aife.ssp.getFeature("placeholder_keyword_714");
                  case 1:
                    v = ie.v;
                    S = "a2f6g.12507204.shopList";
                    b = "a2f6g.12482165.shop";
                    _ = "a2f6g.13154471.SearchFooditem";
                    I = [S, b, _];
                    T = "a2f6g.12273696.HomeKeyword";
                    s = ["a2f6g.12273696.SearchHistoricalWord", T, "a2f6g.12273696.SearchHotWord", "a2f6g.12273696.SearchHotBoard", "a2f6g.12273696.SearchGuessWord", "a2f6g.12273696.SuggestGuess", "a2f6g.12273696.SuggestWord", "a2f6g.12273696.SuggestTagWord", "a2f6g.13154471.ComprehensiveFilter"];
                    r = v.placeholder_keyword_714.slice().reverse();
                    u = [];
                    d = [];
                    y = H().m(function Le(we) {
                      var Ne, re, X;
                      return H().w(function (q) {
                        for (;;) switch (q.n) {
                          case 0:
                            if (r[we].spm) {
                              q.n = 1;
                              break;
                            }
                            return q.a(2, 0);
                          case 1:
                            if (!(d.length < 3 && I.some(function (Ve) {
                              return r[we].spm.startsWith(Ve);
                            }))) {
                              q.n = 2;
                              break;
                            }
                            d.push([r[we].restaurant_id, -1, r[we].timestamp, r[we].pageName]);
                            q.n = 8;
                            break;
                          case 2:
                            if (!(s.some(function (Ve) {
                              var or = r[we].spm;
                              if (or.startsWith(Ve)) return !0;
                            }) && (u.length < 3 || u.some(function (Ve) {
                              return Ve.sources.length < 5;
                            })))) {
                              q.n = 8;
                              break;
                            }
                            Ne = u.find(function (Ve) {
                              return Ve.keyword === r[we].keyword;
                            });
                            if (Ne) {
                              q.n = 4;
                              break;
                            }
                            if (!(u.length >= 3)) {
                              q.n = 3;
                              break;
                            }
                            return q.a(2, 0);
                          case 3:
                            Ne = {
                              keyword: r[we].keyword,
                              sources: [],
                              timestamps: []
                            };
                            u.push(Ne);
                          case 4:
                            if (!(Ne.sources.length < 5)) {
                              q.n = 8;
                              break;
                            }
                            Ne.sources.push(r[we].refer);
                            Ne.timestamps.push(r[we].timestamp);
                            re = H().m(function Ve() {
                              var or, We;
                              return H().w(function (He) {
                                for (;;) switch (He.n) {
                                  case 0:
                                    if (r[X].uefBiz !== "history_list") {
                                      He.n = 1;
                                      break;
                                    }
                                    or = JSON.parse(le()().selectedHistoricalList || "[]");
                                    We = r[we].keyword;
                                    if ((r[we].refer === "\u5E95\u7EB9\u8BCD" || r[we].refer === "\u641C\u7D22\u6846\u4E0B\u70ED\u8BCD\u641C\u7D22") && We.includes("@")) {
                                      We = We.split("@")[0];
                                    }
                                    if (or.some(function (nr) {
                                      return nr.content.keyword === We;
                                    })) {
                                      Ne.isShow = "1";
                                    } else {
                                      Ne.isShow = "0";
                                    }
                                    return He.a(2, 1);
                                  case 1:
                                    return He.a(2);
                                }
                              }, Ve);
                            });
                            X = 0;
                          case 5:
                            if (!(X < r.length)) {
                              q.n = 8;
                              break;
                            }
                            return q.d((0, G.Z)(re()), 6);
                          case 6:
                            if (!q.v) {
                              q.n = 7;
                              break;
                            }
                            return q.a(3, 8);
                          case 7:
                            X++;
                            q.n = 5;
                            break;
                          case 8:
                            return q.a(2);
                        }
                      }, Le);
                    });
                    z = 0;
                  case 2:
                    if (!(z < r.length)) {
                      ie.n = 5;
                      break;
                    }
                    return ie.d((0, G.Z)(y(z)), 3);
                  case 3:
                    B = ie.v;
                    if (B !== 0) {
                      ie.n = 4;
                      break;
                    }
                    return ie.a(3, 4);
                  case 4:
                    z++;
                    ie.n = 2;
                    break;
                  case 5:
                    be = {
                      historicalWords: JSON.stringify(u.map(function (Le) {
                        return xe(De({}, Le), {
                          sources: Le.sources.join(","),
                          timestamps: Le.timestamps.join(",")
                        });
                      })),
                      searchMidpageRequest: {
                        shop_clk_seq: d.map(function (Le) {
                          return Le.join(",");
                        }).join("^"),
                        version: "2"
                      }
                    };
                    console.log(be, "featurefeature");
                    if (le()().answer) {
                      le()().answer.logCount({
                        id: "edgeFeature",
                        tags: {
                          result: 1
                        },
                        extra: {
                          feature: be
                        }
                      });
                    }
                    return ie.a(2, be);
                  case 6:
                    ie.p = 6;
                    ne = ie.v;
                    if (le()().answer) {
                      le()().answer.logCount({
                        id: "edgeFeature",
                        tags: {
                          result: 0
                        },
                        extra: {
                          error: ne.message
                        }
                      });
                    }
                    return ie.a(2, {
                      historicalWords: [],
                      searchMidpageRequest: {
                        version: "2"
                      }
                    });
                }
              }, o, null, [[0, 6]]);
            }));
          }
        }, {
          key: "asyncSearchFoundRequest",
          value: function () {
            return qe(this, null, H().m(function o() {
              var v, S, b, _, I, T, s, r, u, d, y;
              return H().w(function (B) {
                for (;;) switch (B.p = B.n) {
                  case 0:
                    B.p = 0;
                    v = this.query$.getValue().value;
                    this.loading$.mergeNext({
                      recommendLoading: !0
                    });
                    S = v.channelId || v.from_channel || 0;
                    b = v.channel_code || 0;
                    _ = this.getSearchFoundScene(b);
                    I = this.getSearchParams();
                    T = xe(De({
                      apiVersion: "3.1"
                    }, I), {
                      kw: v.kw || I.kw,
                      scene: _,
                      channelId: S,
                      channelCode: b
                    });
                    s = this.guess$.getValue();
                    r = s.kw;
                    if (r) {
                      T.kw = r;
                      console.log(T);
                    }
                    Object.keys(T).forEach(function (z) {
                      if (!T[z]) {
                        delete T[z];
                      }
                    });
                    u = this.getEnterMiddle();
                    if (I.enterMiddle === "sug") {
                      T.enterMiddle = "sug";
                    } else {
                      T.enterMiddle = u || I.enterMiddle;
                    }
                    this.setSearchParams({
                      enterMiddle: T.enterMiddle
                    });
                    B.n = 1;
                    return this.getEdgeFeature().catch(function () {
                      return {};
                    });
                  case 1:
                    d = B.v;
                    T.edgeFeature4Middle = JSON.stringify(De({
                      enterMiddle: u
                    }, d));
                    return B.a(2, K(T));
                  case 2:
                    B.p = 2;
                    y = B.v;
                    console.error(y, "getSearchFound error");
                    le()().exlog.customerror("asyncSearchFoundRequest \u4E2D\u95F4\u9875\u9519\u8BEF", "", y);
                    this.loading$.mergeNext({
                      recommendLoading: !1
                    });
                  case 3:
                    return B.a(2);
                }
              }, o, this, [[0, 2]]);
            }));
          }
        }, {
          key: "asyncSearchFound",
          value: function () {
            var o = this;
            return this.asyncSearchFoundRequest().then(function (v) {
              var S = o.getEnterMiddle() || "home";
              if (!le()().utils.platform.IS_H5_ENV && S !== "home") {
                if (!v.bgWords || !v.bgWords.length) {
                  o.loading$.mergeNext({
                    recommendLoading: !1
                  });
                  o.searchMiddleGlobal$.mergeNext({
                    refreshOption: "retain"
                  });
                  return;
                }
                o.searchMiddleGlobal$.mergeNext({
                  refreshOption: "refresh"
                });
              }
              o.handleSetSearchData(v);
            }).catch(function () {
              o.loading$.mergeNext({
                recommendLoading: !1
              });
              o.searchMiddleGlobal$.mergeNext({
                refreshOption: "retain"
              });
            });
          }
        }, {
          key: "handleSetSearchData",
          value: function (o) {
            this.recommend$.mergeNext({
              searchFound: o
            });
            if (this.isFirstScreen) {
              le()().exlog.performance("bizAvailable", "", "end");
              this.isFirstScreen = !1;
            }
            this.loading$.mergeNext({
              recommendLoading: !1
            });
            this._rankId = o && o.rankId;
            try {
              var v = o || {},
                S = v.HOT_BOARDS;
              if (S) {
                this.getShopPreRenderData(S);
              }
            } catch (b) {
              console.error(b, "getShopPreRenderData error");
            }
          }
        }, {
          key: "asyncCacheSearchFound",
          value: function () {
            return qe(this, null, H().m(function o() {
              var v = this;
              return H().w(function (S) {
                for (;;) switch (S.n) {
                  case 0:
                    P.Z.get(p.y_).then(function (b) {
                      v.recommend$.mergeNext({
                        searchFound: b
                      });
                    });
                  case 1:
                    return S.a(2);
                }
              }, o);
            }));
          }
        }, {
          key: "getShopPreRenderData",
          value: function (o) {
            try {
              var v = o.blocks,
                S = le()().utils.getShopPreRenderData;
              if (!v || !Array.isArray(v) || typeof S != "function") return;
              var b = [];
              v.forEach(function (_) {
                var I = _.entities,
                  T = _.code;
                if (T === "TOP_RESTAURANTS" && I && Array.isArray(I)) {
                  I.forEach(function (s) {
                    var r = s.shopId;
                    if (r) {
                      b.push({
                        shopId: r
                      });
                    }
                  });
                }
              });
              S(b);
            } catch (_) {
              console.error(_, "getShopPreRenderData error");
            }
          }
        }, {
          key: "asyncSearchHistory",
          value: function () {
            return qe(this, null, H().m(function o() {
              var v = this,
                S,
                b;
              return H().w(function (_) {
                for (;;) switch (_.n) {
                  case 0:
                    S = this.getHistoryStorageKey();
                    b = this.getHistoryListKey();
                    P.Z.get(S).then(function (I) {
                      var T = {};
                      T[b] = I || [];
                      v.recommend$.mergeNext(T);
                    });
                  case 1:
                    return _.a(2);
                }
              }, o, this);
            }));
          }
        }, {
          key: "getSearchFoundScene",
          value: function (o) {
            var v = this.isRecommendNewRetail,
              S = this.isRecommendMedical,
              b = this.query$.getValue().value,
              _ = "ALIPAY_MINIAPP_MIDDLE_PAGE";
            try {
              if (le()().utils.platform.IS_DY_ENV || le()().utils.platform.IS_DYLT_ENV) {
                _ = "DY_MIDDLE_PAGE";
              } else {
                if (le()().utils.platform.IS_TB_ENV || le()().utils.platform.IS_LT_ENV) {
                  if (v) {
                    _ = "TAOBAO_MINIAPP_RETAIL_MIDDLE_PAGE";
                  } else {
                    if (S) {
                      _ = "TAOBAO_MINIAPP_MEDICINE_MIDDLE_PAGE";
                    } else {
                      _ = "TAOBAO_MINIAPP_MIDDLE_PAGE";
                    }
                  }
                } else {
                  if (le()().utils.platform.IS_WX_ENV) {
                    if (v) {
                      _ = "WECHAT_RETAIL_MIDDLE_PAGE";
                    } else {
                      if (S) {
                        _ = "WECHAT_MEDICINE_MIDDLE_PAGE";
                      } else {
                        _ = "WECHAT_H5_MIDDLE_PAGE";
                      }
                    }
                  } else {
                    if (le()().utils.platform.IS_WEB_ENV) {
                      _ = "OTHER_H5_MIDDLE_PAGE";
                      if (v) {
                        _ = "OTHER_H5_RETAIL_MIDDLE_PAGE";
                      } else {
                        if (S) {
                          _ = "H5_MEDICINE_MIDDLE_PAGE";
                        }
                      }
                      if (o === p.ki.dingdingPindan) {
                        _ = "DINGTALK_PD_MIDDLE_PAGE";
                      }
                    } else {
                      if (v) {
                        _ = "ALIPAY_MINIAPP_RETAIL_MIDDLE_PAGE";
                      } else {
                        if (S) {
                          _ = "ALIPAY_MINIAPP_MEDICINE_MIDDLE_PAGE";
                        } else {
                          _ = "ALIPAY_MINIAPP_MIDDLE_PAGE";
                        }
                      }
                    }
                  }
                }
              }
              if ((0, w.P1)(b)) {
                _ = "COMMON_MIDDLE_PAGE";
              } else {
                if (o === p.ki.tbxsdtab || o === p.ki.tbxsd401 || o === p.ki.tbxsd402 || o === p.ki.tbxsd403 || o === p.ki.tbxsd404) {
                  _ = "TAOBAO_MINIAPP_XSD_TAB_MIDDLE_PAGE";
                }
              }
            } catch (I) {}
            return _;
          }
        }, {
          key: "getHistoryStorageKey",
          value: function () {
            try {
              var o = this.query$.getValue().value,
                v = o.channel_code,
                S = this.isRecommendNewRetail,
                b = this.isRecommendMedical,
                _ = p.qc;
              if (b) {
                _ = p.Np;
              }
              if (S) switch (v) {
                case p.av.supermarket:
                  _ = p.kU;
                  break;
                case p.av.fresh:
                  _ = p.$k;
                  break;
                case p.av.flower:
                  _ = p.gh;
                  break;
                case p.av.kitchen:
                  _ = p.np;
                  break;
                default:
                  _ = p.fA;
                  break;
              }
              return _;
            } catch (I) {
              return p.qc;
            }
          }
        }, {
          key: "getHistoryListKey",
          value: function () {
            try {
              var o = this.query$.getValue().value,
                v = o.channelId || o.from_channel || 0,
                S = o.channel_code,
                b = this.isRecommendNewRetail,
                _ = this.isRecommendMedical,
                I = "historicalList";
              if (_) {
                I = "medicalHistoricalList";
              }
              if (b) {
                if (S === p.av.supermarket || S === p.av.fresh || S === p.av.flower || S === p.av.kitchen) {
                  I = "".concat(v, "HistoricalList");
                } else {
                  I = "commonNewRetailHistoricalList";
                }
              }
              return I;
            } catch (T) {
              return "historicalList";
            }
          }
        }], [{
          key: "getInstance",
          value: function () {
            $.__instance = $.__instance || new $();
            return $.__instance;
          }
        }]);
      }(),
      Ge = {
        getInstance: tr.getInstance
      };
  },
  "XCS/": function (Ze, Re, n) {
    var G = n("mtjH"),
      J = n("qpK/"),
      k = n("wCgl"),
      i = n("xjiE"),
      me = n("Z7ea"),
      ue = n("/BJr"),
      le = n("XLUf"),
      Se = n.n(le),
      fe = n("Gkou"),
      Ie = n("BtJ7"),
      pe = n("mEC+"),
      je = n("jfip"),
      c = n("gEaW"),
      U = n("cGqe"),
      de = n("KHZl"),
      ve = n("SgPp"),
      Oe = n("hcix"),
      Te = n("Bj0A"),
      $e = n("yw0p"),
      Ye = n("vssR"),
      Ce = n("+6bd"),
      K = n("WXf+"),
      O = {
        h5_from: "from",
        h5_businessComeFrom: "businessComeFrom",
        h5_opensite_source: "opensite_source",
        h5_jwt: "jwt",
        h5_welfare_3pp: "welfare_3pp",
        h5_corpId: "corpId",
        h5_dingClientId: "dingClientId",
        h5_ebg_agent: "ebg_agent",
        h5_ebg_appEntrance: "ebg_appEntrance",
        h5_ebg_appName: "ebg_appName"
      };
    function P() {
      var l,
        t,
        e = typeof Symbol == "function" ? Symbol : {},
        a = e.iterator || "@@iterator",
        h = e.toStringTag || "@@toStringTag";
      function D(_r, Hr, Ur, Br) {
        var Nr = Hr && Hr.prototype instanceof Me ? Hr : Me,
          jr = Object.create(Nr.prototype);
        E(jr, "_invoke", function (it, ut, st) {
          var Dr,
            sr,
            gr,
            xr = 0,
            Xr = st || [],
            Fr = !1,
            br = {
              p: 0,
              n: 0,
              v: l,
              a: Wr,
              f: Wr.bind(l, 4),
              d: function (vr, wr) {
                Dr = vr;
                sr = 0;
                gr = l;
                br.n = wr;
                return j;
              }
            };
          function Wr(Pr, vr) {
            sr = Pr;
            gr = vr;
            t = 0;
            for (; !Fr && xr && !wr && t < Xr.length; t++) {
              var wr,
                hr = Xr[t],
                $r = br.p,
                Vr = hr[2];
              if (Pr > 3) {
                if (wr = Vr === vr) {
                  gr = hr[(sr = hr[4]) ? 5 : (sr = 3, 3)];
                  hr[4] = hr[5] = l;
                }
              } else {
                if (hr[0] <= $r) {
                  if (wr = Pr < 2 && $r < hr[1]) {
                    sr = 0;
                    br.v = vr;
                    br.n = hr[1];
                  } else {
                    if ($r < Vr && (wr = Pr < 3 || hr[0] > vr || vr > Vr)) {
                      hr[4] = Pr;
                      hr[5] = vr;
                      br.n = Vr;
                      sr = 0;
                    }
                  }
                }
              }
            }
            if (wr || Pr > 1) return j;
            throw Fr = !0, vr;
          }
          return function (Pr, vr, wr) {
            if (xr > 1) throw TypeError("Generator is already running");
            if (Fr && vr === 1) {
              Wr(vr, wr);
            }
            sr = vr;
            gr = wr;
            for (; (t = sr < 2 ? l : gr) || !Fr;) {
              if (!Dr) {
                if (sr) {
                  if (sr < 3) {
                    if (sr > 1) {
                      br.n = -1;
                    }
                    Wr(sr, gr);
                  } else {
                    br.n = gr;
                  }
                } else {
                  br.v = gr;
                }
              }
              try {
                xr = 2;
                if (Dr) {
                  if (!sr) {
                    Pr = "next";
                  }
                  if (t = Dr[Pr]) {
                    if (!(t = t.call(Dr, gr))) throw TypeError("iterator result is not an object");
                    if (!t.done) return t;
                    gr = t.value;
                    if (sr < 2) {
                      sr = 0;
                    }
                  } else {
                    if (sr === 1 && (t = Dr.return)) {
                      t.call(Dr);
                    }
                    if (sr < 2) {
                      gr = TypeError("The iterator does not provide a '" + Pr + "' method");
                      sr = 1;
                    }
                  }
                  Dr = l;
                } else if ((t = (Fr = br.n < 0) ? gr : it.call(ut, br)) !== j) break;
              } catch (hr) {
                Dr = l;
                sr = 1;
                gr = hr;
              } finally {
                xr = 1;
              }
            }
            return {
              value: t,
              done: Fr
            };
          };
        }(_r, Ur, Br), !0);
        return jr;
      }
      var j = {};
      function Me() {}
      function _e() {}
      function Z() {}
      t = Object.getPrototypeOf;
      var rr = [][a] ? t(t([][a]())) : (E(t = {}, a, function () {
          return this;
        }), t),
        ar = Z.prototype = Me.prototype = Object.create(rr);
      function Cr(_r) {
        if (Object.setPrototypeOf) {
          Object.setPrototypeOf(_r, Z);
        } else {
          _r.__proto__ = Z;
          E(_r, h, "GeneratorFunction");
        }
        _r.prototype = Object.create(ar);
        return _r;
      }
      _e.prototype = Z;
      E(ar, "constructor", Z);
      E(Z, "constructor", _e);
      _e.displayName = "GeneratorFunction";
      E(Z, h, "GeneratorFunction");
      E(ar);
      E(ar, h, "Generator");
      E(ar, a, function () {
        return this;
      });
      E(ar, "toString", function () {
        return "[object Generator]";
      });
      return (P = function () {
        return {
          w: D,
          m: Cr
        };
      })();
    }
    function E(l, t, e, a) {
      var h = Object.defineProperty;
      try {
        h({}, "", {});
      } catch (D) {
        h = 0;
      }
      E = function (j, Me, _e, Z) {
        function rr(ar, Cr) {
          E(j, ar, function (_r) {
            return this._invoke(ar, Cr, _r);
          });
        }
        if (Me) {
          if (h) {
            h(j, Me, {
              value: _e,
              enumerable: !Z,
              configurable: !Z,
              writable: !Z
            });
          } else {
            j[Me] = _e;
          }
        } else {
          rr("next", 0);
          rr("throw", 1);
          rr("return", 2);
        }
      };
      E(l, t, e, a);
    }
    var w = function (t, e, a) {
      return new Promise(function (h, D) {
        var j = function (rr) {
            try {
              _e(a.next(rr));
            } catch (ar) {
              D(ar);
            }
          },
          Me = function (rr) {
            try {
              _e(a.throw(rr));
            } catch (ar) {
              D(ar);
            }
          },
          _e = function (rr) {
            return rr.done ? h(rr.value) : Promise.resolve(rr.value).then(j, Me);
          };
        _e((a = a.apply(t, e)).next());
      });
    };
    function p(l) {
      return w(this, null, P().m(function t() {
        var e, a, h, D, j, Me;
        return P().w(function (_e) {
          for (;;) switch (_e.p = _e.n) {
            case 0:
              e = getApp().fromLocation;
              if (e) {
                _e.n = 4;
                break;
              }
              _e.p = 1;
              _e.n = 2;
              return getApp().$ele().aLocation.getSystemLocation(l);
            case 2:
              e = _e.v;
              _e.n = 4;
              break;
            case 3:
              _e.p = 3;
              Me = _e.v;
              console.error("[H5][Host] err = ", Me);
            case 4:
              console.log("[H5][Host][Location] \u5B9A\u4F4D|getSystemLocation = ", e);
              a = e || {};
              h = a.latitude;
              D = a.longitude;
              if (!(!h || !D)) {
                _e.n = 5;
                break;
              }
              try {
                getApp().$answer.logKeyEvent({
                  event: "\u5B9A\u4F4D|app|getSystemLocation|fail",
                  desc: ""
                });
              } catch (Z) {
                console.error(Z);
              }
              return _e.a(2, Promise.reject(e));
            case 5:
              if (l !== "launch") {
                _e.n = 7;
                break;
              }
              _e.n = 6;
              return getApp().$ele().aLocation.isLocationCacheValid().catch(function () {
                return null;
              });
            case 6:
              j = getApp().store.LocationSync();
              if (!j || !j.latitude) {
                console.log("[H5][Host][Location] \u5B9A\u4F4D|getSystemLocation|\u5199\u5165\u5F53\u524D\u8BBE\u5907\u5B9A\u4F4D = ", e);
                getApp().store.setLocation(e);
              } else {
                console.log("[H5][Host][Location] \u5B9A\u4F4D|getSystemLocation|\u4F7F\u7528\u672C\u5730\u7528\u6237\u9009\u62E9\u7684\u5730\u5740 = ", e);
              }
              _e.n = 8;
              break;
            case 7:
              console.log("[H5][Host][Location] \u5B9A\u4F4D|getSystemLocation|\u5199\u5165\u5F53\u524D\u8BBE\u5907\u5B9A\u4F4D2 = ", e);
              getApp().store.setLocation(e);
            case 8:
              try {
                getApp().$answer.logKeyEvent({
                  event: "\u5B9A\u4F4D|app|getSystemLocation",
                  desc: JSON.stringify(e)
                });
              } catch (Z) {
                console.error(Z);
              }
              return _e.a(2, e);
          }
        }, t, null, [[1, 3]]);
      }));
    }
    var C = Object.defineProperty,
      L = Object.getOwnPropertySymbols,
      H = Object.prototype.hasOwnProperty,
      M = Object.prototype.propertyIsEnumerable,
      V = function (t, e, a) {
        return e in t ? C(t, e, {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: a
        }) : t[e] = a;
      },
      Y = function (t, e) {
        for (var a in e || (e = {})) {
          if (H.call(e, a)) {
            V(t, a, e[a]);
          }
        }
        if (L) {
          var h = (0, Te.Z)(L(e)),
            D;
          try {
            for (h.s(); !(D = h.n()).done;) {
              var a = D.value;
              if (M.call(e, a)) {
                V(t, a, e[a]);
              }
            }
          } catch (j) {
            h.e(j);
          } finally {
            h.f();
          }
        }
        return t;
      },
      oe = "ELEME_URL_QUERY_PARAMS",
      N = function () {
        return new Promise(function (t, e) {
          return my.getStorage({
            key: oe,
            success: function () {
              var h = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
              if (h && h.data) {
                t(h.data);
              } else {
                t();
              }
            },
            fail: function (h) {
              t();
            }
          });
        });
      };
    function se() {
      try {
        var l = {};
        Object.keys(O).map(function (t) {
          if (getApp()[t]) {
            l[O[t]] = getApp()[t];
          }
        });
        console.log("[H5][Host] query|\u94FE\u63A5\u67E5\u8BE2\u53C2\u6570", JSON.stringify(l, null, 2));
        my.getStorage({
          key: oe,
          success: function () {
            var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
            console.log("[H5][Host] query|\u7F13\u5B58\u67E5\u8BE2\u53C2\u6570", JSON.stringify(e, null, 2));
            var a = e || {},
              h = a.data,
              D = h === void 0 ? {} : h;
            if (!getApp().query.from) {
              l = Y(Y({}, D || {}), l);
              if (D && D.from && D.from != "mobile.default") {
                l.from = D.from;
              }
            }
            x(l);
          },
          fail: function (e) {
            console.error(e);
            x(l);
          }
        });
      } catch (t) {
        console.error("[H5][Host] query|storageQueryParams", t);
      }
    }
    function x(l) {
      if (l.from === "jianhang" && l.opensite_source) {
        delete l.opensite_source;
      }
      console.log("[H5][Host] query|\u5408\u5E76\u67E5\u8BE2\u53C2\u6570", JSON.stringify(l, null, 2));
      Object.keys(O).map(function (t) {
        if (l[O[t]]) {
          getApp()[t] = l[O[t]];
        }
      });
      getApp().from = getApp().h5_from || getApp().from;
      my.setStorage({
        key: oe,
        data: l
      });
    }
    function Ae(l) {
      console.log("[H5][Host] query|appendCacheQuery = ", l);
      if (!(!l || Object.keys(l) == 0)) {
        var t = urlUtils.parse(window.location.href);
        Object.keys(l).forEach(function (a) {
          t.query[a] = t.query[a] || l[a];
        });
        var e = "";
        if (t.path) {
          e += t.path;
        }
        if (t.query) {
          e += "?" + urlUtils.getQueryString(t.query);
        }
        if (t.hash) {
          e += t.hash;
        }
        if (!e.startsWith("/")) {
          e = "/" + e;
        }
        window.history.replaceState({}, "", e);
        console.log("[H5][Host] query|appendCacheQuery|result = ", e);
      }
    }
    var De = {
        getAppQueryParams: N,
        setAppQueryParams: se
      },
      xe = Object.defineProperty,
      qe = Object.getOwnPropertySymbols,
      tr = Object.prototype.hasOwnProperty,
      Ge = Object.prototype.propertyIsEnumerable,
      $ = function (t, e, a) {
        return e in t ? xe(t, e, {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: a
        }) : t[e] = a;
      },
      f = function (t, e) {
        for (var a in e || (e = {})) {
          if (tr.call(e, a)) {
            $(t, a, e[a]);
          }
        }
        if (qe) {
          var h = (0, Te.Z)(qe(e)),
            D;
          try {
            for (h.s(); !(D = h.n()).done;) {
              var a = D.value;
              if (Ge.call(e, a)) {
                $(t, a, e[a]);
              }
            }
          } catch (j) {
            h.e(j);
          } finally {
            h.f();
          }
        }
        return t;
      },
      o = {};
    function v(l) {
      if (l && (0, Oe.Z)(l) === "object") {
        o = f(f({}, o), l);
      }
    }
    window.$setMorPageConfig = v;
    function S() {
      return o || {};
    }
    var b = function (l, t) {
        var e = !1,
          a = S();
        if (a[l]) {
          var h = a[l],
            D = h.showHeader,
            j = h.force;
          if (typeof D == "boolean" && (e = D, j)) return e;
        }
        if (t && t["hide-header"] !== void 0) {
          e = t["hide-header"] === "0";
        }
        return e;
      },
      _ = function (l, t) {
        var e = !1,
          a = S();
        if (a[l]) {
          var h = a[l],
            D = h.showBack,
            j = h.force;
          if (typeof D == "boolean" && (e = D, j)) return e;
        }
        if (t) {
          if (t["hide-back"] !== void 0) {
            e = t["hide-back"] === "0";
          } else {
            if (t["hide-header"] !== void 0) {
              e = t["hide-header"] === "0";
            }
          }
        }
        return e;
      },
      I = n("s861"),
      T = n("IqOO"),
      s = n("05u5"),
      r = n("CW13"),
      u = "DLog",
      d = !1,
      y = 0,
      B,
      z = !1,
      be = function () {},
      ne = console.log,
      ie = console.info,
      Le = console.error,
      we = console.warn,
      Ne = function () {
        if (He(arguments)) {
          ne.apply(console, arguments);
        }
      },
      re = function () {
        if (He(arguments)) {
          Le.apply(console, arguments);
        }
      },
      X = function () {
        if (He(arguments)) {
          we.apply(console, arguments);
        }
      };
    function q() {
      if (window.__eleDebug.query.__Dreport === "1") {
        d = !0;
      } else {
        if (window.__eleDebug.query.__Dreport === "0") {
          (0, r.Zk)();
        }
      }
      if (!d) {
        d = !!(0, r._R)();
      }
      We();
    }
    var Ve = ["[answer]", "data is", "[mor]component-init"];
    function or() {
      for (var l = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [], t = 0; t < l.length; t++) {
        var e = l[t];
        if (e) {
          if (e.answer || e.$answer) return !0;
          if (t === 0) {
            for (var a = 0; a < Ve.length; a++) if (typeof e == "string" && e.indexOf(Ve[a]) > -1) return !0;
          }
        }
      }
      return !1;
    }
    function We() {
      if (!z) {
        z = !0;
        if (d) {
          console.log("[H5] d| realtime report log");
          ge();
        } else {
          if (s.Z.isDebugPage() || window.__eleDebug.query.__isDebug === "1") {
            console.log("[H5] d| can show console log");
          } else {
            console.log("[H5] d| not show log");
            Pe();
          }
        }
      }
    }
    function He(l) {
      return or(Array.from(l)) ? !1 : (d && (getApp && getApp() && getApp().$answer ? nr(l) : setTimeout(function () {
        nr(l);
      }, 1e3)), !0);
    }
    function nr(l) {
      try {
        getApp().$answer.logKeyEvent({
          event: "".concat(u, "|").concat(y++),
          desc: Fe(l),
          extra: Array.from(l)
        });
        if (B) {
          clearTimeout(B);
        }
        B = setTimeout(function () {
          getApp().$answer.sendLog();
        }, 1e3);
        return !0;
      } catch (t) {}
    }
    function Fe(l) {
      for (var t = Array.from(l), e = "", a = 0; a < t.length; a++) {
        if (Object.prototype.toString.call(t[a]) === "[object String]") {
          e += "|" + t[a];
        }
      }
      return e;
    }
    function Pe() {
      console.info = be;
      console.log = be;
      console.warn = be;
      console.debug = be;
    }
    function ge() {
      console.error = re;
      console.warn = X;
      console.log = Ne;
      console.info = Ne;
    }
    var he = {
      init: q
    };
    window.__eleDebug = window.__eleDebug || {};
    window.__eleDebug.query = s.Z.getQueryDebugParams() || {};
    function cr() {
      he.init();
      setTimeout(function () {
        var l = getApp().$ele(),
          t = l.pluginInfo;
        if ((s.Z.isDebugPage() || window.__eleDebug.query.__isDebug === "1") && t) {
          my.showToast({
            content: "\u7248\u672C: ".concat(t.version, "-").concat(t.build_num || t.buildNum, " \u5BBF\u4E3B:").concat(de.version, "-").concat(de.build_num, "-").concat(de.branch)
          });
        }
      }, 1e3);
    }
    try {
      cr();
    } catch (l) {
      console.error("[H5] d|setupDebug = ", l);
    }
    function lr() {
      var l = $e.Z.parse(window.location.href) || {};
      l.query = l.query || {};
      var t = l.query,
        e = t.latitude,
        a = t.longitude,
        h = t.redirectAddressData,
        D = t.geohash;
      console.log("[H5][Host][Location] \u5B9A\u4F4D|markHasConsumedLinkLatLng= ", l.query);
      if (e || a || h) {
        l.query.__locLat = e;
        l.query.__locLng = a;
        l.query.__geohash = D;
        if (h) {
          l.query.__locRedirectAddressData = 1;
        }
        delete l.query.latitude;
        delete l.query.longitude;
        delete l.query.geohash;
        delete l.query.redirectAddressData;
      } else return;
      var j = "";
      if (l.path) {
        j += l.path;
      }
      if (l.query) {
        j += "?" + $e.Z.getQueryString(l.query);
      }
      if (l.hash) {
        j += l.hash;
      }
      if (!j.startsWith("/")) {
        j = "/" + j;
      }
      setTimeout(function () {
        console.log("[H5][Host][\u5B9A\u4F4D] 1\u79D2\u540E url \u6807\u8BB0\u5DF2\u6D88\u8D39\u94FE\u63A5\u4E0A\u7684\u7ECF\u7EAC\u5EA6 = ", j);
        window.history.replaceState({}, "", j);
      }, 1e3);
    }
    function Er(l) {}
    var F = Object.defineProperty,
      g = Object.getOwnPropertySymbols,
      m = Object.prototype.hasOwnProperty,
      A = Object.prototype.propertyIsEnumerable,
      W = function (t, e, a) {
        return e in t ? F(t, e, {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: a
        }) : t[e] = a;
      },
      te = function (t, e) {
        for (var a in e || (e = {})) {
          if (m.call(e, a)) {
            W(t, a, e[a]);
          }
        }
        if (g) {
          var h = (0, Te.Z)(g(e)),
            D;
          try {
            for (h.s(); !(D = h.n()).done;) {
              var a = D.value;
              if (A.call(e, a)) {
                W(t, a, e[a]);
              }
            }
          } catch (j) {
            h.e(j);
          } finally {
            h.f();
          }
        }
        return t;
      },
      Ee,
      R,
      ce,
      ee,
      Q = window.location.href,
      ae = {
        setup: function (t) {
          var e = this;
          R = t;
          R.mtop = (0, c.default)().mtop;
          R.isQiyema = (0, c.default)().utils.isQiyema;
          R.aplus = (0, c.default)().aplus;
          R.store = (0, c.default)().store;
          R.storage = (0, c.default)().storage;
          R.aFetch = (0, c.default)().aFetch;
          R.geohash = (0, c.default)().utils.Geohash;
          R.postParentWebview = (0, c.default)().utils.postParentWebview;
          R.account = (0, c.default)().authLogin;
          (0, c.default)().utils.setWebviewId();
          setTimeout(function () {
            (0, c.default)().utils.setNavigationBar({
              title: "\u200B"
            });
          }, 1e3);
          R.$ele().authLogin.logoutCheckOnLaunch();
          (0, c.default)().init({
            isDebug: R.env !== "online",
            utils: {},
            appInfo: te(te({
              env: R.env,
              appId: de.app_id
            }, de), I)
          }, {});
          (0, c.default)().authLogin.getUserId = (0, c.default)().authLogin.getUserIdSync;
          (0, c.default)().utils.setTabBarPageList(["pages/index/index", "pages/my/index", "pages/order-list/index", "pages/svip/index", "pages-pindan/home/index", "pages-greengo/index/index", "pages-gonghui/home/index"]);
          this.initApp();
          (0, c.default)().storage.set("version", de, !0);
          (0, c.default)().authLogin.refreshUserId4H5();
          se();
          setTimeout(function () {
            e.isRedirectUrl();
          }, 0);
          if (window.location.href.indexOf("hide-tabbar=1") > -1) {
            setTimeout(function () {
              my.hideTabBar();
            }, 0);
          }
          setTimeout(function () {
            (0, c.default)().storage.batchUpdate();
          }, 1e4);
          setTimeout(function () {
            var a,
              h = ((a = (0, c.default)().appInfo) == null ? void 0 : a.version) || "unknow";
            console.log("[H5][HOST] M\u7AD9\u542F\u52A8 host_version:".concat(h, " = "), Q);
            if (getApp().$answer && getApp().$answer.logCount) {
              getApp().$answer.logCount({
                id: "M\u7AD9\u542F\u52A8",
                tags: {
                  from: (0, c.default)().from,
                  host_version: h,
                  onLaunchHref: Q
                }
              });
            }
            if (my && !my.$tigaEvent) {
              console.error("[H5][Host] mor my \u88AB\u7CFB\u7EDF my \u8986\u76D6\uFF0C\u8BF7\u53CD\u9988\u7ED9@\u7EAA\u4F1F\u6392\u67E5");
            }
            console.info("[H5][Host] $ele \u7248\u672C\uFF1A", (0, c.default)().$VERSION);
          }, 0);
        },
        isRedirectUrl: function () {
          try {
            var t = $e.Z.parse(window.location.href),
              e = t.query || {},
              a = e.redirectUrl;
            if (a) {
              delete t.query.redirectUrl;
              var h = t.toString();
              setTimeout(function () {
                console.log("[H5][Host] replaceState = ", h);
                window.history.replaceState({
                  additionalInformation: "Updated the URL with JS"
                }, "", h);
              }, 1e3);
              setTimeout(function () {
                var D = decodeURIComponent(a);
                console.log("[H5][Host] redirectUrl = ", D);
                (0, c.default)().navigate({
                  url: D,
                  ebridgeNavType: 0
                });
              }, 0);
            }
          } catch (D) {
            console.error("[H5][Host] isRedirectUrl|fail = ", D);
          }
        },
        initApp: function () {
          R.appNetworkSuccess = !0;
          var t = Sr && window.location.pathname.startsWith("/minisearch");
          return Promise.all([this.doLogin(), t ? Promise.resolve() : this.getLocation("launch")]).then(function () {
            console.log("[H5][Host] emit app ready");
            R.$isAppReady = !0;
            R.$event.emit("events:app_reday");
          }).catch(function (e) {
            console.log("[H5][Host] emit app ready err", e);
            setTimeout(function () {
              R.$isAppReady = !0;
              R.$event.emit("events:app_reday");
            }, 1e3);
          });
        },
        getLocation: function (t) {
          var e = this;
          (0, c.default)().exlog.performanceStart("appLaunchGetLocationH5");
          return p(t).then(function (a) {
            (0, c.default)().exlog.performanceEnd("appLaunchGetLocationH5");
            if (a.highAccuracyClosed) {
              R.appHighAccuracyClosed = !0;
            }
            R.appLocationSuccess = !0;
            e.appLog("lbs", {
              lbsInfo: a
            });
          }).catch(function (a) {
            (0, c.default)().exlog.performanceEnd("appLaunchGetLocationH5");
            R.appLocationError = a;
            e.appLog("lbs");
            var h = "";
            if (a) {
              if (a.toString() === "[object GeolocationPositionError]") {
                h = JSON.stringify({
                  msg: a.message,
                  code: a.code
                });
              } else {
                h = JSON.stringify(a);
              }
            }
          });
        },
        doLogin: function (t) {
          console.log("[H5][Host] app|doLogin");
          if ((0, c.default)().utils.isLogoutReload() || window.noForceLogin === !0 || R.query && R.query.noForceLogin === "1" || (0, K.isPCDingTalk)() || R.h5_from === "mobile.quickappoppo" || window.location.href.indexOf("bizType=RETAIL_SUBMIT_ORDER") > -1 && window.location.href.indexOf("pages-poi/list/index") > -1) {
            console.log("[H5][Host] app|doLogin|not force login");
            return;
          }
          if (!R.firstLogin) return R.firstLogin = !0, (0, c.default)().exlog.performanceStart("appLaunchDoLoginH5"), t = t || {}, R.h5_from === "mobile.pindan" && (t.stopAutoRefresh = !0), !window.ebridge.Utils.isHarmonyOS && window.ebridge.isTB && (t.tbUccNg = !0, R.isTbNormal = !0), (0, c.default)().authLogin.login(!0, t).catch(function (e) {
            console.warn("[H5][Host] App|\u767B\u5F55\u5931\u8D25 = ", e);
            R.$event.emit("appHavanaLoginFailed");
            var a = "";
            if (e) {
              a = JSON.stringify(e);
            }
          }).then(function (e) {
            (0, c.default)().exlog.performanceEnd("appLaunchDoLoginH5");
            R.appHavanaLoginComplete = !0;
            R.$event.emit("appHavanaLoginComplete");
            if (e) {
              console.log("[H5][Host] App|\u767B\u5F55\u6210\u529F = ", e);
            }
          });
        },
        getQuery: function (t) {
          R = t;
          var e = R.$context.appQuery || {};
          R.query = e || {};
          if (!(Sr && location.pathname.startsWith("/minisearch"))) {
            this.getFromLocation(e);
          }
          R.from = e.from;
          Object.keys(O).map(function (a) {
            var h = O[a];
            if (h === "corpId") {
              R[a] = e.corpId || e.corpid;
            } else {
              R[a] = e[h];
            }
            if (h === "from" && !R[a]) {
              R[a] = "mobile.default";
            }
          });
          R.qiyemaVersion = e.qiyemaVersion;
          if (e.env) {
            R.env = e.env;
          }
          (0, c.default)().from = (0, c.default)().comeFrom = R.from || "mobile.default";
          console.log("[H5][Host] App|getQuery", R.query);
        },
        getFromLocation: function (t) {
          var e = t || {},
            a = e.latitude,
            h = e.longitude,
            D = e.address,
            j = e.cityCode,
            Me = e.name,
            _e = e.geoType,
            Z = e.redirectAddressData;
          console.log("[H5][Host][Location] \u5B9A\u4F4D|getFromLocation = ", t);
          var rr = !0;
          if (Z) try {
            Z = JSON.parse(decodeURIComponent(Z));
            var ar = Z,
              Cr = ar.locationName;
            if (Cr) {
              rr = !1;
            }
          } catch (jr) {
            console.error(jr);
          }
          if (!Z || (0, Oe.Z)(Z) !== "object") {
            Z = {};
          }
          if (!+a && Z && Z.latitude && Z.longitude) {
            a = Z.latitude;
            h = Z.longitude;
          }
          if (+a && +h) {
            if (_e === "baidu") {
              var _r = (0, c.default)().utils.geoTransForm.bd09togcj02(h, a),
                Hr = (0, ve.Z)(_r, 2),
                Ur = Hr[0],
                Br = Hr[1];
              console.log("[H5][Host][Location] \u5B9A\u4F4D|\u767E\u5EA6\u5750\u6807 -> \u9AD8\u5FB7\u5750\u6807 =", [h, a], [Ur, Br]);
              a = Br;
              h = Ur;
            }
            var Nr = te({
              from: "OnLaunchLocation",
              latitude: a,
              longitude: h,
              address: D,
              cityCode: j,
              locationName: Me,
              needReverse: rr
            }, Z);
            R.fromLocation = Nr;
            R.fromLocationStable = Nr;
            console.log("[H5][Host][Location] \u5B9A\u4F4D|app|fromLocation|\u8BFB\u53D6\u94FE\u63A5\u7ECF\u7EAC\u5EA6 = ", Nr);
            (0, c.default)().store.setLocation(Nr).then(function () {
              lr();
            });
          }
        },
        appLog: function (t, e) {
          var a = e || {},
            h = a.userInfo,
            D = a.lbsInfo;
          if (!ce) {
            ce = D;
          }
          if (!ee) {
            ee = h;
          }
          var j = ee && ee.user_id,
            Me = ce && ce.latitude,
            _e = ce && ce.longitude;
          (0, c.default)().aplus.custom("LBS_Mark", {
            login: ee ? 1 : 0,
            latitude: Me,
            longitude: _e,
            uid: j,
            pid: R.alipayUserid,
            action: t
          });
        },
        morPlugins: [(0, Ye.Z)({
          answer: {
            appInfo: {
              appId: "msite"
            },
            tags: {
              from: (0, c.default)().utils.getSubChannel() || "mobile.default"
            },
            authLogin: {
              getUserId: function () {
                var t,
                  e,
                  a,
                  h = ((t = (0, c.default)().authLogin) == null ? void 0 : t.getUserIdSync()) || ((a = (e = (0, c.default)().utils).getDefaultUID) == null ? void 0 : a.call(e)) || "0";
                return h;
              }
            },
            utils: {
              getDeviceId: (0, c.default)().utils.getDeviceId
            },
            arsenal: function () {
              return (0, c.default)();
            }
          }
        }), function () {
          return {
            plugins: [new Ce.Z({
              navConfig: {
                statusBarHeight: function (t, e) {
                  var a = (0, c.default)().systemInfo,
                    h = e || {},
                    D = h.statusBarHeight,
                    j = D === void 0 ? a.statusBarHeight : D,
                    Me = +j;
                  return isNaN(Me) ? 0 : Me + "px";
                },
                titleBarHeight: function (t, e) {
                  var a = (0, c.default)().systemInfo || {},
                    h = e || {},
                    D = h.titleBarHeight,
                    j = D === void 0 ? a.titleBarHeight : D,
                    Me = +j;
                  return isNaN(Me) ? "44px" : Me + "px";
                }
              },
              showHeaderControl: function (t) {
                return b;
              },
              showBackControl: function (t) {
                return _;
              },
              updatePageConfig: function () {
                return function (t, e) {
                  var a = !!(e && e["hide-header"] === "0");
                  if (a) switch (t) {
                    case "pages/order-list/index":
                      return {
                        defaultTitle: "\u8BA2\u5355\u5217\u8868",
                        transparentTitle: "none"
                      };
                    case "pages/my/index":
                      return {
                        defaultTitle: "\u6211\u7684",
                        transparentTitle: "none"
                      };
                    default:
                      break;
                  }
                };
              }
            })]
          };
        }]
      },
      Je = (typeof window == "undefined" ? "undefined" : (0, Oe.Z)(window)) === "object",
      Ue = Je ? window.navigator && window.navigator.userAgent : "",
      yr = /AliApp\(TB\//i.test(Ue),
      ir = Je && ((Ee = window == null ? void 0 : window.WindVane) == null ? void 0 : Ee.isAvailable),
      Rr = /Themis/i.test(Ue),
      Sr = /AliApp\(TB\//i.test(Ue) && (ir || Rr),
      dr = function () {
        return !!(window && window.ebridge);
      },
      Tr = function () {
        if (dr()) {
          var t = window.location.href;
          return {
            route: t ? t.split("?")[0] : "",
            query: (0, c.default)().utils.url.getQuery(t),
            params: window.location.search
          };
        }
      },
      pr = function () {
        return ebridge ? ebridge.isWECHATMINIPROGRAM ? "wx" : ebridge.isMINIAPP ? ebridge.appName === "AP" ? "alipay" : ebridge.appName === "TB" ? "tb" : "alipay" : ebridge.isBYTEDANCEMINIPROGRAM ? ebridge.appName === "DY" ? "douyin" : ebridge.appName === "DYLT" ? "douyinlite" : "douyin" : ebridge.isELMC ? "eleme" : "h5" : "";
      },
      Lr = function (t, e) {
        return fetch(t, {
          method: "GET",
          mode: "cors",
          credentials: "omit"
        }).then(function (a) {
          return a.json().then(function (h) {
            return h;
          });
        });
      },
      Xe = function (t, e, a) {
        if (!t || !e) return !1;
        if (t === e) return !0;
        var h = (t + "").split("."),
          D = (e + "").split("."),
          j = (a + "").split("."),
          Me = !0;
        for (var _e in h) {
          if (parseInt(h[_e]) > parseInt(D[_e]) && parseInt(h[_e]) < parseInt(j[_e])) return !0;
          if (parseInt(h[_e]) < parseInt(D[_e]) || parseInt(h[_e]) > parseInt(j[_e])) return !1;
        }
        return Me;
      },
      ye = function (t) {
        var e = t;
        try {
          if (typeof t == "string") {
            e = JSON.parse(t);
          }
        } catch (a) {
          e = {};
        }
        return e;
      },
      Be = Object.defineProperty,
      fr = Object.getOwnPropertySymbols,
      Ar = Object.prototype.hasOwnProperty,
      ur = Object.prototype.propertyIsEnumerable,
      Qe = function (t, e, a) {
        return e in t ? Be(t, e, {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: a
        }) : t[e] = a;
      },
      mr = function (t, e) {
        for (var a in e || (e = {})) {
          if (Ar.call(e, a)) {
            Qe(t, a, e[a]);
          }
        }
        if (fr) {
          var h = (0, Te.Z)(fr(e)),
            D;
          try {
            for (h.s(); !(D = h.n()).done;) {
              var a = D.value;
              if (ur.call(e, a)) {
                Qe(t, a, e[a]);
              }
            }
          } catch (j) {
            h.e(j);
          } finally {
            h.f();
          }
        }
        return t;
      },
      ze = {
        SELECT_ADDRESS: "ems__checkout_use_oneside_address",
        SELECT_HONGBAO: "ems__checkout_use_hongbao",
        SELECT_TIME: "ems__checkout_use_time",
        EDIT_ADDRESS: "ems__checkout_use_oneside_edit_address",
        PAY: "ems__order_detail_direct_pay",
        DY_ORDER_DETAIL: "ems__order_detail_force_eleme_detail",
        ORDER_DETAIL: "ems__order_detail_use_h5",
        SHOP: "ems__shop_use_h5",
        CHECKOUT: "ems__checkout_use_h5",
        PREFETCH_ADDRESS_LIST: "ems__checkout_prefetch_address_list"
      },
      ke = {
        H5_PAY_CHECKOUT: "emsh5__pay_use_checkout",
        H5_SHOP: "emsh5__shop_use_h5"
      },
      er = mr(mr({}, ze), ke),
      Ke = {
        taobao: "tb",
        TB: "tb",
        eleme: "elmc",
        ELMC: "elmc",
        wechat: "wx",
        wx: "wx",
        alipay: "alipay",
        h5: "h5",
        douyin: "douyin",
        Douyin: "douyin",
        douyin_lite: "douyinlite"
      },
      Ir = Object.defineProperty,
      Or = Object.defineProperties,
      zr = Object.getOwnPropertyDescriptors,
      Zr = Object.getOwnPropertySymbols,
      qr = Object.prototype.hasOwnProperty,
      et = Object.prototype.propertyIsEnumerable,
      Yr = function (t, e, a) {
        return e in t ? Ir(t, e, {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: a
        }) : t[e] = a;
      },
      Mr = function (t, e) {
        for (var a in e || (e = {})) {
          if (qr.call(e, a)) {
            Yr(t, a, e[a]);
          }
        }
        if (Zr) {
          var h = (0, Te.Z)(Zr(e)),
            D;
          try {
            for (h.s(); !(D = h.n()).done;) {
              var a = D.value;
              if (et.call(e, a)) {
                Yr(t, a, e[a]);
              }
            }
          } catch (j) {
            h.e(j);
          } finally {
            h.f();
          }
        }
        return t;
      },
      rt = function (t, e) {
        return Or(t, zr(e));
      },
      kr = null,
      Kr = !1,
      tt = function () {
        function l() {
          var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
          (0, pe.Z)(this, l);
          this.isLoad = !1;
          this.key = er;
          this.schemeConfig = [];
          this.init();
          this.hijack();
        }
        return (0, je.Z)(l, [{
          key: "hijack",
          value: function () {
            var e = this,
              a = (0, c.default)().utils.navigate;
            (0, c.default)().utils.navigate = function (h) {
              if (h.targetUrl) {
                var D = e.getSchemeConfig(h.targetUrl),
                  j = (0, c.default)().utils.url.getQuery(location.href),
                  Me = j.scope;
                h.targetUrl = e.appendParams(h.targetUrl, {
                  scope: Me
                });
                if (D && D.config && D.config.scheme && /ems/gi.test(j.from) && Me != "global") try {
                  var _e = (0, c.default)().utils.url.getQuery(h.targetUrl),
                    Z = e.appendParams(D.config.scheme, _e);
                  if (D.config.isMiniapp == "true") {
                    console.log("[ems] \u5355\u9875\u964D\u7EA7\u56DE\u5F52", Z);
                    try {
                      (0, c.default)().answer.logCount({
                        id: "\u5355\u9875\u964D\u7EA7\u56DE\u5F52",
                        extra: {
                          data: h,
                          url: Z
                        }
                      });
                      (0, c.default)().answer.sendLog();
                    } catch (rr) {}
                    ebridge.openWindow({
                      url: Z
                    });
                    return;
                  }
                  h.targetUrl = Z;
                } catch (rr) {
                  console.error("[ems] jijack", {
                    error: rr,
                    data: h
                  });
                }
              }
              a(h);
            };
          }
        }, {
          key: "getSchemeConfig",
          value: function (e) {
            if (!e) return !1;
            for (var a = "", h = 0; h < this.schemeConfig.length; h++) {
              var D = this.schemeConfig[h],
                j = D.config && D.config.regex ? new RegExp(D.config.regex) : null;
              if (j && j.test(e)) {
                a = D;
                break;
              }
            }
            return a;
          }
        }, {
          key: "init",
          value: function () {
            var e = this;
            if (!(Kr || ebridge.isTB)) {
              Kr = !0;
              var a = "https://nr-op.elemecdn.com/file/mussel-ems-ems.json";
              try {
                var h = (((0, c.default)() || {}).appInfo || {}).env == "ppe" ? "-pre" : "";
                a = "https://nr-op.elemecdn.com/file/mussel" + h + "-ems-ems.json?d=" + (+new Date() / 1e4).toFixed();
              } catch (D) {}
              Lr(a).then(function (D) {
                Kr = !1;
                if (D) {
                  e.adapterRes(D);
                }
              }).catch(function (D) {
                (0, c.default)().answer.logCount({
                  id: "requestems",
                  tags: {
                    err: "err"
                  },
                  extra: {
                    ans: JSON.stringify(D)
                  }
                });
              });
            }
          }
        }, {
          key: "getH5app",
          value: function () {
            return pr();
          }
        }, {
          key: "isH5Code",
          value: function (e) {
            return /emsh5/gi.test(e);
          }
        }, {
          key: "matchH5Channel",
          value: function (e) {
            if (e) {
              var a = Tr(),
                h = e.split(",");
              return h.map(function (D) {
                var j = new RegExp(D);
                return j.test(a.params);
              })[0];
            }
          }
        }, {
          key: "adapterRes",
          value: function (e) {
            var a = this;
            try {
              var h = this.getAppVersion(),
                D = [];
              e.map(function () {
                var j = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {},
                  Me = arguments.length > 1 ? arguments[1] : void 0,
                  _e = /emsH5/gi.test(j.functionCode),
                  Z = (j.platforms || []).filter(function (ar) {
                    return _e ? ar.code.toLowerCase() === pr() : ar.code.toLowerCase() === Ke[(0, c.default)().systemInfo.app || "alipay"];
                  })[0] || {};
                if (Z.config) {
                  var rr = ye(Z.config);
                  Z.config = rr;
                }
                if (Z && Z.config && Z.config.action === "page") {
                  D.push(JSON.parse(JSON.stringify(Z)));
                }
                if (_e) {
                  if (Z.config && Z.config.channel && a.matchH5Channel(Z.config.channel)) {
                    if (Z.config.action === "page") {
                      D.push(Z);
                    }
                  } else {
                    Z = {};
                  }
                }
                if (Z.open && Z.version && Z.version[0]) {
                  Z.open = Xe(h, Z.version[0], Z.version[1]);
                }
                (0, c.default)().answer.ems[j.functionCode] = Mr(Mr({}, (0, c.default)().answer.ems[j.functionCode] || {}), Z || {});
                return j;
              });
              this.isLoad = !0;
              this.schemeConfig = D;
            } catch (j) {
              console.error("[ems \u51FA\u9519\u4E86]", j);
            }
          }
        }, {
          key: "getAppVersion",
          value: function () {
            var e = (0, c.default)().utils.platform;
            return e.IS_WX_ENV || e.IS_DY_SERIES_ENV ? ((0, c.default)().appInfo || {}).version : ((0, c.default)().pluginInfo || {}).version;
          }
        }, {
          key: "getConfig",
          value: function (e) {
            if (!(!e || !this[e])) return this[e].config;
          }
        }, {
          key: "isOpen",
          value: function (e) {
            var a = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
            try {
              var h = (0, c.default)().utils.platform;
              if (!(0, c.default)().answer.ems.isLoad || !e || !this[e]) return !1;
              var D = a || {},
                j = D.localOpen,
                Me = j === void 0 ? !1 : j,
                _e = D.query,
                Z = D.isTriggerEms,
                rr = Z === void 0 ? !0 : Z,
                ar = Me || this[e].open || !!this[e].localOpen;
              try {
                if ((0, c.default)().answer) {
                  (0, c.default)().answer.logCount({
                    id: "ems\u662F\u5426\u53EF\u964D\u7EA7",
                    tags: {
                      key: e,
                      open: ar
                    },
                    extra: {
                      data: this[e],
                      option: a
                    }
                  });
                }
              } catch (Cr) {}
              return ar ? (Me && (this[e].localOpen = Me), this[e].localOpen && delete this[e].localOpen, this[e].config && this[e].config.action === "page" && this[e].config.scheme && rr && this.goToPage({
                config: this[e].config,
                query: _e,
                key: e
              }), !0) : !1;
            } catch (Cr) {
              return !1;
            }
          }
        }, {
          key: "goToPage",
          value: function (e) {
            var a = e.config,
              h = a === void 0 ? {} : a,
              D = e.query,
              j = e.key;
            h.isH5Page = /^http/gi.test(h.scheme);
            this.getUrl(h, D);
            try {
              (0, c.default)().answer.logCount({
                id: "\u9875\u9762\u9AD8\u53EF\u7528\u964D\u7EA7",
                tags: {
                  key: j
                },
                extra: h
              });
            } catch (Me) {}
            if (dr() && !h.isH5Page && ebridge) {
              if (h.type == "redirect") {
                ebridge.back();
              }
              try {
                (0, c.default)().answer.sendLog();
              } catch (Me) {}
              ebridge.openWindow({
                url: h.url
              });
              return;
            }
            if (h.type == "redirect") {
              if (h.isH5Page && ((0, c.default)().utils.platform.IS_WX_ENV || (0, c.default)().utils.platform.IS_DY_SERIES_ENV)) {
                my.redirectTo({
                  url: "/pages/container/index?url=".concat(encodeURIComponent(h.url))
                });
                return;
              }
              (0, c.default)().utils.navigate({
                targetUrl: h.url,
                redirect: !0,
                extParams: {
                  redirect: !0
                }
              });
              return;
            }
            (0, c.default)().utils.navigate({
              targetUrl: h.url
            });
          }
        }, {
          key: "getUrl",
          value: function (e, a) {
            var h = {
              taobao: "tb",
              TB: "tb",
              eleme: "elmc",
              ELMC: "elmc",
              wechat: "wechat",
              wx: "wechat",
              alipay: "alipay",
              douyin: "douyin",
              Douyin: "douyin",
              douyin_lite: "douyinlite"
            };
            if (e.isH5Page) {
              a = rt(Mr({}, a), {
                "hide-header": 1,
                from: "mobile.ems_".concat(h[(0, c.default)().systemInfo.app || "alipay"])
              });
            }
            e.url = this.appendParams(e.scheme, Mr({}, a));
          }
        }, {
          key: "appendParams",
          value: function (e) {
            var a = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
            return (0, c.default)().utils.url.appendQueryDic(e, a);
          }
        }]);
      }(),
      nt = function (t, e) {
        if (!kr) return kr = new tt(t, e), kr;
      },
      at = nt,
      Qr,
      Gr = {
        morPlugins: [],
        setup: function (t) {
          Qr = t;
          Qr.$ele().answer.ems = at();
        },
        onShow: function () {},
        onHide: function () {}
      };
    window.$ele = c.default;
    var ot = function () {
      function l(t) {
        (0, pe.Z)(this, l);
        this.pluginName = "AppPlugin";
      }
      return (0, je.Z)(l, [{
        key: "apply",
        value: function (e) {
          e.appOnLaunch.tap({
            name: this.pluginName,
            stage: 100
          }, function () {
            console.log("[H5][Host] App|OnLaunch 0 = ", de);
            ae.getQuery(this);
            ae.setup(this);
            Gr.setup(this);
            console.debug("App|OnLaunch|getApp = ", this);
            console.debug("App|OnLaunch|$ele = ", (0, c.default)());
          });
        }
      }]);
    }();
    (0, U.aApp)({
      env: "online",
      $ele: c.default,
      onLaunch: function () {
        console.log("[H5][Host] App|OnLaunch 1");
      },
      onShow: function () {
        console.log("[H5][Host] App|onShow");
        Gr.onShow();
      },
      onHide: function () {
        console.log("[H5][Host] App|onHide");
        Gr.onHide();
      },
      doLogin: function () {
        console.log("[H5][Host] App|doLogin");
        ae.doLogin();
      }
    }, [function () {
      return {
        plugins: [new fe.Z()]
      };
    }].concat((0, Ie.Z)(ae.morPlugins), (0, Ie.Z)(Gr.morPlugins), [function () {
      return {
        plugins: [new ot()]
      };
    }]));
    Se()({});
    me.Z.setRootFontSizeForRem(16);
    var Jr = {
      pages: ["/pages/search/search", "/pages/search-result/search-result", "/pages/host-test-index/index", "/pages/webview-redirect/webview-redirect", "/pages/webview-redirect-transnavbar/webview-redirect", "/debug/pages/index/index"],
      router: {
        mode: "browser",
        baseName: "/minisearch",
        customRoutes: {
          "/pages/search/search": "/",
          "/pages/search-result/search-result": "/result"
        }
      }
    };
    Jr.routes = [{
      path: "/pages/search/search",
      loader: function () {
        return Promise.all([n.e(514), n.e(600), n.e(986), n.e(470), n.e(422)]).then(n.bind(n, "jg9X"));
      }
    }, {
      path: "/pages/search-result/search-result",
      loader: function () {
        return Promise.all([n.e(514), n.e(600), n.e(986), n.e(470), n.e(544)]).then(n.bind(n, "3qDl"));
      }
    }, {
      path: "/pages/host-test-index/index",
      loader: function () {
        return Promise.all([n.e(600), n.e(986), n.e(86)]).then(n.bind(n, "O874"));
      }
    }, {
      path: "/pages/webview-redirect/webview-redirect",
      loader: function () {
        return Promise.all([n.e(600), n.e(986), n.e(436), n.e(42)]).then(n.bind(n, "SY0s"));
      }
    }, {
      path: "/pages/webview-redirect-transnavbar/webview-redirect",
      loader: function () {
        return Promise.all([n.e(600), n.e(986), n.e(436), n.e(122)]).then(n.bind(n, "QLt3"));
      }
    }, {
      path: "/debug/pages/index/index",
      loader: function () {
        return Promise.all([n.e(600), n.e(986), n.e(796)]).then(n.bind(n, "lP8k"));
      }
    }];
    (0, ue.p7)(Jr);
  },
  s861: function (Ze) {
    Ze.exports = JSON.parse('{"pages":["pages/search/search","pages/search-result/search-result","pages/host-test-index/index","pages/webview-redirect/webview-redirect","pages/webview-redirect-transnavbar/webview-redirect","debug/pages/index/index"],"router":{"mode":"browser","baseName":"/minisearch","customRoutes":{"/pages/search/search":"/","/pages/search-result/search-result":"/result"}},"usingComponents":{}}');
  },
  KHZl: function (Ze) {
    Ze.exports = JSON.parse('{"isDebug":false,"version":"11.27.0","build_num":"1","branch":"release/2.7.0","app_id":"2021001110676437"}');
  },
  FtFw: function (Ze) {
    Ze.exports = JSON.parse('{"name":"\u641C\u7D22\u63D2\u4EF6","version":"11.22.26","update":"\u4EA7\u54C1\u4F18\u5316","buildNum":"1","pluginName":"pluginSearch","pluginId":"2021001193603467"}');
  }
}, function (Ze) {
  var Re = function (G) {
    return Ze(Ze.s = G);
  };
  Ze.O(0, [514, 600, 986], function () {
    return Re("XCS/");
  });
  var n = Ze.O();
}]);