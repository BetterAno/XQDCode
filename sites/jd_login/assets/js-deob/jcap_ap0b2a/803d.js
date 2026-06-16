require("./1c4c.js");
require("./6762.js");
require("./2fdb.js");
require("./4917.js");
require("./f559.js");
require("./28a5.js");
require("./ac6a.js");
require("./5df3.js");
require("./4f7f.js");
var n = require("./d225.js");
var r = require("./b0b4.js");
var o = require("./482f.js");
function i() {
  var A = ["DfrP", "CNjV", "BhvK", "y3rP", "z2v0", "mtu3ntHfr3zMu0q", "Aw1L", "odq1mZDgCKT2BLu", "BM93", "C3rH", "CgfY", "mZm1me51qKrIBq", "BgvU", "DhjV", "CdOG", "Bwf4", "zwzP", "mJCXn1Dqyxf3Ba", "ngvszKfSuW", "zMLS", "u3rH", "CMfT", "CMrZ", "odCXotqXA09fAwzV", "C2vt", "mtuYC1D2Au9K", "yw1L", "ChvZ", "mty0nZm5nfzgA0f2sW", "sMnH", "y2Ts", "5PYQ6kEJ5P6q", "otaZnZGWv3Dcy3D3", "v2L0", "DgfU", "ywrK", "DgfJ", "mtjTwxbHrhy", "Bevp", "Bwf0", "Dw5K", "B3jK", "v3L5", "y2Tg", "ntaXoty4nfbMELn4BW", "Bw91", "zwnV", "CMvJ", "DuPV", "CNrZ", "DgHL", "Dgf4", "D2fY", "Aw5Z", "B3i6", "CNru", "B255", "yxqG", "ntvcr05Ovvq"];
  return (i = function () {
    return A;
  })();
}
function a(A, t) {
  var e = i();
  a = function (t, n) {
    var r = e[t -= 135];
    if (a.HWkwIA === undefined) {
      a.Drlusg = function (A) {
        for (var t, e, n = "", r = "", o = 0, i = 0; e = A.charAt(i++); ~e && (t = o % 4 ? t * 64 + e : e, o++ % 4) ? n += String.fromCharCode(t >> (o * -2 & 6) & 255) : 0) {
          e = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=".indexOf(e);
        }
        for (var a = 0, c = n.length; a < c; a++) {
          r += "%" + ("00" + n.charCodeAt(a).toString(16)).slice(-2);
        }
        return decodeURIComponent(r);
      };
      A = arguments;
      a.HWkwIA = true;
    }
    var o = t + e[0];
    var i = A[o];
    if (i) {
      r = i;
    } else {
      r = a.Drlusg(r);
      A[o] = r;
    }
    return r;
  };
  return a(A, t);
}
(function (A) {
  function t(A, t) {
    return a(A - 813, t);
  }
  var e = A();
  function n(A, t) {
    return a(t - -48, A);
  }
  while (true) {
    try {
      if (-parseInt(t(1004, 1007)) / 1 * (-parseInt(t(951, 941)) / 2) + parseInt(n(121, 108)) / 3 * (parseInt(t(964, 991)) / 4) + -parseInt(t(978, 978)) / 5 + -parseInt(n(110, 122)) / 6 * (parseInt(n(84, 113)) / 7) + -parseInt(n(95, 110)) / 8 * (parseInt(t(953, 973)) / 9) + parseInt(t(957, 963)) / 10 * (parseInt(n(126, 102)) / 11) + parseInt(t(990, 1010)) / 12 === 395137) {
        break;
      }
      e.push(e.shift());
    } catch (A) {
      e.push(e.shift());
    }
  }
})(i);
var c = function () {
  var A = {
    fOPJX: "ReferenceErr" + i(37, 41),
    JDdYs: "<an" + t(983, 990) + "mous>",
    lEOyv: function (A, t, e) {
      return A(t, e);
    },
    eJauB: function (A, t) {
      return A >= t;
    },
    NEmFP: function (A, t) {
      return A !== t;
    },
    Wyyvf: function (A, t) {
      return A === t;
    },
    PWhzB: "Jcap: rec" + t(968, 941) + " error",
    VLTTO: i(-12, 16) + i(-26, 1) + "getRecords error",
    nTBYi: "Jcap: des" + t(940, 961) + "y e" + t(987, 969) + "r",
    icAjH: "par" + i(40, 11) + t(963, 951) + "k",
    uJoYY: "getCurren" + t(986, 961) + "me",
    vCCeg: "clearR" + t(973, 944) + "rds"
  };
  function t(A, t) {
    return a(A - 794, t);
  }
  function e() {
    function A(A, e) {
      return t(A - -620, e);
    }
    function r(A, t) {
      return i(A, t - 4);
    }
    Object(n.a)(this, e);
    this[r(22, 0) + "ckReco" + A(329, 307)] = {};
    this["max" + r(1, 11) + "ckF" + A(328, 307) + "es"] = 60;
    this["sta" + r(56, 46) + A(313, 314)] = 0;
    this["stackReco" + r(37, 13)] = {};
    this[r(-17, 10) + "ePathes"] = new Set();
  }
  function i(A, t) {
    return a(t - -146, A);
  }
  return Object(r.a)(e, [{
    key: A.icAjH,
    value: function (e) {
      if (!e) {
        return [];
      }
      var n = e.split("\n");
      function r(A, e) {
        return t(e - -1393, A);
      }
      var o = [];
      function i(A, e) {
        return t(A - -307, e);
      }
      var a = /^\s*at\s+(?:(.+?)\s+\()?([^\s()]+):(\d+):(\d+)\)?$/;
      var c = /^(.+?)@([^\s@]+):(\d+):(\d+)$/;
      var g = /^\s*at\s+(?:(.+?)\s+\()?([^\s()]+):(\d+)(?::(\d+))?\)?$/;
      var s = /^\s*at\s+(?:(.+?)\s+\()?([^\s()]+):(\d+)\)?$/;
      for (var u = 0; u < n.length; u++) {
        var I = n[u].trim();
        if (!I["starts" + r(-447, -433) + "h"]("Error:") && !I["sta" + i(669, 652) + "With"]("TypeError:") && !I.startsWith(A.fOPJX) && !I.startsWith("Syn" + i(671, 655) + "Error:")) {
          if (o[r(-467, -454) + "gth"] >= this["max" + r(-457, -446) + i(663, 646) + "rames"]) {
            break;
          }
          var B = null;
          var f = A.JDdYs;
          var C = "";
          var E = 0;
          var l = 0;
          if (I.startsWith(i(677, 651))) {
            if (B = I[r(-445, -427) + "ch"](a)) {
              f = B[1] || "<anonymous>";
              C = B[2];
              E = A.lEOyv(parseInt, B[3], 10);
              l = parseInt(B[4] || "0", 10);
            } else if (B = I[i(659, 672) + "ch"](s)) {
              f = B[1] || A.JDdYs;
              C = B[2];
              E = parseInt(B[3], 10);
              l = 0;
            }
          } else if (I.includes("@") && !I[i(629, 631) + i(669, 644) + "With"]("@")) {
            if (B = I.match(c)) {
              f = B[1] || "<anony" + i(665, 660) + "s>";
              C = B[2];
              E = parseInt(B[3], 10);
              l = A[r(-407, -428) + "yv"](parseInt, B[4] || "0", 10);
            }
          } else if (I.includes(i(677, 691)) && I["inc" + r(-450, -464) + "es"](":")) {
            if (B = I[i(659, 652) + "ch"](g)) {
              f = B[1] || "<anony" + r(-427, -421) + "s>";
              C = B[2];
              E = parseInt(B[3], 10);
              l = parseInt(B[4] || "0", 10);
            }
          }
          if (B && C && (this.filePathes[i(655, 681)](C.split("?")[0]), o[i(647, 619) + "h"]([f.trim(), E, l]), A.eJauB(o.length, this[r(-465, -451) + i(640, 628) + r(-444, -423) + r(-440, -445) + "es"]))) {
            break;
          }
        }
      }
      return o;
    }
  }, {
    key: A[t(975, 986) + "YY"],
    value: function () {
      function A(A, e) {
        return t(A - -1332, e);
      }
      if (typeof performance != A(-365, -355) + A(-389, -363) + "ned" && typeof performance.now == "fun" + A(-402, -419) + "on") {
        return performance.now();
      } else {
        return Date[A(-397, -371)]();
      }
    }
  }, {
    key: "record",
    value: function (e) {
      if (!A.NEmFP(o.a.cs, 1)) {
        try {
          throw new Error();
        } catch (t) {
          try {
            var n = this.getCurrentTime();
            if (!this["startT" + B(1093, 1119)]) {
              this[I(-609, -581) + B(1142, 1144) + "ime"] = n;
            }
            var r = e["fnN" + I(-565, -564)];
            var a = r === undefined ? "" : r;
            var c = e[I(-547, -543) + B(1128, 1151) + "Once"];
            var g = !A[I(-528, -548) + "vf"](c, undefined) && c;
            var s = t.stack || "";
            if (a) {
              if (this["sta" + I(-540, -560) + "ecords"][a]) {
                if (g) {
                  return;
                }
                this[I(-600, -581) + "ckReco" + I(-542, -568)][a].push([Object(o.p)(n - this[I(-568, -581) + I(-551, -535) + "ime"], 3), this.parseStack(s)]);
              } else {
                this["stackReco" + B(1109, 1084)][a] = [[Object(o.p)(n - this["sta" + I(-516, -535) + B(1093, 1109)], 3), this[I(-575, -580) + "seStack"](s)]];
              }
            } else {
              var u = this["parseS" + B(1123, 1133) + "k"](s);
              try {
                a = u[1][0];
              } catch (A) {}
              if (this[B(1096, 1099) + "ckRecords"][a]) {
                if (g) {
                  return;
                }
                this.stackRecords[a].push([Object(o.p)(n - this.startTime, 3), u]);
              } else {
                this["stackReco" + B(1109, 1125)][a] = [[Object(o.p)(n - this["sta" + B(1142, 1123) + "ime"], 3), u]];
              }
            }
          } catch (A) {}
        }
      }
      function I(A, e) {
        return t(e - -1517, A);
      }
      function B(A, t) {
        return i(t, A - 1100);
      }
    }
  }, {
    key: "getRecords",
    value: function () {
      try {
        var A = {
          stackRecords: this["sta" + function (A, t) {
            return i(t, A - 1095);
          }(1112, 1106) + "ecords"],
          filePathes: Array.from(this.filePathes)
        };
        this.clearRecords();
        return A;
      } catch (A) {
        return null;
      }
    }
  }, {
    key: A.vCCeg,
    value: function () {
      function A(A, t) {
        return i(A, t - -148);
      }
      this["sta" + A(-144, -131) + "ecords"] = {};
      this["filePa" + A(-113, -111) + "s"] = new Set();
      this["sta" + A(-121, -106) + A(-128, -155)] = 0;
    }
  }, {
    key: "destroy",
    value: function () {
      function A(A, e) {
        return t(A - -1246, e);
      }
      try {
        this.stackRecords = {};
        this["filePa" + A(-269, -245) + "s"] = new Set();
        e["ins" + A(-285, -285) + "ce"] = null;
      } catch (A) {}
    }
  }], [{
    key: i(-27, -9) + "Instance",
    value: function () {
      if (!e.instance) {
        e["ins" + function (A, t) {
          return i(t, A - 716);
        }(737, 716) + "ce"] = new e();
      }
      return e[function (A, e) {
        return t(A - 84, e);
      }(1064, 1042) + "tance"];
    }
  }]);
}();
c.instance = null;
exports.a = c;