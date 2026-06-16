(window.webpackJsonp = window.webpackJsonp || []).push([
  [77],
  {
    102: function (e, t, n) {
      "use strict";
      n.d(t, "a", function () {
        return y;
      });
      (n(9), n(54), n(79), n(6), n(73), n(36), n(11), n(12), n(7), n(21), n(40), n(30), n(8));
      var r = n(2),
        a = n(42),
        o = n(0),
        i = (n(16), n(19), n(20), n(15), n(3), n(33), n(31), n(113)),
        u = n(304),
        s = n.n(u),
        c = n(395),
        l = n(56);
      function f(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var r = Object.getOwnPropertySymbols(e);
          (t &&
            (r = r.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            n.push.apply(n, r));
        }
        return n;
      }
      function d(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? f(Object(n), !0).forEach(function (t) {
                Object(r.a)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
              : f(Object(n)).forEach(function (t) {
                  Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
                });
        }
        return e;
      }
      function p(e, t) {
        var n = ("undefined" != typeof Symbol && e[Symbol.iterator]) || e["@@iterator"];
        if (!n) {
          if (
            Array.isArray(e) ||
            (n = (function (e, t) {
              if (e) {
                if ("string" == typeof e) return g(e, t);
                var n = {}.toString.call(e).slice(8, -1);
                return (
                  "Object" === n && e.constructor && (n = e.constructor.name),
                  "Map" === n || "Set" === n
                    ? Array.from(e)
                    : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                      ? g(e, t)
                      : void 0
                );
              }
            })(e)) ||
            (t && e && "number" == typeof e.length)
          ) {
            n && (e = n);
            var r = 0,
              a = function () {};
            return {
              s: a,
              n: function () {
                return r >= e.length ? { done: !0 } : { done: !1, value: e[r++] };
              },
              e: function (e) {
                throw e;
              },
              f: a,
            };
          }
          throw new TypeError(
            "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
          );
        }
        var o,
          i = !0,
          u = !1;
        return {
          s: function () {
            n = n.call(e);
          },
          n: function () {
            var e = n.next();
            return ((i = e.done), e);
          },
          e: function (e) {
            ((u = !0), (o = e));
          },
          f: function () {
            try {
              i || null == n.return || n.return();
            } finally {
              if (u) throw o;
            }
          },
        };
      }
      function g(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
        return r;
      }
      var m = {},
        h = {},
        v = {};
      function b(e) {
        return new Promise(function (t, n) {
          var r = document.createElement("script");
          ((r.async = !0), (r.src = e), (r.onerror = n), (r.onload = t), document.head.appendChild(r));
        });
      }
      var y = (function () {
        var e = Object(o.a)(
          regeneratorRuntime.mark(function e(t, n) {
            var r,
              o,
              u,
              s,
              c,
              l,
              f,
              g,
              b,
              y,
              S,
              x,
              T,
              R,
              M,
              E = arguments;
            return regeneratorRuntime.wrap(
              function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      if (
                        ((r = E.length > 2 && void 0 !== E[2] ? E[2] : {}),
                        n instanceof File && (n = [n]),
                        (v = {}),
                        t && n)
                      ) {
                        e.next = 1;
                        break;
                      }
                      return e.abrupt("return", void 0);
                    case 1:
                      return ((o = O(t)), (u = o.bucketType), (s = o.bizType), (e.next = 2), w(u, s, n));
                    case 2:
                      ((c = []), (l = p(v.name.entries())), (e.prev = 3), l.s());
                    case 4:
                      if ((f = l.n()).done) {
                        e.next = 16;
                        break;
                      }
                      if (
                        ((g = Object(a.a)(f.value, 2)),
                        (b = g[0]),
                        (y = g[1]),
                        !r.compress || !n[b].type.includes("image") || n[b].type.includes("gif"))
                      ) {
                        e.next = 6;
                        break;
                      }
                      return ((e.next = 5), k(n[b]));
                    case 5:
                      n[b] = e.sent;
                    case 6:
                      ((S = void 0), (x = void 0), (T = 0));
                    case 7:
                      if (!(T <= 1)) {
                        e.next = 12;
                        break;
                      }
                      return (
                        (e.prev = 8),
                        (e.next = 9),
                        h[u].multipartUpload(
                          y,
                          n[b],
                          d({ headers: { "Cache-Control": "max-age=604800", "x-oss-forbid-overwrite": !0 } }, r),
                        )
                      );
                    case 9:
                      return ((S = e.sent), (x = null), e.abrupt("continue", 12));
                    case 10:
                      if (((e.prev = 10), (R = e.catch(8)), (x = R), !(++T <= 1))) {
                        e.next = 11;
                        break;
                      }
                      return ((e.next = 11), w(u, s, n));
                    case 11:
                      e.next = 7;
                      break;
                    case 12:
                      if (S && !x) {
                        e.next = 13;
                        break;
                      }
                      return (i.Message.warning("文件发送出错, 请重试"), e.abrupt("return", null));
                    case 13:
                      if (200 === S.res.statusCode) {
                        e.next = 14;
                        break;
                      }
                      return (i.Message.warning("文件发送失败, 请重试"), e.abrupt("return", null));
                    case 14:
                      c.push({ name: S.name, url: "".concat(m[u], "/").concat(S.name), key: S.name });
                    case 15:
                      e.next = 4;
                      break;
                    case 16:
                      e.next = 18;
                      break;
                    case 17:
                      ((e.prev = 17), (M = e.catch(3)), l.e(M));
                    case 18:
                      return ((e.prev = 18), l.f(), e.finish(18));
                    case 19:
                      return e.abrupt("return", c.length > 1 ? c : c[0]);
                    case 20:
                    case "end":
                      return e.stop();
                  }
              },
              e,
              null,
              [
                [3, 17, 18, 19],
                [8, 10],
              ],
            );
          }),
        );
        return function (t, n) {
          return e.apply(this, arguments);
        };
      })();
      function w(e, t, n) {
        return S.apply(this, arguments);
      }
      function S() {
        return (S = Object(o.a)(
          regeneratorRuntime.mark(function e(t, n, r) {
            var a, o, u, s, l, f;
            return regeneratorRuntime.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    for (a = [], o = 0; o < r.length; o++) ((u = r[o]), a.push(u.name));
                    return ((s = { bizType: n, objectNames: a }), (e.next = 1), Object(c.a)(s));
                  case 1:
                    if ((l = e.sent).success) {
                      e.next = 2;
                      break;
                    }
                    return (i.Message.warning("上传失败"), e.abrupt("return"));
                  case 2:
                    if (
                      ((f = {
                        accessKeyId: l.data.accessKeyId,
                        accessKeySecret: l.data.accessKeySecret,
                        bucket: l.data.bucketName,
                        region: l.data.regionId,
                        endpoint: l.data.endpoint,
                        stsToken: l.data.securityToken,
                      }),
                      (v.name = l.data.objectList),
                      (m[t] = l.data.domain),
                      window.OSS)
                    ) {
                      e.next = 3;
                      break;
                    }
                    return ((e.next = 3), b("https://oss.pzds.com/aliyun-oss-sdk-6.21.0.min.js"));
                  case 3:
                    return ((h[t] = new window.OSS(f)), e.abrupt("return", h));
                  case 4:
                  case "end":
                    return e.stop();
                }
            }, e);
          }),
        )).apply(this, arguments);
      }
      function k(e) {
        return new Promise(function (t, n) {
          new s.a(e, {
            quality: 1,
            convertSize: 1e6,
            success: function (e) {
              t(e);
            },
            error: function (e) {
              n(new Error(e.message));
            },
          });
        });
      }
      function O(e) {
        var t = {};
        for (var n in l.b) {
          var r = l.b[n];
          for (var a in r.uploadTypes)
            if (r.uploadTypes[a].value === e) {
              Object.assign(t, d({ bucketType: n, bizType: r.uploadTypes[a].key }, r));
              break;
            }
        }
        return t;
      }
    },
    111: function (e, t, n) {
      "use strict";
      (n.d(t, "a", function () {
        return u;
      }),
        n.d(t, "b", function () {
          return s;
        }));
      (n(3), n(40));
      var r = n(213),
        a = n.n(r),
        o = a.a.enc.Utf8.parse("5750410542ABCDEF"),
        i = a.a.enc.Utf8.parse("DCVSJH5750410542");
      function u(e) {
        if (!e) return "";
        var t = a.a.AES.decrypt(a.a.format.Hex.parse(e), o, { iv: i, mode: a.a.mode.CBC, padding: a.a.pad.Pkcs7 });
        return a.a.enc.Utf8.stringify(t);
      }
      function s(e) {
        return e
          ? a.a.AES.encrypt(e, o, { iv: i, mode: a.a.mode.CBC, padding: a.a.pad.Pkcs7 }).ciphertext.toString()
          : "";
      }
    },
    114: function (e, t, n) {
      "use strict";
      (n.d(t, "d", function () {
        return a;
      }),
        n.d(t, "f", function () {
          return o;
        }),
        n.d(t, "b", function () {
          return i;
        }),
        n.d(t, "c", function () {
          return u;
        }),
        n.d(t, "a", function () {
          return s;
        }),
        n.d(t, "g", function () {
          return c;
        }),
        n.d(t, "e", function () {
          return l;
        }));
      var r = n(51);
      function a(e) {
        return "pz_private_medium_draft_".concat(e);
      }
      function o(e) {
        return !(!e || "object" !== Object(r.a)(e)) && 1 === e.status;
      }
      function i(e) {
        if (!e) return "";
        var t = null != e.buyerPzId ? e.buyerPzId : e.buyerId;
        return null != t && "" !== t ? String(t) : "";
      }
      function u(e) {
        if (!e) return "";
        var t = null != e.price ? e.price : e.goodsPrice;
        return null != t && "" !== t ? String(t) : "";
      }
      function s(e) {
        if (!e || "object" !== Object(r.a)(e)) return "";
        var t = null != e.userId ? e.userId : null != e.buyerUserId ? e.buyerUserId : e.buyerId;
        return null != t && "" !== t ? String(t) : "";
      }
      function c(e, t) {
        var n = {};
        if (null == e || !e.privateId) return n;
        ((n.privateId = e.privateId),
          e.intermediary && (n.intermediary = e.intermediary),
          e.orderNo && (n.orderNo = e.orderNo));
        var r = i(e) || s(t);
        r && (n.buyerPzId = r);
        var a = u(e);
        return (a && (n.price = a), n);
      }
      function l(e) {
        var t;
        if (null == e || null === (t = e.query) || void 0 === t || !t.privateId) return !1;
        var n = e.path;
        if ("/selectGame" === n) {
          var r = e.query.intermediary;
          return "true" === r || !0 === r;
        }
        return "/mediumServe" === n;
      }
    },
    115: function (e, t, n) {
      "use strict";
      (n.r(t),
        n.d(t, "getTimeStamp", function () {
          return m;
        }),
        n.d(t, "getSignature", function () {
          return v;
        }),
        n.d(t, "getWasmSignature", function () {
          return w;
        }),
        n.d(t, "getOS", function () {
          return S;
        }));
      (n(9), n(6), n(11), n(12), n(8));
      var r = n(0),
        a = n(2),
        o = (n(16), n(20), n(53), n(23), n(71), n(18), n(7), n(3), n(21), n(33), n(27), n(110)),
        i = n.n(o),
        u = n(192);
      function s(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var r = Object.getOwnPropertySymbols(e);
          (t &&
            (r = r.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            n.push.apply(n, r));
        }
        return n;
      }
      function c(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? s(Object(n), !0).forEach(function (t) {
                Object(a.a)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
              : s(Object(n)).forEach(function (t) {
                  Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
                });
        }
        return e;
      }
      (n.d(t, "isGrayApi", function () {
        return u.isGrayApi;
      }),
        n.d(t, "isWasmSignApi", function () {
          return u.isWasmSignApi;
        }));
      var l = n(225),
        f = n(222);
      function d(e, t) {
        try {
          "undefined" != typeof window &&
            window.$nuxt &&
            "function" == typeof window.$nuxt.$trackEvent &&
            window.$nuxt.$trackEvent({ eventType: e, trackParams: c(c({}, t), {}, { eventName: e }) });
        } catch (e) {}
      }
      var p = null,
        g = null;
      function m() {
        return h.apply(this, arguments);
      }
      function h() {
        return (
          (h = Object(r.a)(
            regeneratorRuntime.mark(function e() {
              var t, n;
              return regeneratorRuntime.wrap(function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      if (
                        ((n = function () {
                          return (n = Object(r.a)(
                            regeneratorRuntime.mark(function e() {
                              var t, n;
                              return regeneratorRuntime.wrap(
                                function (e) {
                                  for (;;)
                                    switch ((e.prev = e.next)) {
                                      case 0:
                                        return (
                                          (e.prev = 0),
                                          (e.next = 1),
                                          fetch("".concat(l[f.env].ENV_TIME_API, "/server/time"))
                                        );
                                      case 1:
                                        if ((t = e.sent).ok) {
                                          e.next = 2;
                                          break;
                                        }
                                        throw new Error("HTTP error! Status: ".concat(t.status));
                                      case 2:
                                        return ((e.next = 3), t.json());
                                      case 3:
                                        ((n = e.sent) && (p = n.data - Date.now()), (e.next = 5));
                                        break;
                                      case 4:
                                        ((e.prev = 4), e.catch(0));
                                      case 5:
                                      case "end":
                                        return e.stop();
                                    }
                                },
                                e,
                                null,
                                [[0, 4]],
                              );
                            }),
                          )).apply(this, arguments);
                        }),
                        (t = function () {
                          return n.apply(this, arguments);
                        }),
                        null === p)
                      ) {
                        e.next = 1;
                        break;
                      }
                      return e.abrupt("return", Date.now() + p);
                    case 1:
                      return (g || (g = t()), (e.next = 2), g);
                    case 2:
                      return e.abrupt("return", Date.now() + p);
                    case 3:
                    case "end":
                      return e.stop();
                  }
              }, e);
            }),
          )),
          h.apply(this, arguments)
        );
      }
      var v = (function () {
        var e = Object(r.a)(
          regeneratorRuntime.mark(function e(t, n) {
            var r,
              a,
              o,
              u,
              s,
              l,
              f,
              d,
              p,
              g,
              h,
              v,
              b,
              y,
              w,
              S,
              k = arguments;
            return regeneratorRuntime.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    if (((r = k.length > 2 && void 0 !== k[2] && k[2]), (a = n ? t : c({}, t)), !r)) {
                      e.next = 1;
                      break;
                    }
                    ((S = Date.now()), (e.next = 3));
                    break;
                  case 1:
                    return ((e.next = 2), m());
                  case 2:
                    S = e.sent;
                  case 3:
                    for (o = S, "", s = "", l = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9), f = 0; f < 6; f++)
                      ((d = Math.floor(9 * Math.random())), (s += l[d]));
                    if (((u = Number(s)), (p = []), n))
                      a
                        ? p.push(
                            "PZTimestamp=" +
                              o +
                              "&Random=" +
                              u +
                              "&2147483647=" +
                              encodeURIComponent(JSON.stringify(a)),
                          )
                        : p.push("PZTimestamp=" + o + "&Random=" + u + "=" + encodeURIComponent(JSON.stringify(a)));
                    else {
                      for (v in ((a.PZTimestamp = o),
                      (a.Random = u),
                      (g = (g = Object.keys(a).sort()).sort(function (e, t) {
                        return e - t;
                      })),
                      (h = {}),
                      g))
                        (a[g[v]] instanceof Array && a[g[v]] instanceof Object && (a[g[v]] = JSON.stringify(a[g[v]])),
                          (h[g[v]] = encodeURIComponent(a[g[v]])));
                      for (b in (a = h)) (n || ("null" !== a[b] && "undefined" !== a[b])) && p.push(b + "=" + a[b]);
                    }
                    return (
                      (y = p.join("&") + "&accessKey=3qXyB7uf"),
                      (O = void 0),
                      (O = y.replace(/[(]/g, "%28")),
                      (y = O =
                        (O = (O = (O = (O = O.replace(/[)]/g, "%29")).replace(/[']/g, "%27")).replace(
                          /[*]/g,
                          "%2A",
                        )).replace(/[~]/g, "%7E")).replace(/[!！]/g, "%21")),
                      (w = i()(y)),
                      e.abrupt("return", { Timestamp: o, strMd5: w, Random: u })
                    );
                  case 4:
                  case "end":
                    return e.stop();
                }
              var O;
            }, e);
          }),
        );
        return function (t, n) {
          return e.apply(this, arguments);
        };
      })();
      function b(e, t, n) {
        return y.apply(this, arguments);
      }
      function y() {
        return (y = Object(r.a)(
          regeneratorRuntime.mark(function e(t, n, r) {
            var a;
            return regeneratorRuntime.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return ((e.next = 1), v(t, n, r));
                  case 1:
                    return (
                      (a = e.sent),
                      e.abrupt("return", {
                        Timestamp: a.Timestamp,
                        sign: a.strMd5,
                        Random: a.Random,
                        version: void 0,
                        isCandidateVersion: !1,
                      })
                    );
                  case 2:
                  case "end":
                    return e.stop();
                }
            }, e);
          }),
        )).apply(this, arguments);
      }
      var w = (function () {
        var e = Object(r.a)(
          regeneratorRuntime.mark(function e(t, n) {
            var r,
              a,
              o,
              i,
              s,
              c,
              l,
              f,
              p,
              g,
              h,
              v,
              y,
              w,
              S,
              k,
              O,
              x,
              T,
              R,
              M,
              E,
              j,
              P,
              I,
              A,
              C,
              D,
              _,
              N,
              F,
              L,
              U,
              $,
              z,
              W,
              G,
              H,
              B,
              V = arguments;
            return regeneratorRuntime.wrap(
              function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      ((r = V.length > 2 && void 0 !== V[2] ? V[2] : ""),
                        (a = V.length > 3 && void 0 !== V[3] && V[3]),
                        (e.next = 9));
                      break;
                    case 1:
                      return ((e.prev = 1), (e.next = 2), Object(u.getServerSignFunction)(r));
                    case 2:
                      if (
                        ((o = e.sent),
                        (i = o.generateSign),
                        (s = o.version),
                        (c = o.isCandidateVersion),
                        "function" != typeof i)
                      ) {
                        e.next = 6;
                        break;
                      }
                      if (!a) {
                        e.next = 3;
                        break;
                      }
                      ((G = Date.now()), (e.next = 5));
                      break;
                    case 3:
                      return ((e.next = 4), m());
                    case 4:
                      G = e.sent;
                    case 5:
                      for (l = G, f = "", p = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9), g = 0; g < 6; g++)
                        ((h = Math.floor(9 * Math.random())), (f += p[h]));
                      if (
                        ((v = Number(f)),
                        (y = JSON.stringify(null != t ? t : {})),
                        (w = String(n || "GET")),
                        (S = String(l)),
                        (k = String(v)),
                        !(O = i(y, w, S, k)))
                      ) {
                        e.next = 6;
                        break;
                      }
                      return e.abrupt("return", {
                        Timestamp: l,
                        sign: O,
                        Random: v,
                        version: s,
                        isCandidateVersion: c,
                      });
                    case 6:
                      e.next = 8;
                      break;
                    case 7:
                      ((e.prev = 7), e.catch(1));
                    case 8:
                      return e.abrupt("return", b(t, n, a));
                    case 9:
                      if (Object(u.isWasmSignApi)(r)) {
                        e.next = 10;
                        break;
                      }
                      return e.abrupt("return", b(t, n, a));
                    case 10:
                      for (x = "", T = new Array(1, 2, 3, 4, 5, 6, 7, 8, 9), R = 0; R < 6; R++)
                        ((M = Math.floor(9 * Math.random())), (x += T[M]));
                      if (((E = Number(x)), !a)) {
                        e.next = 11;
                        break;
                      }
                      ((H = Date.now()), (e.next = 13));
                      break;
                    case 11:
                      return ((e.next = 12), m());
                    case 12:
                      H = e.sent;
                    case 13:
                      return (
                        (j = H),
                        (P = JSON.stringify(null != t ? t : {})),
                        (I = String(n || "GET")),
                        (A = String(j)),
                        (C = String(E)),
                        (N = !1),
                        (F = null),
                        (e.prev = 14),
                        (e.next = 15),
                        Object(u.getSignFunction)(r)
                      );
                    case 15:
                      if (
                        ((L = e.sent),
                        (U = L.generateSign),
                        ($ = L.version),
                        (z = L.isCandidateVersion),
                        (W = L.fallbackSign),
                        (_ = $),
                        (N = z),
                        (F = W),
                        "function" == typeof U && (D = U(P, I, A, C)),
                        D)
                      ) {
                        e.next = 16;
                        break;
                      }
                      if ("function" == typeof F) {
                        d("wasm_sign_fallback", {
                          apiUrl: r,
                          isWasmSignApi: !0,
                          info: "wasm生成sign为空，进入JS降级签名",
                        });
                        try {
                          D = F(P, I, A, C);
                        } catch (e) {}
                      }
                      if (D) {
                        e.next = 16;
                        break;
                      }
                      return e.abrupt("return", b(t, n, a));
                    case 16:
                      e.next = 22;
                      break;
                    case 17:
                      if (((e.prev = 17), (B = e.catch(14)), "function" != typeof F)) {
                        e.next = 21;
                        break;
                      }
                      ((e.prev = 18),
                        d("wasm_sign_fallback", {
                          apiUrl: r,
                          isWasmSignApi: !0,
                          info: "wasm失败，进入JS降级签名，e：" + (B && (B.message || String(B))),
                        }),
                        (D = F(P, I, A, C)),
                        (e.next = 20));
                      break;
                    case 19:
                      return ((e.prev = 19), e.catch(18), e.abrupt("return", b(t, n, a)));
                    case 20:
                      e.next = 22;
                      break;
                    case 21:
                      return e.abrupt("return", b(t, n, a));
                    case 22:
                      return e.abrupt("return", {
                        Timestamp: j,
                        sign: D,
                        Random: E,
                        version: _,
                        isCandidateVersion: N,
                      });
                    case 23:
                    case "end":
                      return e.stop();
                  }
              },
              e,
              null,
              [
                [1, 7],
                [14, 17],
                [18, 19],
              ],
            );
          }),
        );
        return function (t, n) {
          return e.apply(this, arguments);
        };
      })();
      function S() {
        var e = navigator.userAgent,
          t = navigator.userAgentData,
          n = "windows";
        if (t) {
          var r =
            t.platform ||
            t.brands
              .map(function (e) {
                return e.brand;
              })
              .join(" ");
          r.includes("Windows")
            ? (n = "windows")
            : r.includes("macOS") || r.includes("Macintosh")
              ? (n = "Mac")
              : r.includes("iOS") || r.includes("iPhone") || r.includes("iPad") || r.includes("iPod")
                ? (n = "ios")
                : r.includes("Android")
                  ? (n = "android")
                  : r.includes("Linux") && (n = "linux");
        } else
          /Windows/i.test(e)
            ? (n = "windows")
            : /Mac/i.test(e)
              ? (n = "Mac")
              : /iPhone|iPad|iPod/i.test(e)
                ? (n = "ios")
                : /Android/i.test(e)
                  ? (n = "android")
                  : /Linux/i.test(e) && (n = "linux");
        return n;
      }
    },
    1162: function (e, t, n) {
      "use strict";
      n.d(t, "a", function () {
        return r;
      });
      n(19);
      function r(e, t) {
        if (e && t && t.$store && t.$router) {
          var r = encodeURIComponent(e),
            a = n(222),
            o = (n(225), a.env || "development"),
            i = t.$store.state.user.token,
            u = t.$store.state.user.userinfo;
          if (!!(i && u && u.id)) {
            var s = ""
              .concat(
                {
                  development: "http://apph5.jinliwangluo.com",
                  dev: "http://apph5.jinliwangluo.com",
                  test: "https://apph5.yingbowl.com",
                  production: "https://apph5.pzds.com",
                  prod: "https://apph5.pzds.com",
                  pre: "https://apph5.pzpre.com",
                }[o],
                "/#/fkActivity?fkUrl=",
              )
              .concat(r, "&token=")
              .concat(i, "&client=h5");
            window.open(s, "_blank");
          } else t.$router.push("/login?type=fkhd&fkUrl=".concat(r));
        }
      }
    },
    14: function (e, t, n) {
      "use strict";
      (n.r(t),
        n.d(t, "copyToClip", function () {
          return l;
        }),
        n.d(t, "conversationTime", function () {
          return f;
        }),
        n.d(t, "timeFilter", function () {
          return d;
        }),
        n.d(t, "compressImage", function () {
          return p;
        }),
        n.d(t, "toBase64", function () {
          return g;
        }),
        n.d(t, "imageUrlToBase64", function () {
          return m;
        }),
        n.d(t, "comporessImgToTargetSize_IMG_MSG_CONTENT", function () {
          return h;
        }),
        n.d(t, "compressImages", function () {
          return v;
        }),
        n.d(t, "fileToBase64", function () {
          return b;
        }),
        n.d(t, "compressImgs", function () {
          return y;
        }),
        n.d(t, "random_string", function () {
          return S;
        }),
        n.d(t, "isInViewPort", function () {
          return k;
        }),
        n.d(t, "isChildOutOfView", function () {
          return O;
        }),
        n.d(t, "getTimeDifference", function () {
          return x;
        }),
        n.d(t, "deepClone", function () {
          return T;
        }),
        n.d(t, "debounce", function () {
          return R;
        }),
        n.d(t, "throttle", function () {
          return M;
        }),
        n.d(t, "addQueryParams", function () {
          return E;
        }),
        n.d(t, "fixTime", function () {
          return j;
        }),
        n.d(t, "imLinkJump", function () {
          return P;
        }),
        n.d(t, "pzLoginStorage", function () {
          return I;
        }),
        n.d(t, "calculateInstallmentAmount", function () {
          return A;
        }),
        n.d(t, "formatCount", function () {
          return C;
        }),
        n.d(t, "fixApiTimeToUTC8", function () {
          return D;
        }),
        n.d(t, "getReleaseTimeString", function () {
          return _;
        }),
        n.d(t, "checkHashType", function () {
          return N;
        }),
        n.d(t, "recordGoodsReadStatus", function () {
          return F;
        }),
        n.d(t, "getGoodsReadStatus", function () {
          return L;
        }),
        n.d(t, "fitToWebp", function () {
          return U;
        }));
      var r = n(0),
        a =
          (n(16),
          n(9),
          n(54),
          n(79),
          n(19),
          n(6),
          n(73),
          n(20),
          n(36),
          n(15),
          n(18),
          n(211),
          n(57),
          n(7),
          n(3),
          n(21),
          n(40),
          n(235),
          n(33),
          n(30),
          n(195),
          n(27),
          n(160),
          n(8),
          n(31),
          n(28),
          n(159),
          n(113)),
        o = n.n(a),
        i = n(304),
        u = n.n(i);
      function s(e, t) {
        var n = ("undefined" != typeof Symbol && e[Symbol.iterator]) || e["@@iterator"];
        if (!n) {
          if (
            Array.isArray(e) ||
            (n = (function (e, t) {
              if (e) {
                if ("string" == typeof e) return c(e, t);
                var n = {}.toString.call(e).slice(8, -1);
                return (
                  "Object" === n && e.constructor && (n = e.constructor.name),
                  "Map" === n || "Set" === n
                    ? Array.from(e)
                    : "Arguments" === n || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)
                      ? c(e, t)
                      : void 0
                );
              }
            })(e)) ||
            (t && e && "number" == typeof e.length)
          ) {
            n && (e = n);
            var r = 0,
              a = function () {};
            return {
              s: a,
              n: function () {
                return r >= e.length ? { done: !0 } : { done: !1, value: e[r++] };
              },
              e: function (e) {
                throw e;
              },
              f: a,
            };
          }
          throw new TypeError(
            "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
          );
        }
        var o,
          i = !0,
          u = !1;
        return {
          s: function () {
            n = n.call(e);
          },
          n: function () {
            var e = n.next();
            return ((i = e.done), e);
          },
          e: function (e) {
            ((u = !0), (o = e));
          },
          f: function () {
            try {
              i || null == n.return || n.return();
            } finally {
              if (u) throw o;
            }
          },
        };
      }
      function c(e, t) {
        (null == t || t > e.length) && (t = e.length);
        for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
        return r;
      }
      function l(e, t) {
        var n = document.createElement("input");
        (n.setAttribute("value", e),
          document.body.appendChild(n),
          n.select(),
          document.execCommand("copy"),
          document.body.removeChild(n),
          null == t
            ? o.a.Message({ message: "复制成功", type: "success" })
            : o.a.Message({ message: t, type: "success" }));
      }
      function f(e) {
        var t = new Date(e),
          n = t.getFullYear(),
          r = t.getMonth() + 1,
          a = t.getDate(),
          o = t.getHours(),
          i = t.getMinutes();
        t.getSeconds();
        return (function (e) {
          var t = new Date(e.replace(/-/g, "/")),
            n = new Date();
          return t.setHours(0, 0, 0, 0) == n.setHours(0, 0, 0, 0);
        })("".concat(n, "-").concat(r, "-").concat(a))
          ? "".concat(o, ":").concat(i < 10 ? "0" + i : i)
          : "".concat(r, "-").concat(a);
      }
      function d(e) {
        if (!e) return e;
        var t = new Date(e),
          n = new Date();
        return (e =
          t.getFullYear() == n.getFullYear() && t.getMonth() == n.getMonth() && t.getDate() == n.getDate()
            ? "".concat(Number(t.getHours()) < 10 ? "0" + t.getHours() : t.getHours()) +
              ":" +
              "".concat(Number(t.getMinutes()) < 10 ? "0" + t.getMinutes() : t.getMinutes())
            : t.getFullYear() == n.getFullYear() && t.getMonth() == n.getMonth() && n.getDate() - t.getDate() == 1
              ? "昨天 "
                  .concat(Number(t.getHours()) < 10 ? "0" + t.getHours() : t.getHours(), ":")
                  .concat(Number(t.getMinutes()) < 10 ? "0" + t.getMinutes() : t.getMinutes())
              : t.getFullYear() == n.getFullYear()
                ? t.getMonth() +
                  1 +
                  "月" +
                  t.getDate() +
                  "日 " +
                  "".concat(Number(t.getHours()) < 10 ? "0" + t.getHours() : t.getHours()) +
                  ":" +
                  "".concat(Number(t.getMinutes()) < 10 ? "0" + t.getMinutes() : t.getMinutes())
                : t.getFullYear() +
                  "年" +
                  (t.getMonth() + 1) +
                  "月" +
                  t.getDate() +
                  "日 " +
                  "".concat(Number(t.getHours()) < 10 ? "0" + t.getHours() : t.getHours()) +
                  ":" +
                  "".concat(Number(t.getMinutes()) < 10 ? "0" + t.getMinutes() : t.getMinutes()));
      }
      function p(e, t) {
        return new Promise(
          (function () {
            var n = Object(r.a)(
              regeneratorRuntime.mark(function n(r, a) {
                var o, i, u;
                return regeneratorRuntime.wrap(function (n) {
                  for (;;)
                    switch ((n.prev = n.next)) {
                      case 0:
                        ((o = e),
                          (i = 1024 * t),
                          ((u = new Image()).src = o),
                          (u.onload = function () {
                            try {
                              var e = 0.95,
                                t = document.createElement("canvas"),
                                n = t.getContext("2d");
                              (n.clearRect(0, 0, t.width, t.height), n.drawImage(this, 0, 0, t.width, t.height));
                              for (var o = t.toDataURL("image/jpeg", e); o.length > i; )
                                ((e -= 0.05), (o = t.toDataURL("image/jpeg", e)));
                              r(o.split(",")[1]);
                            } catch (e) {
                              a(e);
                            }
                          }));
                      case 1:
                      case "end":
                        return n.stop();
                    }
                }, n);
              }),
            );
            return function (e, t) {
              return n.apply(this, arguments);
            };
          })(),
        );
      }
      function g(e) {
        return new Promise(
          (function () {
            var t = Object(r.a)(
              regeneratorRuntime.mark(function t(n, r) {
                var a, o;
                return regeneratorRuntime.wrap(function (t) {
                  for (;;)
                    switch ((t.prev = t.next)) {
                      case 0:
                        ((a = new FileReader()),
                          (o = /^data:image\/\w+;base64,/),
                          (a.onload = function (e) {
                            var t = e.target.result.replace(o, "");
                            n(t);
                          }),
                          a.readAsDataURL(e));
                      case 1:
                      case "end":
                        return t.stop();
                    }
                }, t);
              }),
            );
            return function (e, n) {
              return t.apply(this, arguments);
            };
          })(),
        );
      }
      function m(e) {
        return new Promise(function (t, n) {
          var r = new XMLHttpRequest();
          (r.open("GET", e, !0),
            (r.responseType = "blob"),
            (r.onload = function () {
              if (200 === this.status) {
                var e = new FileReader();
                (e.readAsDataURL(this.response),
                  (e.onloadend = function () {
                    var n = e.result;
                    t(n);
                  }));
              } else n(new Error(this.statusText));
            }),
            (r.onerror = function () {
              n(new Error("Network error"));
            }),
            r.send());
        });
      }
      function h(e, t) {
        function n() {
          return (
            (n = Object(r.a)(
              regeneratorRuntime.mark(function e(t, n) {
                var r, a, o, i;
                return regeneratorRuntime.wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          ((r = t), (a = t.size), (o = 0.8), (i = !1));
                        case 1:
                          if (!(a > n && o > 0) || i) {
                            e.next = 6;
                            break;
                          }
                          return (
                            (c = 0.2),
                            (l = void 0),
                            (f = void 0),
                            (d = void 0),
                            (l = ((s = o).toString().split(".")[1] || "").length),
                            (f = (c.toString().split(".")[1] || "").length),
                            (d = Math.pow(10, Math.max(l, f))),
                            (o = (s * d - c * d) / d),
                            (e.prev = 2),
                            (e.next = 3),
                            new Promise(function (e, t) {
                              var n = 10 * o;
                              new u.a(r, {
                                width: 20 * n,
                                quality: o,
                                success: function (t) {
                                  ((r = t), (a = t.size), e());
                                },
                                error: function (e) {
                                  t(e);
                                },
                              });
                            })
                          );
                        case 3:
                          e.next = 5;
                          break;
                        case 4:
                          ((e.prev = 4), e.catch(2), (i = !0));
                        case 5:
                          e.next = 1;
                          break;
                        case 6:
                          return (o <= 0 && (i = !0), e.abrupt("return", { currentFile: r, isError: i }));
                        case 7:
                        case "end":
                          return e.stop();
                      }
                    var s, c, l, f, d;
                  },
                  e,
                  null,
                  [[2, 4]],
                );
              }),
            )),
            n.apply(this, arguments)
          );
        }
        return new Promise(function (r, a) {
          e instanceof File || e instanceof Blob
            ? (function (e, t) {
                return n.apply(this, arguments);
              })(e, t)
                .then(function (e) {
                  var t = e.currentFile,
                    n = e.isError;
                  r({ res: t, success: !n });
                })
                .catch(function (e) {
                  a(e);
                })
            : a(new Error("Invalid input: not a File or Blob object."));
        });
      }
      function v(e, t) {
        return new Promise(
          (function () {
            var n = Object(r.a)(
              regeneratorRuntime.mark(function n(r, a) {
                return regeneratorRuntime.wrap(function (n) {
                  for (;;)
                    switch ((n.prev = n.next)) {
                      case 0:
                        if (e instanceof File || e instanceof Blob) {
                          n.next = 1;
                          break;
                        }
                        return (a(new Error("你传进来的文件类型不是blob或file.")), n.abrupt("return"));
                      case 1:
                        y(e, t)
                          .then(function (e) {
                            r(e);
                          })
                          .catch(function (e) {
                            a(e);
                          });
                      case 2:
                      case "end":
                        return n.stop();
                    }
                }, n);
              }),
            );
            return function (e, t) {
              return n.apply(this, arguments);
            };
          })(),
        );
      }
      function b(e) {
        return new Promise(function (t, n) {
          if (e instanceof File || e instanceof Blob) {
            var r = new FileReader();
            ((r.onload = function () {
              t(r.result);
            }),
              (r.onerror = function () {
                n(new Error("Failed to read file or blob."));
              }),
              r.readAsDataURL(e));
          } else n(new Error("Invalid input: not a File or Blob object."));
        });
      }
      function y(e, t) {
        return w.apply(this, arguments);
      }
      function w() {
        return (
          (w = Object(r.a)(
            regeneratorRuntime.mark(function e(t, n) {
              var a, o, i;
              return regeneratorRuntime.wrap(function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      ((a = t), (o = t.size), (i = 1));
                    case 1:
                      if (!(o > n && i > 0)) {
                        e.next = 3;
                        break;
                      }
                      return (
                        (i -= 0.1),
                        (e.next = 2),
                        new Promise(
                          (function () {
                            var e = Object(r.a)(
                              regeneratorRuntime.mark(function e(t, n) {
                                return regeneratorRuntime.wrap(function (e) {
                                  for (;;)
                                    switch ((e.prev = e.next)) {
                                      case 0:
                                        new u.a(a, {
                                          width: 480 * i,
                                          quality: i,
                                          success: function (e) {
                                            ((a = e), (o = e.size), t());
                                          },
                                          error: function (e) {
                                            n(e);
                                          },
                                        });
                                      case 1:
                                      case "end":
                                        return e.stop();
                                    }
                                }, e);
                              }),
                            );
                            return function (t, n) {
                              return e.apply(this, arguments);
                            };
                          })(),
                        )
                      );
                    case 2:
                      e.next = 1;
                      break;
                    case 3:
                      if (!(i <= 0)) {
                        e.next = 4;
                        break;
                      }
                      throw new Error("图片压缩失败,compress quality <= 0");
                    case 4:
                      return e.abrupt("return", a);
                    case 5:
                    case "end":
                      return e.stop();
                  }
              }, e);
            }),
          )),
          w.apply(this, arguments)
        );
      }
      function S(e) {
        e = e || 32;
        for (var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678", n = "", r = 0; r < e; r++)
          n += t.charAt(Math.floor(48 * Math.random()));
        return n;
      }
      function k(e) {
        var t = window.innerWidth || document.documentElement.clientWidth,
          n = window.innerHeight || document.documentElement.clientHeight,
          r = e.getBoundingClientRect(),
          a = r.top,
          o = r.right,
          i = r.bottom,
          u = r.left;
        return a >= 0 && u >= 0 && o <= t && i <= n;
      }
      function O(e, t) {
        var n = e.getBoundingClientRect(),
          r = t.getBoundingClientRect(),
          a = r.bottom < n.top,
          o = r.top > n.bottom;
        return a || o;
      }
      function x(e, t) {
        return Math.abs(e - t);
      }
      function T(e) {
        function t(e) {
          return Object.prototype.toString.call(e).slice(8, -1);
        }
        var n,
          r = t(e);
        if ("object" === r) n = {};
        else {
          if ("Array" !== r) return e;
          n = [];
        }
        for (var a in e) {
          var o = e[a];
          "Object" === t(o) || "Array" === t(o) ? (n[a] = T(o)) : (n[a] = o);
        }
        return n;
      }
      function R(e) {
        var t,
          n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 300,
          r = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2];
        return function () {
          var a = this,
            o = arguments;
          (r && !t && e.apply(a, o),
            clearTimeout(t),
            (t = setTimeout(function () {
              (r || e.apply(a, o), (t = null));
            }, n)));
        };
      }
      function M(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 300,
          n = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2],
          r = null;
        return function () {
          var a = this,
            o = arguments;
          n
            ? r ||
              ((r = setTimeout(function () {
                r = null;
              }, t)),
              e.apply(a, o))
            : r ||
              (r = setTimeout(function () {
                ((r = null), e.apply(a, o));
              }, t));
        };
      }
      function E(e) {
        var t = window.location.href,
          n = new URLSearchParams(t.split("?")[1] || "");
        for (var r in e) n.set(r, e[r]);
        var a = "".concat(t.split("?")[0], "?").concat(n.toString());
        history.pushState({}, null, a);
      }
      function j(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 8;
        if (!e) return e;
        var n = new Date(e.replace(/-/g, "/"));
        return n.getTime() - 6e4 * n.getTimezoneOffset() - 36e5 * t;
      }
      function P(e) {
        return "/goodsDetails/".concat(e.goodsId, "/").concat(e.goodsCatalogueId);
      }
      function I() {
        var e = { loggedOut: "0", loggedIn: "1", pending: "2" },
          t = "pzLoginStatus";
        return {
          key: t,
          onLoggedIn: function () {
            localStorage.setItem(t, e.loggedIn);
          },
          onPending: function () {
            localStorage.setItem(t, e.pending);
          },
          onLoggedOut: function () {
            localStorage.setItem(t, e.loggedOut);
          },
          onRemove: function () {
            localStorage.removeItem(t);
          },
          status: e,
        };
      }
      function A(e, t, n) {
        var r = Math.round(100 * e),
          a = Math.floor(r / t),
          o = Math.round((r * n) / 100),
          i = Math.floor(o / t),
          u = a + i;
        return { feePerMonth: (i / 100).toFixed(2), totalPerMonth: (u / 100).toFixed(2) };
      }
      function C(e) {
        if (null == e || Number.isNaN(e)) return 0;
        var t = Number(e);
        if (t < 1e4) return t;
        if (1e4 === t) return "1w";
        var n = Math.ceil(t / 1e3) / 10;
        return "".concat(n.toFixed(1), "w");
      }
      function D(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 8;
        return e ? new Date(e.replace(/-/g, "/")).getTime() - 6e4 * new Date().getTimezoneOffset() - 36e5 * t : e;
      }
      function _(e) {
        if (!e) return "";
        var t = D(e),
          n = Date.now() - t;
        if (n <= 0) return "";
        var r = 6e4,
          a = 36e5;
        if (n < r) return "刚刚发布";
        if (n < a) {
          var o = Math.floor(n / r);
          return "".concat(o, "分钟前发布");
        }
        if (n < 864e5) {
          var i = Math.floor(n / a),
            u = Math.min(i, 23);
          return "".concat(u, "小时前发布");
        }
        return "";
      }
      function N(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [],
          n = e.charAt(0);
        if (/＃/.test(n) || /#/.test(n)) return !0;
        if (!t || 0 === t.length) return !1;
        var r = ["customPassword", "springFestivalActivity"],
          a = t.filter(function (e) {
            return r.includes(e.type);
          });
        if (0 === a.length) return !1;
        var o,
          i = s(a);
        try {
          for (i.s(); !(o = i.n()).done; ) {
            var u = o.value;
            if (u.rules) {
              var c,
                l = s(u.rules);
              try {
                for (l.s(); !(c = l.n()).done; ) {
                  var f = c.value,
                    d = f.rule,
                    p = f.value;
                  if (p && Array.isArray(p)) {
                    var g,
                      m = s(p);
                    try {
                      for (m.s(); !(g = m.n()).done; ) {
                        var h = g.value;
                        if (h) {
                          var v = !1;
                          switch (d) {
                            case "prefix":
                              v = e.startsWith(h);
                              break;
                            case "suffix":
                              v = e.endsWith(h);
                              break;
                            case "include":
                              v = e.includes(h);
                          }
                          if (v) return !0;
                        }
                      }
                    } catch (e) {
                      m.e(e);
                    } finally {
                      m.f();
                    }
                  }
                }
              } catch (e) {
                l.e(e);
              } finally {
                l.f();
              }
            }
          }
        } catch (e) {
          i.e(e);
        } finally {
          i.f();
        }
        return !1;
      }
      function F(e) {
        try {
          if ("undefined" == typeof window || !window.localStorage) return;
          var t = new Date(),
            n = ""
              .concat(t.getFullYear(), "-")
              .concat(String(t.getMonth() + 1).padStart(2, "0"), "-")
              .concat(String(t.getDate()).padStart(2, "0")),
            r = new Date(t);
          r.setDate(t.getDate() - 3);
          var a = ""
              .concat(r.getFullYear(), "-")
              .concat(String(r.getMonth() + 1).padStart(2, "0"), "-")
              .concat(String(r.getDate()).padStart(2, "0")),
            o = "goods_read_status",
            i = localStorage.getItem(o),
            u = i ? JSON.parse(i) : {},
            s = {};
          (Object.keys(u).forEach(function (e) {
            var t = u[e];
            t >= a && (s[e] = t);
          }),
            (s[e] = n),
            localStorage.setItem(o, JSON.stringify(s)));
        } catch (e) {}
      }
      function L() {
        try {
          if ("undefined" == typeof window || !window.localStorage) return [];
          var e = localStorage.getItem("goods_read_status"),
            t = e ? JSON.parse(e) : {};
          return Object.keys(t);
        } catch (e) {
          return [];
        }
      }
      function U(e) {
        if (!e || "string" != typeof e) return e;
        if (
          !["pzdsoss.pzds.com", "oss.pzds.com", "pzdsoss.pzpre", "oss.yingbowl.com"].some(function (t) {
            return e.includes(t);
          })
        )
          return e;
        if (e.includes("x-oss-process")) return e;
        var t = e.includes("?") ? "&" : "?";
        return "".concat(e).concat(t, "x-oss-process=image/format,webp");
      }
    },
    1484: function (e, t, n) {
      "use strict";
      n(7);
      t.a = {
        methods: {
          safeJsonParse: function (e) {
            var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
            try {
              return JSON.parse(e);
            } catch (e) {
              return t;
            }
          },
        },
      };
    },
    1486: function (e, t, n) {
      "use strict";
      n.d(t, "a", function () {
        return a;
      });
      var r = n(42);
      (n(19), n(6), n(53), n(23), n(172), n(7), n(3), n(160));
      function a(e) {
        var t = e.path,
          n = e.query,
          a = void 0 === n ? {} : n,
          o = t.startsWith("/") ? t : "/".concat(t);
        if (0 === Object.keys(a).length) return o;
        var i = Object.entries(a)
          .filter(function (e) {
            var t = Object(r.a)(e, 2),
              n = (t[0], t[1]);
            return null != n;
          })
          .map(function (e) {
            var t = Object(r.a)(e, 2),
              n = t[0],
              a = t[1];
            return Array.isArray(a)
              ? a
                  .filter(function (e) {
                    return null != e;
                  })
                  .map(function (e) {
                    return "".concat(encodeURIComponent(n), "=").concat(encodeURIComponent(String(e)));
                  })
                  .join("&")
              : "".concat(encodeURIComponent(n), "=").concat(encodeURIComponent(String(a)));
          })
          .filter(function (e) {
            return e;
          })
          .join("&");
        return i ? "".concat(o, "?").concat(i) : o;
      }
    },
    153: function (e, t, n) {
      "use strict";
      (function (e) {
        n.d(t, "a", function () {
          return a;
        });
        n(19);
        var r = e.env.VUE_APP_proTitle || "盼之账号";
        function a(e) {
          return e ? "".concat(e, " • ").concat(r) : "".concat(r);
        }
      }).call(this, n(208));
    },
    170: function (e, t, n) {
      "use strict";
      n.d(t, "a", function () {
        return d;
      });
      var r = n(2),
        a = n(0),
        o = n(266),
        i = n(267);
      (n(16), n(9), n(6), n(11), n(12), n(7), n(3), n(8));
      function u(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var r = Object.getOwnPropertySymbols(e);
          (t &&
            (r = r.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            n.push.apply(n, r));
        }
        return n;
      }
      function s(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? u(Object(n), !0).forEach(function (t) {
                Object(r.a)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
              : u(Object(n)).forEach(function (t) {
                  Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
                });
        }
        return e;
      }
      var c = (function () {
          return Object(i.a)(
            function e(t) {
              (Object(o.a)(this, e),
                (this.open = !1),
                (this.loginInfo = null),
                (this.messager = null),
                (this.element = null),
                (this.callbackFn = null));
              var n = document.createElement("iframe");
              (n.setAttribute("id", "iframe"),
                n.setAttribute("src", "https://rpa-sdk.51bees.com/verifyUser.html"),
                n.setAttribute("style", "position: fixed;top: 0;left: 0;width: 100vh;height: 100vh;display: none;"),
                n.setAttribute("scrolling", "no"),
                n.setAttribute("border", "0"),
                n.setAttribute("frameborder", "no"),
                n.setAttribute("framespacing", "0"),
                n.setAttribute("allowfullscreen", "true"),
                document.body.appendChild(n),
                (this.element = n),
                (this.messager = n.contentWindow),
                (this.callbackFn = t),
                (this._handleMessage = this._handleMessage.bind(this)));
            },
            [
              {
                key: "getReady",
                value:
                  ((e = Object(a.a)(
                    regeneratorRuntime.mark(function e() {
                      var t = this;
                      return regeneratorRuntime.wrap(function (e) {
                        for (;;)
                          switch ((e.prev = e.next)) {
                            case 0:
                              return (
                                (e.next = 1),
                                new Promise(function (e) {
                                  t.element.onload = function () {
                                    ((t.open = !0), e());
                                  };
                                })
                              );
                            case 1:
                            case "end":
                              return e.stop();
                          }
                      }, e);
                    }),
                  )),
                  function () {
                    return e.apply(this, arguments);
                  }),
              },
              {
                key: "startLogin",
                value: function (e) {
                  var t = {
                    user: e.gameAccount,
                    pwd: e.gameSecret,
                    gameId: e.thirdGameId,
                    gamePlatform: e.thirdGamePlatform,
                    channel: e.thirdChannel,
                  };
                  this.loginInfo = s({}, t);
                  var n = s(s({}, t), {}, { actionType: "login" });
                  (this.messager.postMessage(n, "*"), window.addEventListener("message", this._handleMessage));
                },
              },
              {
                key: "_handleMessage",
                value: function (e) {
                  var t,
                    n,
                    r,
                    a = e.data.actionType;
                  if (a)
                    switch (a) {
                      case "VerifyCode":
                        ((t = { type: "VerifyCode", success: !0, smsVerify: !0, code: null, msg: null }),
                          this.callbackFn(t));
                        break;
                      case "data":
                        if (((n = e.data.data.code), (r = e.data.data.message), "3001" === n))
                          ((t = { type: "Data", success: !0, smsVerify: !0, code: n, msg: r }), this.callbackFn(t));
                        else ((t = { type: "Data", success: !1, smsVerify: !1, code: n, msg: r }), this.callbackFn(t));
                        this.destroy();
                    }
                },
              },
              {
                key: "verifySmsCode",
                value: function (e, t) {
                  var n = s(s({}, this.loginInfo), {}, { verifyCode: e, actionType: "verifyCode" });
                  ((this.callbackFn = t), this.messager.postMessage(n, "*"));
                },
              },
              {
                key: "destroy",
                value: function () {
                  (window.removeEventListener("message", this._handleMessage),
                    this.element.remove(),
                    (this.messager = null),
                    (this.element = null),
                    (this.callbackFn = null),
                    (this.loginInfo = null),
                    (this.open = !1));
                },
              },
            ],
          );
          var e;
        })(),
        l = null;
      function f() {
        return (f = Object(a.a)(
          regeneratorRuntime.mark(function e(t) {
            return regeneratorRuntime.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    return ((l = new c(t)), (e.next = 1), l.getReady());
                  case 1:
                    return e.abrupt("return", l);
                  case 2:
                  case "end":
                    return e.stop();
                }
            }, e);
          }),
        )).apply(this, arguments);
      }
      var d = {
        getXsSdkInstance: function () {
          if (l) return l;
        },
        initXsSdk: function (e) {
          return f.apply(this, arguments);
        },
        startLogin: function (e) {
          (["gameAccount", "gameSecret", "thirdGameId", "thirdChannel", "thirdGamePlatform"].forEach(function (t) {
            if (!e[t]) throw new Error("xsSdk: ".concat(t, " is required"));
          }),
            l.startLogin(e));
        },
        verifySmsCode: function (e, t) {
          l.verifySmsCode(e, t);
        },
        destroyXsSdk: function () {
          l && (l.open && l.destroy(), (l = null));
        },
      };
    },
    183: function (e, t, n) {
      "use strict";
      n.d(t, "a", function () {
        return r;
      });
      var r = { RELEASE: "release", CONNECT: "connect", COMPENSATION: "compensation" };
    },
    192: function (e, t, n) {
      "use strict";
      (n.r(t),
        function (e) {
          (n.d(t, "isGrayApi", function () {
            return u;
          }),
            n.d(t, "isWasmSignApi", function () {
              return c;
            }),
            n.d(t, "invalidateConfig", function () {
              return b;
            }),
            n.d(t, "preloadWasmConfig", function () {
              return y;
            }),
            n.d(t, "ensureWasmConfig", function () {
              return w;
            }),
            n.d(t, "getSignFunction", function () {
              return N;
            }),
            n.d(t, "invalidateAndReSign", function () {
              return L;
            }),
            n.d(t, "getServerSignFunction", function () {
              return H;
            }));
          var r = n(0),
            a =
              (n(16),
              n(19),
              n(20),
              n(36),
              n(578),
              n(582),
              n(583),
              n(105),
              n(18),
              n(293),
              n(3),
              n(33),
              n(30),
              n(160),
              n(584),
              n(588),
              n(589),
              n(590),
              n(591),
              n(593),
              n(594),
              n(595),
              n(596),
              n(597),
              n(598),
              n(599),
              n(600),
              n(601),
              n(602),
              n(603),
              n(604),
              n(605),
              n(606),
              n(607),
              n(608),
              n(609),
              n(610),
              n(611),
              n(116),
              n(117),
              n(118),
              n(119),
              n(120),
              n(121),
              n(122),
              n(123),
              n(124),
              n(125),
              n(126),
              n(127),
              n(128),
              n(31),
              n(110)),
            o = n.n(a),
            i = ["/web-client/v2/public/goodsPublic/page"];
          function u(e) {
            return (
              !!m ||
              (!!e &&
                i.some(function (t) {
                  return e.includes(t);
                }))
            );
          }
          var s = ["/web-client/v2/public/goodsPublic/page"];
          function c(e) {
            return (
              !!m ||
              (!!e &&
                s.some(function (t) {
                  return e.includes(t);
                }))
            );
          }
          var l = n(225),
            f = n(222),
            d = null,
            p = null,
            g = 0,
            m = !1;
          function h() {
            return v.apply(this, arguments);
          }
          function v() {
            return (
              (v = Object(r.a)(
                regeneratorRuntime.mark(function e() {
                  var t,
                    n,
                    a = arguments;
                  return regeneratorRuntime.wrap(function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          if (
                            ((t = a.length > 0 && void 0 !== a[0] && a[0]),
                            (n = Date.now()),
                            !(d && !t && n - g < 18e5))
                          ) {
                            e.next = 1;
                            break;
                          }
                          return e.abrupt("return", d);
                        case 1:
                          return (
                            p ||
                              (p = Object(r.a)(
                                regeneratorRuntime.mark(function e() {
                                  var t, n, r, a, o;
                                  return regeneratorRuntime.wrap(
                                    function (e) {
                                      for (;;)
                                        switch ((e.prev = e.next)) {
                                          case 0:
                                            return (
                                              (e.prev = 0),
                                              (t = l[f.env].ENV_WASM_CONFIG_URL),
                                              (e.next = 1),
                                              fetch(t, {
                                                cache: "no-store",
                                                headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
                                              })
                                            );
                                          case 1:
                                            if ((n = e.sent).ok) {
                                              e.next = 2;
                                              break;
                                            }
                                            throw new Error("HTTP ".concat(n.status));
                                          case 2:
                                            return ((e.next = 3), n.json());
                                          case 3:
                                            return (
                                              (r = e.sent),
                                              (a = r.pc || r),
                                              (m = !0 === a.apiFullList),
                                              (d = a),
                                              (g = Date.now()),
                                              e.abrupt("return", a)
                                            );
                                          case 4:
                                            if (((e.prev = 4), (o = e.catch(0)), !d)) {
                                              e.next = 5;
                                              break;
                                            }
                                            return e.abrupt("return", d);
                                          case 5:
                                            throw o;
                                          case 6:
                                            return ((e.prev = 6), (p = null), e.finish(6));
                                          case 7:
                                          case "end":
                                            return e.stop();
                                        }
                                    },
                                    e,
                                    null,
                                    [[0, 4, 6, 7]],
                                  );
                                }),
                              )()),
                            e.abrupt("return", p)
                          );
                        case 2:
                        case "end":
                          return e.stop();
                      }
                  }, e);
                }),
              )),
              v.apply(this, arguments)
            );
          }
          function b() {
            ((d = null), (g = 0), (m = !1), x.clear(), T.clear(), $.clear(), z.clear(), R.clear(), M.clear());
          }
          function y() {
            h().catch(function (e) {});
          }
          function w() {
            return S.apply(this, arguments);
          }
          function S() {
            return (S = Object(r.a)(
              regeneratorRuntime.mark(function e() {
                return regeneratorRuntime.wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return ((e.prev = 0), (e.next = 1), h());
                        case 1:
                          e.next = 3;
                          break;
                        case 2:
                          ((e.prev = 2), e.catch(0));
                        case 3:
                        case "end":
                          return e.stop();
                      }
                  },
                  e,
                  null,
                  [[0, 2]],
                );
              }),
            )).apply(this, arguments);
          }
          var k = new Map(),
            O = new Map(),
            x = new Map(),
            T = new Map(),
            R = new Map(),
            M = new Map();
          function E(e) {
            return j.apply(this, arguments);
          }
          function j() {
            return (j = Object(r.a)(
              regeneratorRuntime.mark(function t(a) {
                return regeneratorRuntime.wrap(function (t) {
                  for (;;)
                    switch ((t.prev = t.next)) {
                      case 0:
                        if (a) {
                          t.next = 1;
                          break;
                        }
                        throw new Error("deriveAssetUrls: wasmUrl 为空");
                      case 1:
                        if (!R.has(a)) {
                          t.next = 2;
                          break;
                        }
                        return t.abrupt("return", R.get(a));
                      case 2:
                        return (
                          M.has(a) ||
                            M.set(
                              a,
                              Object(r.a)(
                                regeneratorRuntime.mark(function t() {
                                  var r, i, u, s, c, l, f, d, p, g, m;
                                  return regeneratorRuntime.wrap(
                                    function (t) {
                                      for (;;)
                                        switch ((t.prev = t.next)) {
                                          case 0:
                                            if (
                                              ((t.prev = 0), "undefined" == typeof window || "function" != typeof fetch)
                                            ) {
                                              t.next = 4;
                                              break;
                                            }
                                            return ((t.next = 1), fetch(a));
                                          case 1:
                                            if ((i = t.sent).ok) {
                                              t.next = 2;
                                              break;
                                            }
                                            throw new Error("HTTP ".concat(i.status));
                                          case 2:
                                            return ((g = Uint8Array), (t.next = 3), i.arrayBuffer());
                                          case 3:
                                            ((m = t.sent), (r = new g(m)), (t.next = 6));
                                            break;
                                          case 4:
                                            return (
                                              (u = n(786)),
                                              (s = n(612)),
                                              (t.next = 5),
                                              new Promise(function (t, n) {
                                                var r = function (a) {
                                                  (a.startsWith("https") ? u : s)
                                                    .get(a, function (a) {
                                                      if (
                                                        a.statusCode >= 300 &&
                                                        a.statusCode < 400 &&
                                                        a.headers.location
                                                      )
                                                        r(a.headers.location);
                                                      else if (200 === a.statusCode) {
                                                        var o = [];
                                                        (a.on("data", function (e) {
                                                          return o.push(e);
                                                        }),
                                                          a.on("end", function () {
                                                            return t(new Uint8Array(e.concat(o)));
                                                          }),
                                                          a.on("error", n));
                                                      } else n(new Error("HTTP ".concat(a.statusCode)));
                                                    })
                                                    .on("error", n);
                                                };
                                                r(a);
                                              })
                                            );
                                          case 5:
                                            r = t.sent;
                                          case 6:
                                            return (
                                              (c = o()(r).slice(0, 8)),
                                              (l = o()(c + "_glue").slice(0, 8) + ".js"),
                                              (f = o()(c + "_fall").slice(0, 8) + ".js"),
                                              (d = a.substring(0, a.lastIndexOf("/") + 1)),
                                              (p = { glueFileUrl: d + l, fallbackUrl: d + f }),
                                              R.set(a, p),
                                              t.abrupt("return", p)
                                            );
                                          case 7:
                                            return ((t.prev = 7), M.delete(a), t.finish(7));
                                          case 8:
                                          case "end":
                                            return t.stop();
                                        }
                                    },
                                    t,
                                    null,
                                    [[0, , 7, 8]],
                                  );
                                }),
                              )(),
                            ),
                          t.abrupt("return", M.get(a))
                        );
                      case 3:
                      case "end":
                        return t.stop();
                    }
                }, t);
              }),
            )).apply(this, arguments);
          }
          var P = new Function("specifier", "return import(specifier)");
          function I(e, t) {
            return A.apply(this, arguments);
          }
          function A() {
            return (A = Object(r.a)(
              regeneratorRuntime.mark(function e(t, n) {
                return regeneratorRuntime.wrap(function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        if (!k.has(t)) {
                          e.next = 1;
                          break;
                        }
                        return e.abrupt("return", k.get(t));
                      case 1:
                        return (
                          O.has(t) ||
                            O.set(
                              t,
                              Object(r.a)(
                                regeneratorRuntime.mark(function e() {
                                  var r, a, o;
                                  return regeneratorRuntime.wrap(
                                    function (e) {
                                      for (;;)
                                        switch ((e.prev = e.next)) {
                                          case 0:
                                            return ((e.prev = 0), (e.next = 1), E(n.url));
                                          case 1:
                                            return ((r = e.sent), (a = r.glueFileUrl), (e.next = 2), P(a));
                                          case 2:
                                            return ((o = e.sent), (e.next = 3), o.default(n.url));
                                          case 3:
                                            return (k.set(t, o.generate_sign), e.abrupt("return", o.generate_sign));
                                          case 4:
                                            throw ((e.prev = 4), e.catch(0));
                                          case 5:
                                            return ((e.prev = 5), O.delete(t), e.finish(5));
                                          case 6:
                                          case "end":
                                            return e.stop();
                                        }
                                    },
                                    e,
                                    null,
                                    [[0, 4, 5, 6]],
                                  );
                                }),
                              )(),
                            ),
                          e.abrupt("return", O.get(t))
                        );
                      case 2:
                      case "end":
                        return e.stop();
                    }
                }, e);
              }),
            )).apply(this, arguments);
          }
          function C(e, t) {
            return D.apply(this, arguments);
          }
          function D() {
            return (
              (D = Object(r.a)(
                regeneratorRuntime.mark(function e(t, n) {
                  return regeneratorRuntime.wrap(function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          if (!x.has(t)) {
                            e.next = 1;
                            break;
                          }
                          return e.abrupt("return", x.get(t));
                        case 1:
                          return (
                            T.has(t) ||
                              T.set(
                                t,
                                Object(r.a)(
                                  regeneratorRuntime.mark(function e() {
                                    var r, a, o, i, u;
                                    return regeneratorRuntime.wrap(
                                      function (e) {
                                        for (;;)
                                          switch ((e.prev = e.next)) {
                                            case 0:
                                              return ((e.prev = 0), (e.next = 1), P(n));
                                            case 1:
                                              if (
                                                ((i = e.sent),
                                                (u = null),
                                                "function" ==
                                                typeof (null === (r = i.WasmAntibotFallback) || void 0 === r
                                                  ? void 0
                                                  : r.generateSign)
                                                  ? (u = i.WasmAntibotFallback.generateSign)
                                                  : "function" ==
                                                      typeof (null === (a = i.default) || void 0 === a
                                                        ? void 0
                                                        : a.generateSign)
                                                    ? (u = i.default.generateSign)
                                                    : "function" == typeof i.generateSign
                                                      ? (u = i.generateSign)
                                                      : "undefined" != typeof window &&
                                                        "function" ==
                                                          typeof (null === (o = window.WasmAntibotFallback) ||
                                                          void 0 === o
                                                            ? void 0
                                                            : o.generateSign) &&
                                                        (u = window.WasmAntibotFallback.generateSign),
                                                "function" == typeof u)
                                              ) {
                                                e.next = 2;
                                                break;
                                              }
                                              throw new TypeError("JS降级模块未导出有效的 generateSign 函数");
                                            case 2:
                                              return (x.set(t, u), e.abrupt("return", u));
                                            case 3:
                                              throw ((e.prev = 3), e.catch(0));
                                            case 4:
                                              return ((e.prev = 4), T.delete(t), e.finish(4));
                                            case 5:
                                            case "end":
                                              return e.stop();
                                          }
                                      },
                                      e,
                                      null,
                                      [[0, 3, 4, 5]],
                                    );
                                  }),
                                )(),
                              ),
                            e.abrupt("return", T.get(t))
                          );
                        case 2:
                        case "end":
                          return e.stop();
                      }
                  }, e);
                }),
              )),
              D.apply(this, arguments)
            );
          }
          function _(e, t) {
            var n;
            if (!u(e)) return t.currentVersion;
            var r = Number(null === (n = t.rollout) || void 0 === n ? void 0 : n.percent),
              a = Number.isFinite(r) ? Math.min(100, Math.max(0, r)) : 0;
            return Math.random() < a / 100 ? t.candidateVersion : t.currentVersion;
          }
          function N(e) {
            return F.apply(this, arguments);
          }
          function F() {
            return (F = Object(r.a)(
              regeneratorRuntime.mark(function e(t) {
                var n, r, a, o, i, u, s, c, l;
                return regeneratorRuntime.wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return ((e.next = 1), h());
                        case 1:
                          return (
                            (n = e.sent),
                            (r = _(t, n)),
                            (a = r === n.candidateVersion),
                            (o = null),
                            (i = !1),
                            (e.prev = 2),
                            (e.next = 3),
                            I(r, n.wasm[r])
                          );
                        case 3:
                          ((o = e.sent), (e.next = 5));
                          break;
                        case 4:
                          ((e.prev = 4), e.catch(2), (i = !0));
                        case 5:
                          if (((u = null), !i)) {
                            e.next = 13;
                            break;
                          }
                          return (
                            (s = null),
                            (e.prev = 6),
                            (e.next = 7),
                            E(null === (c = n.wasm[r]) || void 0 === c ? void 0 : c.url)
                          );
                        case 7:
                          ((l = e.sent), (s = l.fallbackUrl), (e.next = 9));
                          break;
                        case 8:
                          ((e.prev = 8), e.catch(6));
                        case 9:
                          if (!s) {
                            e.next = 13;
                            break;
                          }
                          return ((e.prev = 10), (e.next = 11), C(r, s));
                        case 11:
                          ((u = e.sent), (e.next = 13));
                          break;
                        case 12:
                          ((e.prev = 12), e.catch(10));
                        case 13:
                          return e.abrupt("return", {
                            generateSign: o,
                            version: r,
                            isCandidateVersion: a,
                            fallbackSign: u,
                          });
                        case 14:
                        case "end":
                          return e.stop();
                      }
                  },
                  e,
                  null,
                  [
                    [2, 4],
                    [6, 8],
                    [10, 12],
                  ],
                );
              }),
            )).apply(this, arguments);
          }
          function L(e, t, n, r, a) {
            return U.apply(this, arguments);
          }
          function U() {
            return (U = Object(r.a)(
              regeneratorRuntime.mark(function e(t, n, r, a, o) {
                var i, u, s, c, l, f, d, p, g, m, v, y, w;
                return regeneratorRuntime.wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return (b(), (e.next = 1), h(!0));
                        case 1:
                          return (
                            (i = e.sent),
                            (u = _(t, i)),
                            (s = JSON.stringify(null != n ? n : {})),
                            (c = String(r || "GET")),
                            (l = String(a)),
                            (f = String(o)),
                            (e.prev = 2),
                            (e.next = 3),
                            I(u, i.wasm[u])
                          );
                        case 3:
                          if (((p = e.sent), (d = p(s, c, l, f)))) {
                            e.next = 4;
                            break;
                          }
                          throw new Error("WASM签名返回空");
                        case 4:
                          e.next = 15;
                          break;
                        case 5:
                          return (
                            (e.prev = 5),
                            (w = e.catch(2)),
                            (g = null),
                            (e.prev = 6),
                            (e.next = 7),
                            E(null === (m = i.wasm[u]) || void 0 === m ? void 0 : m.url)
                          );
                        case 7:
                          ((v = e.sent), (g = v.fallbackUrl), (e.next = 9));
                          break;
                        case 8:
                          ((e.prev = 8), e.catch(6));
                        case 9:
                          if (!g) {
                            e.next = 14;
                            break;
                          }
                          return ((e.prev = 10), (e.next = 11), C(u, g));
                        case 11:
                          ((y = e.sent), (d = y(s, c, l, f)), (e.next = 13));
                          break;
                        case 12:
                          throw ((e.prev = 12), e.catch(10));
                        case 13:
                          e.next = 15;
                          break;
                        case 14:
                          throw w;
                        case 15:
                          return e.abrupt("return", { sign: d, version: u });
                        case 16:
                        case "end":
                          return e.stop();
                      }
                  },
                  e,
                  null,
                  [
                    [2, 5],
                    [6, 8],
                    [10, 12],
                  ],
                );
              }),
            )).apply(this, arguments);
          }
          var $ = new Map(),
            z = new Map();
          function W(e, t) {
            return G.apply(this, arguments);
          }
          function G() {
            return (G = Object(r.a)(
              regeneratorRuntime.mark(function e(t, a) {
                return regeneratorRuntime.wrap(function (e) {
                  for (;;)
                    switch ((e.prev = e.next)) {
                      case 0:
                        if (!$.has(t)) {
                          e.next = 1;
                          break;
                        }
                        return e.abrupt("return", $.get(t));
                      case 1:
                        return (
                          z.has(t) ||
                            z.set(
                              t,
                              Object(r.a)(
                                regeneratorRuntime.mark(function e() {
                                  var r, o, i, u, s, c, d, p, g, m, h, v, b, y, w;
                                  return regeneratorRuntime.wrap(
                                    function (e) {
                                      for (;;)
                                        switch ((e.prev = e.next)) {
                                          case 0:
                                            return (
                                              (e.prev = 0),
                                              (g = n(786)),
                                              (m = n(612)),
                                              (h = n(1952)),
                                              (e.next = 1),
                                              new Promise(function (e, t) {
                                                (a.startsWith("https") ? g : m)
                                                  .get(a, function (n) {
                                                    if (
                                                      n.statusCode >= 300 &&
                                                      n.statusCode < 400 &&
                                                      n.headers.location
                                                    ) {
                                                      (n.headers.location.startsWith("https") ? g : m)
                                                        .get(n.headers.location, function (n) {
                                                          var r = "";
                                                          (n.on("data", function (e) {
                                                            r += e;
                                                          }),
                                                            n.on("end", function () {
                                                              return e(r);
                                                            }),
                                                            n.on("error", t));
                                                        })
                                                        .on("error", t);
                                                    } else {
                                                      var r = "";
                                                      (n.on("data", function (e) {
                                                        r += e;
                                                      }),
                                                        n.on("end", function () {
                                                          return e(r);
                                                        }),
                                                        n.on("error", t));
                                                    }
                                                  })
                                                  .on("error", t);
                                              })
                                            );
                                          case 1:
                                            if (
                                              ((v = e.sent),
                                              (b = l[f.env].WASM_SSR_KEY || ""),
                                              ((y = {
                                                module: { exports: {} },
                                                exports: {},
                                                self: {},
                                                window: {},
                                                globalThis: {},
                                                WasmAntibotFallback: null,
                                                process: { env: { WASM_SSR_KEY: b } },
                                                console: console,
                                              }).global = y),
                                              new h.Script(v, {
                                                filename: "fallback-".concat(t, ".js"),
                                              }).runInNewContext(y, { timeout: 5e3 }),
                                              (w = null),
                                              "function" ==
                                              typeof (null === (r = y.WasmAntibotFallback) || void 0 === r
                                                ? void 0
                                                : r.generateSign)
                                                ? (w = y.WasmAntibotFallback.generateSign)
                                                : "function" ==
                                                    typeof (null === (o = y.window) ||
                                                    void 0 === o ||
                                                    null === (o = o.WasmAntibotFallback) ||
                                                    void 0 === o
                                                      ? void 0
                                                      : o.generateSign)
                                                  ? (w = y.window.WasmAntibotFallback.generateSign)
                                                  : "function" ==
                                                      typeof (null === (i = y.globalThis) ||
                                                      void 0 === i ||
                                                      null === (i = i.WasmAntibotFallback) ||
                                                      void 0 === i
                                                        ? void 0
                                                        : i.generateSign)
                                                    ? (w = y.globalThis.WasmAntibotFallback.generateSign)
                                                    : "function" ==
                                                        typeof (null === (u = y.module.exports) ||
                                                        void 0 === u ||
                                                        null === (u = u.WasmAntibotFallback) ||
                                                        void 0 === u
                                                          ? void 0
                                                          : u.generateSign)
                                                      ? (w = y.module.exports.WasmAntibotFallback.generateSign)
                                                      : "function" ==
                                                          typeof (null === (s = y.module.exports) ||
                                                          void 0 === s ||
                                                          null === (s = s.default) ||
                                                          void 0 === s
                                                            ? void 0
                                                            : s.generateSign)
                                                        ? (w = y.module.exports.default.generateSign)
                                                        : "function" ==
                                                            typeof (null === (c = y.module.exports) || void 0 === c
                                                              ? void 0
                                                              : c.generateSign)
                                                          ? (w = y.module.exports.generateSign)
                                                          : "function" ==
                                                              typeof (null === (d = y.exports) || void 0 === d
                                                                ? void 0
                                                                : d.generateSign)
                                                            ? (w = y.exports.generateSign)
                                                            : "function" ==
                                                                typeof (null === (p = y.self) ||
                                                                void 0 === p ||
                                                                null === (p = p.WasmAntibotFallback) ||
                                                                void 0 === p
                                                                  ? void 0
                                                                  : p.generateSign) &&
                                                              (w = y.self.WasmAntibotFallback.generateSign),
                                              "function" == typeof w)
                                            ) {
                                              e.next = 2;
                                              break;
                                            }
                                            throw new TypeError("服务端JS降级模块未导出有效的 generateSign 函数");
                                          case 2:
                                            return ($.set(t, w), e.abrupt("return", w));
                                          case 3:
                                            throw ((e.prev = 3), e.catch(0));
                                          case 4:
                                            return ((e.prev = 4), z.delete(t), e.finish(4));
                                          case 5:
                                          case "end":
                                            return e.stop();
                                        }
                                    },
                                    e,
                                    null,
                                    [[0, 3, 4, 5]],
                                  );
                                }),
                              )(),
                            ),
                          e.abrupt("return", z.get(t))
                        );
                      case 2:
                      case "end":
                        return e.stop();
                    }
                }, e);
              }),
            )).apply(this, arguments);
          }
          function H(e) {
            return B.apply(this, arguments);
          }
          function B() {
            return (B = Object(r.a)(
              regeneratorRuntime.mark(function e(t) {
                var n, r, a, o, i, u, s;
                return regeneratorRuntime.wrap(
                  function (e) {
                    for (;;)
                      switch ((e.prev = e.next)) {
                        case 0:
                          return ((e.prev = 0), (e.next = 1), h());
                        case 1:
                          return (
                            (n = e.sent),
                            (r = _(t, n)),
                            (a = r === n.candidateVersion),
                            (o = null),
                            (e.prev = 2),
                            (e.next = 3),
                            E(
                              null === (i = n.wasm) || void 0 === i || null === (i = i[r]) || void 0 === i
                                ? void 0
                                : i.url,
                            )
                          );
                        case 3:
                          ((u = e.sent), (o = u.fallbackUrl), (e.next = 5));
                          break;
                        case 4:
                          ((e.prev = 4), e.catch(2));
                        case 5:
                          if (o) {
                            e.next = 6;
                            break;
                          }
                          return e.abrupt("return", { generateSign: null, version: r, isCandidateVersion: a });
                        case 6:
                          return ((e.next = 7), W(r, o));
                        case 7:
                          return (
                            (s = e.sent),
                            e.abrupt("return", { generateSign: s, version: r, isCandidateVersion: a })
                          );
                        case 8:
                          return (
                            (e.prev = 8),
                            e.catch(0),
                            e.abrupt("return", { generateSign: null, version: "", isCandidateVersion: !1 })
                          );
                        case 9:
                        case "end":
                          return e.stop();
                      }
                  },
                  e,
                  null,
                  [
                    [0, 8],
                    [2, 4],
                  ],
                );
              }),
            )).apply(this, arguments);
          }
        }.call(this, n(257).Buffer));
    },
    226: function (e, t, n) {
      "use strict";
      n.d(t, "a", function () {
        return a;
      });
      var r = n(0);
      n(16);
      function a(e) {
        return o.apply(this, arguments);
      }
      function o() {
        return (o = Object(r.a)(
          regeneratorRuntime.mark(function e(t) {
            var n, r, a;
            return regeneratorRuntime.wrap(function (e) {
              for (;;)
                switch ((e.prev = e.next)) {
                  case 0:
                    if (null != (n = t.$store.getters["user/userinfo"]) && n.proxyStatus) {
                      e.next = 1;
                      break;
                    }
                    return e.abrupt("return", !0);
                  case 1:
                    return ((e.next = 2), t.$api.checkPublishCompliance({ goodPrice: "" }));
                  case 2:
                    if ((r = e.sent).success) {
                      e.next = 3;
                      break;
                    }
                    return (t.$message.error(r.info), e.abrupt("return", !1));
                  case 3:
                    if (r.data.needCompliance) {
                      e.next = 4;
                      break;
                    }
                    return e.abrupt("return", !0);
                  case 4:
                    return ((e.next = 5), t.$api.getOpenedUsedList());
                  case 5:
                    if ((a = e.sent).success) {
                      e.next = 6;
                      break;
                    }
                    return (t.$message.error(a.info), e.abrupt("return", !1));
                  case 6:
                    if (null === a.data) {
                      e.next = 7;
                      break;
                    }
                    return e.abrupt("return", !0);
                  case 7:
                    return (t.$message.warning("请先前往商家管理后台设置收款账户！"), e.abrupt("return", !1));
                  case 8:
                  case "end":
                    return e.stop();
                }
            }, e);
          }),
        )).apply(this, arguments);
      }
    },
    248: function (e, t, n) {
      "use strict";
      (n.d(t, "b", function () {
        return o;
      }),
        n.d(t, "d", function () {
          return i;
        }),
        n.d(t, "a", function () {
          return u;
        }),
        n.d(t, "c", function () {
          return s;
        }));
      (n(452), n(21), n(27));
      var r = n(2918),
        a = 3e5;
      function o() {
        return Object(r.a)().replace(/-/g, "");
      }
      function i(e) {
        var t = o();
        return (e.$cookies.set("track_uuid", t), s(e), t);
      }
      function u(e) {
        var t = e.$cookies.get("track_uuid"),
          n = e.$cookies.get("track_time");
        return n && Date.now() - Number.parseInt(n) < a && t ? t : i(e);
      }
      function s(e) {
        var t = Date.now();
        e.$cookies.set("track_time", t);
      }
    },
    26: function (e, t, n) {
      "use strict";
      (n.d(t, "f", function () {
        return c;
      }),
        n.d(t, "j", function () {
          return l;
        }),
        n.d(t, "h", function () {
          return f;
        }),
        n.d(t, "g", function () {
          return d;
        }),
        n.d(t, "i", function () {
          return p;
        }),
        n.d(t, "a", function () {
          return g;
        }),
        n.d(t, "r", function () {
          return m;
        }),
        n.d(t, "o", function () {
          return h;
        }),
        n.d(t, "s", function () {
          return v;
        }),
        n.d(t, "u", function () {
          return b;
        }),
        n.d(t, "d", function () {
          return y;
        }),
        n.d(t, "c", function () {
          return w;
        }),
        n.d(t, "t", function () {
          return S;
        }),
        n.d(t, "m", function () {
          return k;
        }),
        n.d(t, "n", function () {
          return O;
        }),
        n.d(t, "p", function () {
          return x;
        }),
        n.d(t, "e", function () {
          return T;
        }),
        n.d(t, "l", function () {
          return R;
        }),
        n.d(t, "k", function () {
          return M;
        }),
        n.d(t, "q", function () {
          return E;
        }),
        n.d(t, "b", function () {
          return j;
        }));
      var r = n(2),
        a = n(51),
        o =
          (n(19),
          n(6),
          n(37),
          n(20),
          n(61),
          n(57),
          n(7),
          n(3),
          n(112),
          n(21),
          n(40),
          n(33),
          n(30),
          n(219),
          n(195),
          n(27),
          n(58),
          n(8),
          n(31),
          n(28),
          n(176),
          n(177),
          n(159),
          n(63)),
        i = n.n(o),
        u = n(113),
        s = n(17),
        c = /\b([\w._%+-]+@[\da-z.-]+\.[a-z.]{2,6})\b/gi,
        l = /\b((https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*(\?[\w%&=-]*)?(\w+)*)\b/gi,
        f = /\b[A-Z]{1,6}\d{5,11}\b/g,
        d = /\b[A-Z][A-Z0-9]{4,6}\b/g;
      function p(e) {
        return /^(https?:|mailto:|tel:)/.test(e);
      }
      function g(e) {
        var t = document.createElement("a");
        ((t.href = e), (t.target = "_blank"), document.body.appendChild(t), t.click(), document.body.removeChild(t));
      }
      function m(e, t) {
        g(e);
      }
      function h(e, t) {
        if (0 === arguments.length || !e) return null;
        var n,
          r = t || "{y}-{m}-{d} {h}:{i}:{s}";
        if ("object" === Object(a.a)(e)) n = e;
        else {
          if ("string" == typeof e)
            if (/^[0-9]+$/.test(e)) e = parseInt(e);
            else {
              e = e.replace(new RegExp(/-/gm), "/");
            }
          ("number" == typeof e && 10 === e.toString().length && (e *= 1e3), (n = new Date(e)));
        }
        var o = {
          y: n.getFullYear(),
          m: n.getMonth() + 1,
          d: n.getDate(),
          h: n.getHours(),
          i: n.getMinutes(),
          s: n.getSeconds(),
          a: n.getDay(),
        };
        return r.replace(/{([ymdhisa])+}/g, function (e, t) {
          var n = o[t];
          return "a" === t ? ["日", "一", "二", "三", "四", "五", "六"][n] : n.toString().padStart(2, "0");
        });
      }
      function v() {
        var e = new Date().getHours();
        return e < 9 ? "早上好" : e <= 11 ? "上午好" : e <= 13 ? "中午好" : e < 20 ? "下午好" : "晚上好";
      }
      function b(e) {
        return ((e = e.toFixed(2)), (e = (e = parseFloat(e)).toLocaleString()).includes(".") || (e += ".00"), e);
      }
      function y(e) {
        if (e) {
          var t = [
              "id",
              "goodsNo",
              "sellRange",
              "sellType",
              "accountSource",
              "gameId",
              "goodsCatalogueId",
              "accountSource",
              "title",
              "goodsImg",
              "description",
              "simpleMessage",
              "price",
              "transactionPrice",
              "transactionTime",
              "outGoodsNo",
              "heat",
              "tempHeat",
              "sortTime",
              "shotType",
              "shotRemark",
              "linkPhone",
              "linkQq",
              "compensation",
              "isTop",
              "merchantMark",
              "isDel",
              "status",
              "onStandTime",
              "oneselfDownStandTime",
              "forceDownStandTime",
              "sellerId",
              "searchField",
              "updateTime",
              "createTime",
              "remark",
              "verifyTime",
              "forceDownStandRemark",
              "detailsImages",
              "gameAccount",
              "gameSecret",
            ],
            n = [];
          return (
            e.forEach(function (e) {
              if (!t.includes(e.mappingField)) return n.push(e);
            }),
            n
          );
        }
      }
      function w(e) {
        var t,
          n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 300,
          r = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2];
        return function () {
          var a = this,
            o = arguments;
          (r && !t && e.apply(a, o),
            clearTimeout(t),
            (t = setTimeout(function () {
              (r || e.apply(a, o), (t = null));
            }, n)));
        };
      }
      function S(e, t) {}
      function k(e, t) {
        return "LABEL" === t.fieldType || "SINGLE" === t.fieldType || "CONFIG" === t.fieldType
          ? "boolean" == typeof e[t.mappingField]
            ? e[t.mappingField]
              ? "是"
              : "不是"
            : e[t.mappingField + "Name"]
          : "OTHER" === t.fieldType && "boolean" == typeof e[t.mappingField]
            ? e[t.mappingField]
              ? "是"
              : "不是"
            : Array.isArray(e[t.mappingField])
              ? e[t.mappingField].toString()
              : e[t.mappingField];
      }
      var O = 99;
      function x(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "HistoryList",
          n = JSON.parse(window.localStorage.getItem(t)) || [];
        (n.length &&
          n.forEach(function (t, r) {
            t.id === e.id && n.splice(r, 1);
          }),
          n.unshift(e));
        var r = n.filter(function (e) {
          return 6 === e.goodsCatalogueId;
        });
        r.length > 8 && r.pop();
        var a = n.filter(function (e) {
          return 7 === e.goodsCatalogueId;
        });
        a.length > 8 && a.pop();
        var o = r.concat(a);
        window.localStorage.setItem(t, JSON.stringify(o));
      }
      function T(e, t) {
        "object" === Object(a.a)(e) && e instanceof Blob && (e = URL.createObjectURL(e));
        var n = document.createElement("a");
        ((n.href = e), (n.download = t || ""), n.click());
      }
      function R() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "js",
          t = arguments.length > 1 ? arguments[1] : void 0,
          n = !1;
        return new Promise(function (r) {
          var a = document.getElementsByTagName("head")[0];
          if (
            (a.children.forEach(function (e) {
              (e.src || "").includes(t) && ((n = !0), r());
            }),
            !n)
          ) {
            var o;
            if ("js" === e) (((o = document.createElement("script")).type = "text/javascript"), (o.src = t));
            else (((o = document.createElement("link")).rel = "stylesheet"), (o.type = "text/css"), (o.href = t));
            (a.appendChild(o),
              (o.onload = function () {
                r();
              }));
          }
        });
      }
      function M(e) {
        var t = !1;
        return new Promise(function (n) {
          var r = document.getElementsByTagName("head")[0];
          if (
            (r.children.forEach(function (r) {
              (r.src || "").includes(e) && ((t = !0), n());
            }),
            !t)
          ) {
            var a = {};
            (((a = document.createElement("link")).rel = "canonical"),
              (a.href = e),
              r.appendChild(a),
              (a.onload = function () {
                n();
              }));
          }
        });
      }
      function E(e) {
        return new Promise(function (t) {
          var n = setTimeout(function () {
            (clearTimeout(n), t());
          }, e);
        });
      }
      function j() {
        var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : [],
          t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "",
          n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1,
          a = !1,
          o = Object(r.a)(
            Object(r.a)(
              Object(r.a)(
                Object(r.a)({}, s.RestrictMallCode.ALL_BUY, "很抱歉，您的账户暂不支持交易"),
                s.RestrictMallCode.AGENCY_BUY,
                "很抱歉，您的账户暂不支持交易",
              ),
              s.RestrictMallCode.BARGAIN_CREATE,
              "很抱歉，您的账户暂不支持砍价",
            ),
            s.RestrictMallCode.GOODS_SELL,
            1 === n ? "很抱歉，您的账户暂不支持交易" : "当前卖家被限制出售账号，暂时无法进行交易",
          ),
          c = e.find(function (e) {
            return e.restrictionsCode === t;
          });
        if (c) {
          var l = c.endTime,
            f = c.type;
          (f === s.RestrictType.PERPETUAL || (f === s.RestrictType.DURATION && i()(l).isAfter(i()()))) && (a = !0);
        }
        return (a && u.Message.warning(o[t]), a);
      }
    },
    269: function (e, t, n) {
      "use strict";
      n.d(t, "a", function () {
        return a;
      });
      (n(19), n(20), n(53), n(23), n(7), n(3), n(33));
      var r = n(1162);
      function a(e) {
        var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        if (e && e.jumpType) {
          var n = window.$nuxt;
          if (n) {
            var a = e.jumpType,
              o = e.jumpAddr,
              i = e.gameId,
              u = e.goodsCatalogueId,
              s = e.id;
            if ("DAI_SHU" !== a)
              switch (a) {
                case " NONE":
                case "NONE":
                  break;
                case "OUT_LINK":
                  if (t.appendRouteQueryToOutLink && o) {
                    var c = n.$route && n.$route.query,
                      l =
                        c && Object.keys(c).length
                          ? Object.keys(c)
                              .map(function (e) {
                                return "".concat(e, "=").concat(c[e]);
                              })
                              .join("&")
                          : "",
                      f = l
                        ? ""
                            .concat(o)
                            .concat(o.includes("?") ? "&" : "?")
                            .concat(l)
                        : o;
                    window.open(f);
                  } else window.open(o);
                  break;
                case "GOODS_LIST":
                  var d = u || 6;
                  n.$store.commit("game/SET_BUY_GOODS_TYPE", d);
                  var p = { name: "goodsList", params: { gameId: i, goodsCatalogueId: d } };
                  (t.includePageQuery && (p.query = { page: 1 }), n.$router.push(p));
                  break;
                case "BUSINESS_ARTICLE":
                  n.$router.push("/business/".concat(o));
                  break;
                case "GOODS_DETAIL":
                  n.$router.push({ name: "goodsDetails", params: { goodsNo: o, goodsCatalogueId: u || 6 } });
                  break;
                case "GENERAL_GOODS_DETAIL":
                  n.$router.push({ name: "generalGoodsDetails", params: { goodsNo: o, goodsCatalogueId: u || 6 } });
                  break;
                case "CONTENT":
                  n.$router.push({ path: "/BannerDtl", query: { id: s } });
                  break;
                case "FKHD":
                  Object(r.a)(o, n);
              }
            else t.onDaiShu && t.onDaiShu(e);
          }
        }
      }
    },
    275: function (e, t, n) {
      "use strict";
      function r(e) {
        return (
          (function (e) {
            return null === e;
          })(e) ||
          (function (e) {
            return void 0 === e;
          })(e)
        );
      }
      n.d(t, "a", function () {
        return r;
      });
    },
    305: function (e, t, n) {
      "use strict";
      (n.d(t, "a", function () {
        return a;
      }),
        n.d(t, "b", function () {
          return o;
        }));
      n(658);
      var r = "pzdsCookie";
      function a(e, t) {
        var n,
          a = null == e || null === (n = e.getters) || void 0 === n ? void 0 : n["user/token"];
        return ("function" == typeof (null == t ? void 0 : t.get) ? t.get(r) : "") || a || "";
      }
      function o(e, t) {
        return !!a(e, t);
      }
    },
    347: function (e, t, n) {
      "use strict";
      n.d(t, "a", function () {
        return o;
      });
      var r = n(63),
        a = n.n(r),
        o = function (e) {
          var t = a()(),
            n = a()(e);
          return Math.max(0, n.diff(t, "second"));
        };
    },
    363: function (e, t, n) {
      "use strict";
      (n.d(t, "a", function () {
        return o;
      }),
        n.d(t, "b", function () {
          return i;
        }));
      (n(37),
        n(15),
        n(105),
        n(3),
        n(30),
        n(375),
        n(116),
        n(117),
        n(118),
        n(119),
        n(120),
        n(121),
        n(122),
        n(123),
        n(124),
        n(125),
        n(126),
        n(127),
        n(128),
        n(544),
        n(31));
      var r = [
          {
            name: "GoodsMessage",
            option: {
              messageType: "panzhi:consultProductMsg",
              isPersited: !0,
              isCounted: !0,
              searchProps: ["cardName"],
              isStatusMessage: !1,
            },
          },
          {
            name: "OrderMessage",
            option: {
              messageType: "panzhi:consultOrderMsg",
              isPersited: !0,
              isCounted: !0,
              searchProps: [],
              isStatusMessage: !1,
            },
          },
          {
            name: "RecycleGoodsGuide",
            option: {
              messageType: "panzhi:recycleGoodsGuideMsg",
              isPersited: !0,
              isCounted: !0,
              searchProps: [],
              isStatusMessage: !1,
            },
          },
          {
            name: "RecycleBargaining",
            option: {
              messageType: "panzhi:recycleBargainingMsg",
              isPersited: !0,
              isCounted: !0,
              searchProps: [],
              isStatusMessage: !1,
            },
          },
          {
            name: "RecycleingGoodsNewPrice",
            option: {
              messageType: "panzhi:recyclePriceChangeMsg",
              isPersited: !0,
              isCounted: !0,
              searchProps: [],
              isStatusMessage: !1,
            },
          },
          {
            name: "BuyerSellerLinkMsg",
            option: {
              messageType: "panzhi:buyerSellerLinkMsg",
              isPersited: !0,
              isCounted: !0,
              searchProps: [],
              isStatusMessage: !1,
            },
          },
          {
            name: "BuyerSellerLinkPriceChangeMsg",
            option: {
              messageType: "panzhi:buyerSellerLinkMsg",
              isPersited: !0,
              isCounted: !0,
              searchProps: [],
              isStatusMessage: !1,
            },
          },
          {
            name: "SellerHelperCardMsg",
            option: {
              messageType: "panzhi:sellerHelperCardMsg",
              isPersited: !0,
              isCounted: !0,
              searchProps: [],
              isStatusMessage: !1,
            },
          },
          {
            name: "LabelQuestionsMessage",
            option: {
              messageType: "panzhi:labelQuestionsMsg",
              isPersited: !0,
              isCounted: !0,
              searchProps: [],
              isStatusMessage: !1,
            },
          },
          {
            name: "TextAndImageMessage",
            option: {
              messageType: "panzhi:textAndImageMessage",
              isPersited: !0,
              isCounted: !0,
              searchProps: [],
              isStatusMessage: !1,
            },
          },
          {
            name: "ReferenceMessage",
            option: {
              messageType: "panzhi:referenceMsg",
              isPersited: !0,
              isCounted: !0,
              searchProps: [],
              isStatusMessage: !1,
            },
          },
          {
            name: "PlaceOrderMessage",
            option: {
              messageType: "panzhi:placeOrderMsg",
              isPersited: !0,
              isCounted: !0,
              searchProps: [],
              isStatusMessage: !1,
            },
          },
          {
            name: "RichTextMessage",
            option: {
              messageType: "panzhi:richTextMsg",
              isPersited: !0,
              isCounted: !0,
              searchProps: [],
              isStatusMessage: !1,
            },
          },
          {
            name: "PriceReductionMessage",
            option: {
              messageType: "panzhi:priceReductionMsg",
              isPersited: !0,
              isCounted: !0,
              searchProps: [],
              isStatusMessage: !1,
            },
          },
        ],
        a = new WeakMap();
      function o(e, t) {
        r.forEach(function (n) {
          var r = n.option;
          t[n.name] = i(e, r.messageType, n.name);
        });
      }
      function i(e, t, n) {
        var o = (function (e) {
          var t = a.get(e);
          return (t || ((t = new Map()), a.set(e, t)), t);
        })(e);
        if (o.has(t)) return o.get(t);
        var i,
          u = r.find(function (e) {
            return e.option.messageType === t;
          });
        if (u) {
          var s = u.option;
          i = e.registerMessageType(s.messageType, s.isPersited, s.isCounted, s.searchProps, s.isStatusMessage);
        } else i = e.registerMessageType(t, !0, !0, ["cardName"], !1);
        return (o.set(t, i), i);
      }
    },
    398: function (e, t, n) {
      "use strict";
      (n.d(t, "a", function () {
        return s;
      }),
        n.d(t, "b", function () {
          return l;
        }),
        n.d(t, "c", function () {
          return f;
        }));
      var r = n(2),
        a = n(51),
        o = n(0);
      (n(16),
        n(9),
        n(6),
        n(23),
        n(71),
        n(15),
        n(105),
        n(11),
        n(12),
        n(7),
        n(3),
        n(129),
        n(30),
        n(116),
        n(117),
        n(118),
        n(119),
        n(120),
        n(121),
        n(122),
        n(123),
        n(124),
        n(125),
        n(126),
        n(127),
        n(128),
        n(130),
        n(131),
        n(132),
        n(133),
        n(134),
        n(135),
        n(136),
        n(137),
        n(138),
        n(139),
        n(140),
        n(141),
        n(142),
        n(143),
        n(144),
        n(145),
        n(8),
        n(31));
      function i(e, t) {
        var n = Object.keys(e);
        if (Object.getOwnPropertySymbols) {
          var r = Object.getOwnPropertySymbols(e);
          (t &&
            (r = r.filter(function (t) {
              return Object.getOwnPropertyDescriptor(e, t).enumerable;
            })),
            n.push.apply(n, r));
        }
        return n;
      }
      function u(e) {
        for (var t = 1; t < arguments.length; t++) {
          var n = null != arguments[t] ? arguments[t] : {};
          t % 2
            ? i(Object(n), !0).forEach(function (t) {
                Object(r.a)(e, t, n[t]);
              })
            : Object.getOwnPropertyDescriptors
              ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n))
              : i(Object(n)).forEach(function (t) {
                  Object.defineProperty(e, t, Object.getOwnPropertyDescriptor(n, t));
                });
        }
        return e;
      }
      function s(e) {
        return c.apply(this, arguments);
      }
      function c() {
        return (c = Object(o.a)(
          regeneratorRuntime.mark(function e(t) {
            var n;
            return regeneratorRuntime.wrap(
              function (e) {
                for (;;)
                  switch ((e.prev = e.next)) {
                    case 0:
                      if (t) {
                        e.next = 1;
                        break;
                      }
                      return e.abrupt("return", null);
                    case 1:
                      return ((e.prev = 1), (e.next = 2), fetch(t));
                    case 2:
                      if ((n = e.sent).ok) {
                        e.next = 3;
                        break;
                      }
                      return e.abrupt("return", null);
                    case 3:
                      return ((e.next = 4), n.json());
                    case 4:
                      return e.abrupt("return", e.sent);
                    case 5:
                      return ((e.prev = 5), e.catch(1), e.abrupt("return", null));
                    case 6:
                    case "end":
                      return e.stop();
                  }
              },
              e,
              null,
              [[1, 5]],
            );
          }),
        )).apply(this, arguments);
      }
      function l(e, t, n) {
        if (!e || !Array.isArray(e) || 0 === e.length) return [];
        var r = new Set(),
          o = new Map();
        function i(e) {
          if (!e || "object" !== Object(a.a)(e)) return null;
          if (Array.isArray(e.children) && e.children.length > 0) {
            var t = e.children
              .map(function (e) {
                return i(e);
              })
              .filter(function (e) {
                return null !== e;
              });
            if (0 === t.length) return null;
            var s = (e.resources || []).filter(function (e) {
              return r.has(e);
            });
            return u(u({}, e), {}, { children: t, resources: s });
          }
          var c = (e.resources || []).filter(function (e) {
            return r.has(e);
          });
          if (0 === c.length) return null;
          var l = c;
          if (4 === e.ruleType) {
            var f = new Map();
            (c.forEach(function (e) {
              var t = o.get(e);
              t && t.name && (f.has(t.name) || f.set(t.name, []), f.get(t.name).push(e));
            }),
              (l = []),
              f.forEach(function (e) {
                if (1 === e.length) l.push(e[0]);
                else {
                  var t = e
                    .map(function (e) {
                      var t;
                      return {
                        code: e,
                        item: o.get(e),
                        qualitySort: null === (t = o.get(e)) || void 0 === t ? void 0 : t.qualitySort,
                      };
                    })
                    .filter(function (e) {
                      var t = e.qualitySort;
                      return null != t;
                    });
                  t.length > 0
                    ? (t.sort(function (e, t) {
                        var n, r;
                        return (
                          (null !== (n = t.qualitySort) && void 0 !== n ? n : 0) -
                          (null !== (r = e.qualitySort) && void 0 !== r ? r : 0)
                        );
                      }),
                      l.push(t[0].code))
                    : l.push(e[0]);
                }
              }));
          }
          if ("findHas" === n && 2 === e.sortRule && l.length > 0) {
            var d = l[0],
              p = o.get(d);
            p &&
              null !== p.qualitySort &&
              void 0 !== p.qualitySort &&
              l.sort(function (e, t) {
                var n,
                  r,
                  a = o.get(e),
                  i = o.get(t),
                  u = null !== (n = null == a ? void 0 : a.qualitySort) && void 0 !== n ? n : 1 / 0;
                return (null !== (r = null == i ? void 0 : i.qualitySort) && void 0 !== r ? r : 1 / 0) - u;
              });
          } else
            l.sort(function (e, t) {
              var n,
                r,
                a = o.get(e),
                i = o.get(t),
                u = null !== (n = null == a ? void 0 : a.sort) && void 0 !== n ? n : 1 / 0;
              return (null !== (r = null == i ? void 0 : i.sort) && void 0 !== r ? r : 1 / 0) - u;
            });
          return u(u({}, e), {}, { children: [], resources: l });
        }
        return (
          t.forEach(function (e) {
            null != e && e.code && (r.add(e.code), o.set(e.code, e));
          }),
          e
            .map(function (e) {
              return i(e);
            })
            .filter(function (e) {
              return null !== e;
            })
        );
      }
      function f(e, t) {
        var n = [],
          r = [],
          a = new Map();
        return (
          t.forEach(function (e) {
            null != e && e.code && a.set(e.code, e);
          }),
          e.forEach(function (e) {
            if (e && e.code)
              if (a.has(e.code)) {
                var t = a.get(e.code);
                t && ((t.sort = e.sort), (t.url = t.url || e.url), n.push(t));
              } else r.push(e);
          }),
          { hasResources: n, notHasResources: r }
        );
      }
    },
    636: function (e, t, n) {
      "use strict";
      (n.r(t),
        n.d(t, "httpErrorStatusHandle", function () {
          return u;
        }));
      (n(20), n(33), n(28));
      var r = n(247),
        a = n.n(r),
        o = n(113),
        i = n(14);
      function u(e) {
        if (!a.a.isCancel(e)) {
          var t = "";
          if (e && e.response)
            switch (e.response.status) {
              case 400:
                t = "不小心开小差了(400)";
                break;
              case 401:
                setTimeout(function () {
                  var e = window.$nuxt;
                  if (!e.$cookies.get("pzdsCookie"))
                    return (
                      e.$store.dispatch("user/UserResetToken"),
                      e.$router.push({ path: "/login" }),
                      void o.Message.error("登录失效，请重新登录")
                    );
                  !(function () {
                    var e = window.$nuxt,
                      t = e.$RongIMLib.Events;
                    (e.$RongIMLib.removeEventListeners(t.PULL_OFFLINE_MESSAGE_FINISHED),
                      e.$RongIMLib.removeEventListeners(t.CONVERSATION),
                      e.$RongIMLib.removeEventListeners(t.MESSAGES),
                      e.$RongIMLib.removeEventListeners(t.MESSAGE_RECEIPT_REQUEST),
                      e.$RongIMLib.removeEventListeners(t.READ_RECEIPT_RECEIVED),
                      e.$RongIMLib.removeEventListeners(t.MESSAGE_RECEIPT_RESPONSE),
                      e.$RongIMLib.disconnect(),
                      e.$store.commit("ry/SET_CONVERSATION_LIST", []),
                      e.$store.commit("ry/SET_TOKEN", null),
                      e.$store.commit("ry/SET_USER_ID", null),
                      e.$store.commit("ry/SET_CUSTOMER_INFO", {}),
                      e.$store.commit("ry/SET_HISTORY", []),
                      e.$store.commit("ry/SET_MENTIONEDGROUPS_LIST", {}),
                      e.$store.commit("ry/SET_GLOBAL_SHOW_CHAT", !1),
                      e.$store.commit("ry/SET_PREVIEW_LIST", []),
                      e.$store.commit("ry/SET_ALL_UNREAD_COUNT", 0),
                      e.$store.commit("ry/SET_INPUTID_LIST", []),
                      e.$store.commit("ry/SET_RY_SEND_READ", []),
                      e.$store.commit("ry/SET_IM_SINGLECHAT", []),
                      e.$cookies.set("countDown", 0),
                      e.$store.dispatch("user/UserResetToken"),
                      e.$store.dispatch("user/UserLogout").then(function (t) {
                        t.success
                          ? (e.$router.push({ path: "/" }),
                            o.Message.success("退出成功"),
                            Object(i.pzLoginStorage)().onLoggedOut(),
                            e.$router.go(0))
                          : o.Message.error("退出失败");
                      }));
                  })();
                }, 0);
                break;
              case 403:
                t = "该页面拒绝或禁止访问了";
                break;
              case 404:
                t = "不小心开小差了(404)";
                break;
              case 405:
                t = "请求方法有误，请联系客服处理";
                break;
              case 406:
              case 429:
                t = "您操作的速度太快...请稍等再试";
              case 408:
                t = "网络超时，请稍后重试！";
                break;
              case 460:
                t = "网络环境异常，请尝试刷新页面";
                break;
              case 500:
                t = "500|服务器异常 ".concat(e.response.data.requestId);
                break;
              case 502:
                t = "502|服务器无响应";
                break;
              case 503:
                t = "503|服务器异常，请联系客服处理";
                break;
              case 504:
                t = "504|网关超时";
                break;
              case 529:
                t = "529|服务异常降级...请稍等再试";
                break;
              case 612:
                t = "612|登录存在问题，请切换网络或稍后重试";
                break;
              default:
                t = "".concat(e.response.status, "|异常问题，请联系客服处理");
            }
          (e.message.includes("timeout") && (t = "网络请求超时！"),
            e.message.includes("Network") && (t = window.navigator.onLine ? "服务端异常！" : "您断网了！"),
            o.Message.error(t));
        }
      }
    },
  },
  [
    [
      2921, 139, 102, 104, 110, 106, 109, 107, 108, 103, 111, 105, 141, 159, 143, 148, 162, 155, 144, 161, 154, 147,
      150, 151, 165, 146, 153, 149, 145, 156, 157, 142, 163, 152, 160, 164, 140, 158, 15, 23, 80, 59, 65, 31, 35, 27,
      39, 89, 68, 85, 21, 36, 73, 84, 26, 43, 46, 51, 66, 82, 34, 49, 90, 52, 91, 71, 18, 95, 17, 96, 75, 63, 28, 37,
      22, 101, 83, 62, 40, 93, 44, 33, 60, 25, 58, 81, 56, 13, 48, 47, 53, 64, 69, 19, 99, 88, 16, 50, 67, 87, 32, 79,
      30, 74, 55, 92, 54, 78, 24, 14, 70, 29, 97, 98, 72, 45, 86, 100, 57, 38, 94, 20, 41, 61, 76, 42,
    ],
  ],
]);
