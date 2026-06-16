/* user-login/0.0.24 login2025_append.js Date:2026-03-26 15:43:31 */
$(document).ready(function() {
    $(".show-help").mouseenter(function() {
        $(".qrcode-main").css("margin-top", "17px"), $(".qrcode-img-warp").css("transform", "scale(0.96078);"), $(".qrcode-help").attr("style", "display: flex!important;"), logWrapper(ziwuxian.LOG_TYPE1.PASSPORT_MAIN, ziwuxian.LOG_TYPE2.log_qrcode_help_hover)
    }), $(".show-help").mouseleave(function() {
        $(".qrcode-help").attr("style", "display: none!important;"), $(".qrcode-img-warp").css("transform", ""), $(".qrcode-main").css("margin-top", "")
    }), $(".show-btn").click(function() {
        var a = $("#nloginpwd")[0];
        var b = a.type;
        "password" === b ? (a.type = "text", $(this).attr("src", "https://img11.360buyimg.com/imagetools/jfs/t1/253007/6/22434/490/67b58c2aFd533ff17/0217475a1b9c47f5.png")) : (a.type = "password", $(this).attr("src", "https://img10.360buyimg.com/imagetools/jfs/t1/230909/18/33346/315/67b58c1eFbe3e1542/424891b08c9b7a7c.png"))
    })
}), window.spmHasExposureList = [], window.testLogs = [];
var spmConfig = [
    ["a0219.b002356", ["https://www.jd.com", "https://preview-www.jd.com", "https://www.jingdong.com"]],
    ["a0220.b002450", ["https://item.jd.com", "https://e.jd.com", "https://item.jingdonghealth.cn", "https://npcitem.jd.hk", "https://pcitem.jd.hk", "https://item.jd.hk"]],
    ["a0242.b002522", ["https://ppxq.jd.com"]],
    ["a0254.b002550", ["https://joycenter.jd.com"]],
    ["a0240.b003013", ["https://search.jd.com/img.php", "https://search.jd.com/image"]],
    ["a0240.b002493", ["https://search.jd.com", "https://list.jd.com"]]
];

function getPopSpmAB() {
    if (getUrlParam("apmAb")) return getUrlParam("apmAb");
    var a = getUrlParam("ReturnUrl") || "";
    for (var b = 0; b < spmConfig.length; b++) {
        var c = spmConfig[b];
        if (Array.isArray(c) && !(c.length < 2)) {
            var d = c[0];
            var e = c[1];
            if (Array.isArray(e))
                for (var f = 0; f < e.length; f++)
                    if ("string" == typeof e[f] && 0 == a.indexOf(e[f])) return d || ""
        }
    }
    return ""
}
var popAbSpm = getPopSpmAB();
var loggerForSpm = {
    reportSpm: function(a, b) {
        try {
            if (!window.spmExposure) return;
            var c = {
                type: "exposure",
                spm: a,
                params: b || {}
            };
            window.testLogs.push(c), window.spmExposure({
                spm: a,
                biz_type: "",
                page_id: "",
                event_param: "",
                json_param: b || {},
                t1: "",
                t2: "",
                p0: ""
            })
        } catch (d) {
            console.log("reportSpm error", d)
        }
    },
    reportSpmOnce: function(a, b, c) {
        -1 === window.spmHasExposureList.indexOf(a) && window.spmExposure && (window.spmHasExposureList.push(a), this.reportSpm(b, c))
    },
    spmClick: function(a, b) {
        try {
            if (!window.spmLog) return;
            var c = {
                type: "click",
                spm: a,
                params: b || {}
            };
            window.testLogs.push(c), window.spmLog({
                spm: a,
                json_param: b || {}
            })
        } catch (d) {
            console.log("spmClick error", d)
        }
    },
    handlePopupExposure: function(a) {
        var b = a.element;
        if (b) {
            var c = a.spm;
            var d = a.param;
            var e = a.uniqueId || c;
            if (-1 === window.spmHasExposureList.indexOf(e)) {
                var f = this;
                if (window.spmHasExposureList.push(e), "IntersectionObserver" in window) {
                    var g = new IntersectionObserver(function(a) {
                        a.forEach(function(a) {
                            if (a.isIntersecting) {
                                f.reportSpm(c, d);
                                try {
                                    g.unobserve(a.target)
                                } catch (b) {}
                            }
                        })
                    }, {
                        threshold: .3,
                        rootMargin: "0px"
                    });
                    g.observe(b)
                } else this.reportSpm(c, d)
            }
        }
    },
    config: {
        pc_login: {
            link1: "a0174.b002326.c00003674.link1",
            link2: "a0174.b002326.c00003674.link2",
            link3: "a0174.b002326.c00003674.link3",
            link4: "a0174.b002326.c00003674.link4",
            link5: "a0174.b002326.c00003674.link5",
            link6: "a0174.b002326.c00003674.link6",
            link7: "a0174.b002326.c00003674.link7",
            link8: "a0174.b002326.c00003674.link8",
            link9: "a0174.b002326.c00003674.link9",
            link10: "a0174.b002326.c00003674.link10",
            feedback: "a0174.b002326.c00003673.feedback",
            phone_number: "a0174.b002326.c00003672.phone_number",
            verify_input: "a0174.b002326.c00003672.verify_input",
            verify_get: "a0174.b002326.c00003672.verify_get",
            wechat_login: "a0174.b002326.c00003672.wechat_login",
            qq_login: "a0174.b002326.c00003672.qq_login",
            pwd_forget: "a0174.b002326.c00003672.pwd_forget",
            register: "a0174.b002326.c00003672.register",
            scan: "a0174.b002326.c00003672.scan",
            scan_tips: "a0174.b002326.c00003672.scan_tips",
            login_tab: "a0174.b002326.c00003672.login_tab",
            account_input: "a0174.b002326.c00003672.account_input",
            password_input: "a0174.b002326.c00003672.password_input",
            login_button: "a0174.b002326.c00003672.login_button",
            login_type: "a0174.b002326.c00003672.login_type"
        },
        pc_login_popup: {
            phone_number: popAbSpm + ".c00003483.phone_number",
            verify_input: popAbSpm + ".c00003483.verify_input",
            verify_get: popAbSpm + ".c00003483.verify_get",
            wechat_login: popAbSpm + ".c00003483.wechat_login",
            qq_login: popAbSpm + ".c00003483.qq_login",
            pwd_forget: popAbSpm + ".c00003483.pwd_forget",
            register: popAbSpm + ".c00003483.register",
            scan: popAbSpm + ".c00003483.scan",
            scan_tips: popAbSpm + ".c00003483.scan_tips",
            login_tab: popAbSpm + ".c00003483.login_tab",
            account_input: popAbSpm + ".c00003483.account_input",
            password_input: popAbSpm + ".c00003483.password_input",
            login_button: popAbSpm + ".c00003483.login_button",
            login_type: popAbSpm + ".c00003483.login_type"
        }
    },
    isPop: function() {
        return window.location.href.includes("newPopupLogin?") && "undefined" != typeof window.parent
    },
    typeElementMap: {
        link1: ".links a:nth-child(1)",
        link2: ".links a:nth-child(2)",
        link3: ".links a:nth-child(3)",
        link4: ".links a:nth-child(4)",
        link5: ".links a:nth-child(5)",
        link6: ".links a:nth-child(6)",
        link7: ".links a:nth-child(7)",
        link8: ".links a:nth-child(8)",
        link9: ".links a:nth-child(9)",
        link10: ".links a:nth-child(10)",
        phone_number: "#mobile-number",
        verify_input: "#sms-code",
        verify_get: "#send-sms-code-btn",
        wechat_login: function() {
            return $(".weixin-icon").parent()
        },
        qq_login: function() {
            return $(".QQ-icon").parent()
        },
        pwd_forget: function() {
            return $(".forget-pw-safe.choose-child")
        },
        register: ".regist-link",
        scan: ".qrcode-img-warp",
        scan_tips: ".qrcode-desc-tip .show-help",
        account_input: "#loginname",
        password_input: "#nloginpwd",
        feedback: ".q-link"
    },
    isPwdLogin: function() {
        return $("#pwd-login").hasClass("select-toggle")
    },
    initExposure: function() {
        var a = this;
        var b = ["link1", "link2", "link3", "link4", "link5", "link6", "link7", "link8", "link9", "link10", "register", "scan", "scan_tips", "login_tab", "feedback", "wechat_login", "qq_login", "pwd_forget"];
        b.forEach(function(b) {
            var c = null;
            if ("function" == typeof a.typeElementMap[b] ? c = a.typeElementMap[b]() : "string" == typeof a.typeElementMap[b] && a.typeElementMap[b] && (c = $(a.typeElementMap[b])), c && 0 !== c.length && a.getSpmByType(b)) {
                var d = {};
                "scan" === b && (d.button = 0 === $(".refresh-btn").length || "none" === $(".qrcode-error-2016").css("display") ? 0 : 1), a.handlePopupExposure({
                    element: c[0],
                    spm: a.getSpmByType(b),
                    param: d
                })
            }
        })
    },
    initClick: function() {
        var a = this;
        var b = ["link1", "link2", "link3", "link4", "link5", "link6", "link7", "link8", "link9", "link10", "phone_number", "verify_input", "verify_get", "pwd_forget", "register", "scan", "scan_tips", "login_tab", "account_input", "password_input", "feedback", "wechat_login", "qq_login"];
        b.forEach(function(b) {
            var c = null;
            "function" == typeof a.typeElementMap[b] ? c = a.typeElementMap[b]() : "string" == typeof a.typeElementMap[b] && a.typeElementMap[b] && (c = $(a.typeElementMap[b])), c && 0 !== c.length && a.getSpmByType(b) && c.click(function() {
                var c = {};
                "scan" === b && (c.button = 0 === $(".refresh-btn").length || "none" === $(".refresh-btn").css("display") ? 0 : 1), a.spmClick(a.getSpmByType(b), c)
            })
        })
    },
    getSpmByType: function(a) {
        return this.isPop() ? this.config.pc_login_popup[a] : this.config.pc_login[a]
    },
    inputExposure: function() {
        var a = this;
        this.isPwdLogin() ? ($("#sms-login").click(function() {
            ["phone_number", "verify_input", "verify_get", "login_button"].forEach(function(b) {
                var c = $(a.typeElementMap[b]);
                var d = {};
                var e = void 0;
                "login_button" === b && (c = $("#sms-login-submit"), d.type = 2, e = "sms-login-submit"), a.handlePopupExposure({
                    element: c[0],
                    spm: a.getSpmByType(b),
                    param: d,
                    uniqueId: e
                })
            })
        }), ["account_input", "password_input", "login_button"].forEach(function(b) {
            var c = $(a.typeElementMap[b]);
            var d = {};
            var e = void 0;
            "login_button" === b && (c = $("#loginsubmit"), e = "loginsubmit", d.type = 1), a.handlePopupExposure({
                element: c[0],
                spm: a.getSpmByType(b),
                param: d,
                uniqueId: e
            })
        })) : ($("#pwd-login").click(function() {
            ["account_input", "password_input", "login_button"].forEach(function(b) {
                var c = $(a.typeElementMap[b]);
                var d = {};
                var e = void 0;
                "login_button" === b && (c = $("#loginsubmit"), d.type = 1, e = "loginsubmit"), a.handlePopupExposure({
                    element: c[0],
                    spm: a.getSpmByType(b),
                    param: d,
                    uniqueId: e
                })
            })
        }), ["phone_number", "verify_input", "verify_get", "login_button"].forEach(function(b) {
            var c = $(a.typeElementMap[b]);
            var d = {};
            var e = void 0;
            "login_button" === b && (c = $("#sms-login-submit"), d.type = 2, e = "sms-login-submit"), a.handlePopupExposure({
                element: c[0],
                spm: a.getSpmByType(b),
                param: d,
                uniqueId: e
            })
        }))
    },
    logLoginTab: function() {
        var a = this;
        this.handlePopupExposure({
            element: document.getElementById("pwd-login"),
            spm: this.getSpmByType("login_tab"),
            param: {
                index: 2
            }
        }), this.handlePopupExposure({
            element: document.getElementById("sms-login"),
            spm: this.getSpmByType("login_tab"),
            param: {
                index: 1
            }
        }), $("#pwd-login").click(function() {
            a.spmClick(a.getSpmByType("login_tab"), {
                index: 1
            })
        }), $("#sms-login").click(function() {
            a.spmClick(a.getSpmByType("login_tab"), {
                index: 2
            })
        }), $("#loginsubmit").click(function() {
            a.spmClick(a.getSpmByType("login_button"), {
                type: 1
            })
        }), $("#sms-login-submit").click(function() {
            a.spmClick(a.getSpmByType("login_button"), {
                type: 2
            })
        })
    },
    companyLoginSpmExposure: function() {
        if (window.hasCompanyLogin && hasCompanyLogin()) {
            var a = "corp" === getUrlParam("utype");
            this.isPop() ? a ? loggerForSpm.reportSpmOnce("pin_type_bpin", popAbSpm + ".c00006626.pin_type", {
                pin_type: "2"
            }) : loggerForSpm.reportSpmOnce("pin_type_cpin", popAbSpm + ".c00006626.pin_type", {
                pin_type: "1"
            }) : a ? loggerForSpm.reportSpmOnce("bpin", "a0174.b002326.c00006620.bpin") : loggerForSpm.reportSpmOnce("cpin", "a0174.b002326.c00006620.cpin")
        }
    },
    initSpm: function() {
        var a = this;
        this.isPop() && popAbSpm ? this.reportSpm(popAbSpm + ".c00003483") : (this.reportSpm("a0174.b002326.c00003672"), this.reportSpm("a0174.b002326.c00003673")), this.logLoginTab(), this.inputExposure(), a.initExposure(), a.initClick(), a.companyLoginSpmExposure()
    }
};

function getUrlParam(a, b) {
    b = b || window.location.href;
    var c = "";
    if (-1 !== b.indexOf("?") && (c = b.split("?")[1]), !c) return null;
    var d = c.split("&");
    for (var e = 0; e < d.length; e++) {
        var f = d[e];
        var g = f.indexOf("=");
        if (-1 !== g) {
            var h = f.substring(0, g);
            var i = f.substring(g + 1);
            if (h = decodeURIComponent(h), i = decodeURIComponent(i), h === a) return i
        }
    }
    return null
}

function getScene() {
    var a = getUrlParam("ReturnUrl") || "";
    if (0 == a.indexOf("https://www.jd.com") || 0 == a.indexOf("https://preview-www.jd.com") || 0 == a.indexOf("https://www.jingdong.com")) return 1;
    var b = ["https://item.jd.com", "https://e.jd.com", "https://item.jingdonghealth.cn", "https://npcitem.jd.hk"];
    for (var c = 0; c < b.length; c++)
        if (0 == a.indexOf(b[c])) return 2;
    return 0 == a.indexOf("https://search.jd.com/Search") ? 3 : 0 == a.indexOf("https://mall.jd.com") ? 4 : 0
}

function adjustWechatScanLoginStyle() {
    function a() {
        if (!$("#expgroup").length) return "0";
        var a = $("#expgroup").attr("value");
        if (!a) return "0";
        a = atob(a);
        var b = JSON.parse(a);
        return b && b.PCLogin_wxscan && b.PCLogin_wxscan.pc_login_style && b.PCLogin_wxscan.pc_login_style.value || "0"
    }
    var b = '<div class="qrcode-desc-tip" style="display: flex;color: #666;">\u652f\u6301<img  class="icon"  style="width: 18px; height: 18px; margin: 0 5px !important;"  src="https://img10.360buyimg.com/img/jfs/t1/348506/38/27471/1461/6913e80aF9cb87628/d4a4d7596186f074.png"/><img  class="icon"  style="width: 18px; height: 18px; margin: 0 5px !important;"  src="https://img12.360buyimg.com/img/jfs/t1/344493/13/26448/1881/6913e9baF4c5ab748/52238dc72ffe6b04.png"/><span style="">\u626b\u7801\u767b\u5f55</span><a class="show-help" style="margin-left: 20px;">\u67e5\u770b\u6559\u7a0b</a></div>';
    var c = '\u652f\u6301<img  class="icon"  style="width: 18px; height: 18px; margin: 0 5px !important;"  src="https://img10.360buyimg.com/img/jfs/t1/348506/38/27471/1461/6913e80aF9cb87628/d4a4d7596186f074.png"/><b style="color: red; font-weight: 600">\u4eac\u4e1cAPP</b><img  class="icon"  style="width: 18px; height: 18px; margin: 0 5px !important;"  src="https://img12.360buyimg.com/img/jfs/t1/344493/13/26448/1881/6913e9baF4c5ab748/52238dc72ffe6b04.png"/><b style="color: #2aa32a; font-weight: 500">\u5fae\u4fe1\u626b\u7801</b><a class="show-help" style="margin-left: 20px;">\u67e5\u770b\u6559\u7a0b</a>';
    var d = a();
    "1" === d ? ($(".qrcode-desc-tip").html(c), $(".qrcode-text").text("\u624b\u673a\u626b\u7801\u5b89\u5168\u767b\u5f55"), $(".qrcode-jd-logo-warp").attr("style", "display: none")) : "2" === d && ($(".qrcode-desc-tip").remove(), $(".qrcode-text").text("\u624b\u673a\u626b\u7801\u5b89\u5168\u767b\u5f55"), $(".qrcode-warp").after(b), $(".qrcode-jd-logo-warp").attr("style", "display: none"))
}

function initWechatScanLoginStyle() {
    try {
        adjustWechatScanLoginStyle()
    } catch (a) {
        console.log("adjustWechatScanLoginStyle error", a), window.expLog && window.expLog(a)
    }
    var b = $(".qrcode-desc-tip");
    b.length > 0 && b.attr("style", "display: flex!important;"), $(".show-help").mouseenter(function() {
        $(".qrcode-main").css("margin-top", "17px"), $(".qrcode-img-warp").css("transform", "scale(0.96078);"), $(".qrcode-help").attr("style", "display: flex!important;"), logWrapper(ziwuxian.LOG_TYPE1.PASSPORT_MAIN, ziwuxian.LOG_TYPE2.log_qrcode_help_hover)
    }), $(".show-help").mouseleave(function() {
        $(".qrcode-help").attr("style", "display: none!important;"), $(".qrcode-img-warp").css("transform", ""), $(".qrcode-main").css("margin-top", "")
    })
}

function beforeSpm() {
    try {
        initWechatScanLoginStyle()
    } catch (a) {
        console.log("beforeSpm error", a), window.expLog && window.expLog(a)
    }
}
$(document).ready(function() {
    beforeSpm();
    var a = setInterval(function() {
        if ("function" == typeof spmLog && "function" == typeof spmExposure) {
            if (clearInterval(a), console.log("spm\u521d\u59cb\u5316\u5b8c\u6bd5"), loggerForSpm.isPop() && !popAbSpm) return;
            loggerForSpm.isPop() && popAbSpm || window.spmPV && window.spmPV({
                spm: "a0174.b002326",
                page_id: "",
                page_param: JSON.stringify({
                    type: loggerForSpm.isPwdLogin() ? 1 : 2,
                    scene: getScene()
                })
            }), loggerForSpm.initSpm()
        }
    }, 100);
    setTimeout(function() {
        clearInterval(a)
    }, 3e4)
});

function reportSpmLoginStatus(a, b, c) {
    try {
        var d = "";
        if ("string" != typeof c) try {
            d = JSON.stringify(c)
        } catch (c) {
            d = "\u672a\u77e5\u9519\u8bef: " + c
        } else d = c;
        0 === a && (a = loggerForSpm.isPwdLogin() ? 1 : 2), loggerForSpm.isPop() ? loggerForSpm.reportSpm(popAbSpm + ".c00003483.login_type", {
            method: a,
            status: b ? 1 : 0,
            reason: d
        }) : loggerForSpm.reportSpm("a0174.b002326.c00003672.login_type", {
            method: a,
            status: b ? 1 : 0,
            reason: d
        })
    } catch (c) {
        console.log("reportSpmLoginStatus error", c), window.expLog && window.expLog(c)
    }
}
var spmChecker = {
    checkExposureCoverage: function() {
        console.log("=== \u66dd\u5149\u57cb\u70b9\u68c0\u67e5\u62a5\u544a ===");
        var a = loggerForSpm.isPop() ? loggerForSpm.config.pc_login_popup : loggerForSpm.config.pc_login;
        var b = loggerForSpm.typeElementMap;
        var c = [];
        var d = [];
        var e = [];
        for (var f in a)
            if (a.hasOwnProperty(f)) {
                if ("login_type" === f) continue;
                c.push({
                    type: f,
                    spm: a[f],
                    element: b[f]
                })
            } var g = {};
        for (var h = 0; h < window.testLogs.length; h++)
            if ("exposure" === window.testLogs[h].type) {
                var i = window.testLogs[h].spm;
                d.push(i), g[i] ? g[i]++ : g[i] = 1
            } for (var i in g) g[i] > 1 && e.push({
            spm: i,
            count: g[i],
            logs: window.testLogs.filter(function(a) {
                return "exposure" === a.type && a.spm === i
            })
        });
        var j = [];
        for (var k = 0; k < c.length; k++) {
            var l = c[k].spm; - 1 === d.indexOf(l) && j.push(c[k])
        }
        if (console.log("\ud83d\udcca \u7edf\u8ba1\u4fe1\u606f:"), console.log("\u9884\u671f\u66dd\u5149\u57cb\u70b9\u6570\u91cf:", c.length), console.log("\u5b9e\u9645\u66dd\u5149\u57cb\u70b9\u6570\u91cf:", d.length), console.log("\u9057\u6f0f\u57cb\u70b9\u6570\u91cf:", j.length), console.log("\u91cd\u590d\u4e0a\u62a5\u57cb\u70b9\u6570\u91cf:", e.length), j.length > 0) {
            console.log("\u274c \u9057\u6f0f\u7684\u66dd\u5149\u57cb\u70b9:");
            for (var m = 0; m < j.length; m++) console.log("  - " + j[m].type + ": " + j[m].spm)
        } else console.log("\u2705 \u6240\u6709\u66dd\u5149\u57cb\u70b9\u90fd\u5df2\u6b63\u5e38\u89e6\u53d1");
        if (e.length > 0) {
            console.log("\u26a0\ufe0f \u91cd\u590d\u4e0a\u62a5\u7684\u66dd\u5149\u57cb\u70b9 (\u4e0d\u5e94\u8be5\u91cd\u590d):");
            for (var n = 0; n < e.length; n++) {
                var o = e[n];
                console.log("  - " + o.spm + " (\u4e0a\u62a5\u4e86 " + o.count + " \u6b21)"), console.log("    \u65f6\u95f4\u6233:", o.logs.map(function(a) {
                    return a.timestamp
                }).join(", "))
            }
        } else console.log("\u2705 \u6ca1\u6709\u91cd\u590d\u4e0a\u62a5\u7684\u66dd\u5149\u57cb\u70b9");
        console.log("\ud83d\udcdd \u6240\u6709\u66dd\u5149\u8bb0\u5f55:");
        for (var p = 0; p < window.testLogs.length; p++) "exposure" === window.testLogs[p].type && console.log("  " + (p + 1) + ". " + window.testLogs[p].spm + " (" + window.testLogs[p].timestamp + ")");
        return {
            expected: c.length,
            actual: d.length,
            missed: j.length,
            missedList: j,
            duplicates: e.length,
            duplicateList: e,
            allLogs: window.testLogs.filter(function(a) {
                return "exposure" === a.type
            })
        }
    },
    checkClickCoverage: function() {
        console.log("=== \u70b9\u51fb\u57cb\u70b9\u68c0\u67e5\u62a5\u544a ===");
        var a = window.testLogs.filter(function(a) {
            return "click" === a.type
        });
        var b = {};
        for (var c = 0; c < a.length; c++) {
            var d = a[c].spm;
            b[d] ? b[d]++ : b[d] = 1
        }
        console.log("\ud83d\udcca \u70b9\u51fb\u57cb\u70b9\u7edf\u8ba1:"), console.log("\u603b\u70b9\u51fb\u57cb\u70b9\u6570\u91cf:", a.length), console.log("\u4e0d\u540c\u57cb\u70b9\u7c7b\u578b\u6570\u91cf:", Object.keys(b).length), console.log("\ud83d\udcdd \u5404\u57cb\u70b9\u70b9\u51fb\u6b21\u6570:");
        for (var d in b) console.log("  - " + d + ": " + b[d] + " \u6b21");
        console.log("\ud83d\udcdd \u6240\u6709\u70b9\u51fb\u8bb0\u5f55:");
        for (var e = 0; e < a.length; e++) console.log("  " + (e + 1) + ". " + a[e].spm + " (" + a[e].timestamp + ")");
        return {
            total: a.length,
            uniqueTypes: Object.keys(b).length,
            clickCounts: b,
            allLogs: a
        }
    },
    checkAllCoverage: function() {
        console.log("=== \u5168\u90e8\u57cb\u70b9\u68c0\u67e5\u62a5\u544a ===");
        var a = this.checkExposureCoverage();
        console.log("\n");
        var b = this.checkClickCoverage();
        return console.log("\n\ud83d\udccb \u603b\u7ed3:"), console.log("\u66dd\u5149\u57cb\u70b9 - \u9057\u6f0f:", a.missed, "\u91cd\u590d:", a.duplicates), console.log("\u70b9\u51fb\u57cb\u70b9 - \u603b\u6570:", b.total, "\u7c7b\u578b\u6570:", b.uniqueTypes), {
            exposure: a,
            click: b
        }
    },
    clearTestLogs: function() {
        window.testLogs = [], window.spmHasExposureList = [], console.log("\ud83e\uddf9 \u6d4b\u8bd5\u65e5\u5fd7\u5df2\u6e05\u7a7a")
    },
    exportTestLogs: function() {
        var a = JSON.stringify(window.testLogs, null, 2);
        var b = new Blob([a], {
            type: "application/json"
        });
        var c = URL.createObjectURL(b);
        var d = document.createElement("a");
        d.href = c, d.download = "spm_logs_" + (new Date).getTime() + ".json", d.click(), URL.revokeObjectURL(c), console.log("\ufffd\ufffd \u6d4b\u8bd5\u65e5\u5fd7\u5df2\u5bfc\u51fa")
    }
};

function companyLogin() {
    var a = "corp" === getUrlParam("utype");
    var b = '<div id="login_type_tab"><div style="margin-right: 67px;" class="login_type_tab_item ' + (a ? "" : "active") + '">\u4e2a\u4eba\u7528\u6237\u767b\u5f55</div><div class="login_type_tab_item ' + (a ? "active" : "") + '">\u4f01\u4e1a\u7528\u6237\u767b\u5f55</div></div>';
    var c = '<div id="qyg-login-root" style="display: none;"></div>';

    function d() {
        try {
            if (window.isGraphicCaptchaEnabled && window.isGraphicCaptchaEnabled()) {
                var a = $("#pwd-login");
                var b = $("#sms-login");
                a.length > 0 && a.hasClass("select-toggle") && GraphicCaptchaHelper.refresh(window.formDefaultAppId || "1000803", "", function(a) {}), b.length > 0 && b.hasClass("select-toggle") && GraphicCaptchaHelper.refresh(window.smsDefaultAppId || "1000802", "", function(a) {})
            }
        } catch (c) {
            console.log("refreshGraphicCaptcha error", c)
        }
    }

    function e() {
        $("#content").prepend(b), $("#content").css("padding-top", "0"), $(".login-form-border").append(c), $("#login_type_tab .login_type_tab_item").click(function() {
            $(this).addClass("active").siblings().removeClass("active"), "\u4f01\u4e1a\u7528\u6237\u767b\u5f55" === $(this).text() ? ($("#qyg-login-root").show(), $(".login-new-wrap").hide(), window.__bjd_common_login_init__(), loggerForSpm.spmClick("a0174.b002326.c00006620.bpin")) : ($("#qyg-login-root").hide(), $(".login-new-wrap").show(), d(), window.__bjd_common_login_unmount__(), loggerForSpm.spmClick("a0174.b002326.c00006620.cpin"))
        }), a && ($("#qyg-login-root").show(), $(".login-new-wrap").hide(), window.__bjd_common_login_init__())
    }

    function f() {
        $("body").append(c), $("body").append('<div class="inner_login_type_tab inner_company_login"><div class="inner_login_type_tab_text">\u4f01\u4e1a\u7528\u6237\u767b\u5f55</div><div class="inner_login_type_tab_icon"></div></div>'), $("body").append('<div class="inner_login_type_tab inner_person_login" style="display: none;"><div class="inner_login_type_tab_text">\u4e2a\u4eba\u7528\u6237\u767b\u5f55</div><div class="inner_login_type_tab_icon"></div></div>'), $(".inner_person_login").click(function() {
            $("#qyg-login-root").hide(), $(".login-new-wrap").show(), $(".inner_person_login").hide(), $(".inner_company_login").show(), loggerForSpm.spmClick(popAbSpm + ".c00006626.pin_type", {
                pin_type: "1"
            }), isPopup() && window.parent && window.parent.postMessage && window.parent.postMessage({
                type: "JD_USER_LOGIN_POPUP_TAB_CHANGE",
                tab: "person"
            }, "*"), window.__bjd_common_login_unmount__(), d()
        });

        function b() {
            $("#qyg-login-root").show(), $(".login-new-wrap").hide(), $(".inner_company_login").hide(), $(".inner_person_login").show(), isPopup() && window.parent && window.parent.postMessage && window.parent.postMessage({
                type: "JD_USER_LOGIN_POPUP_TAB_CHANGE",
                tab: "company"
            }, "*"), window.__bjd_common_login_init__()
        }
        $(".inner_company_login").click(function() {
            b(), loggerForSpm.spmClick(popAbSpm + ".c00006626.pin_type", {
                pin_type: "2"
            })
        }), a && b()
    }
    isPopup() ? f() : e()
}

function hasCompanyLogin() {
    if (!window.__bjd_common_login_init__ || !window.__bjd_common_login_unmount__) return !1;
    if (!$("#expgroup").length) return !1;
    var a = $("#expgroup").attr("value");
    if (!a) return !1;
    a = atob(a);
    var b = JSON.parse(a);
    var c = b && b.PCLogin_wxscan && b.PCLogin_wxscan.pc_login_b_stytle && b.PCLogin_wxscan.pc_login_b_stytle.value || "0";
    return "1" == c
}
$(document).ready(function() {
    if (hasCompanyLogin()) try {
        if (companyLogin(), isPopup() && window.parent && window.parent.postMessage) {
            var a = "person";
            var b = document.getElementById("qyg-login-root");
            if (b) {
                var c = window.getComputedStyle(b);
                var d = "none" === c.display;
                a = d ? "person" : "company"
            }
            window.parent.postMessage({
                type: "JD_USER_LOGIN_POPUP_TAB_CHANGE",
                tab: a
            }, "*")
        }
    } catch (e) {
        console.log("companyLogin error", e), window.expLog && window.expLog(e)
    }
    if (isPopup()) {
        $(".login-new-wrap").css("padding-top", "38px"), $("body").css("height", "420px").css("overflow", "hidden");
        var f = $("body")[0];
        f && f.style && f.style.setProperty && f.style.setProperty("background", "#FFFFFF", "important")
    }
});

function isPopup() {
    return window.location.href.includes("newPopupLogin?") && "undefined" != typeof window.parent
}
window.apiLogReqId = Date.now() + "_" + Math.random().toString(36).slice(2, 11) + "_" + Math.random().toString(36).slice(2, 11), window.apiLog = function(a, b) {
    try {
        window.jmfe.jsagentReport(jmfe.JSAGENT_EXCEPTION_TYPE.net, 251, a, {
            data: JSON.stringify(b),
            reqId: window.apiLogReqId,
            timestamp: Date.now()
        })
    } catch (c) {
        console.log("apiLog error", c)
    }
}, window.expLog = window.apiLog;

function getHideWechatQQLogin() {
    return getUrlParam("hideWechatQQLogin")
}
$(document).ready(function() {
    if (getHideWechatQQLogin()) {
        var a = $("#kbCoagent .weixin-icon").closest("li");
        a.length > 0 && (a.hide(), a.prev(".line").hide(), a.next(".line").hide());
        var b = $("#kbCoagent .QQ-icon").closest("li");
        b.length > 0 && (b.hide(), b.prev(".line").hide(), b.next(".line").hide())
    }
    handelAreaCode()
});

function formatAreaCodeForDisplay(a) {
    var b = String(null == a ? "" : a);
    b = b.replace(/^\s+|\s+$/g, "");
    var c = b.match(/(\d+)\s*$/);
    return b = c ? c[1] : "", b = b.replace(/^0+/, ""), "+" + b
}

function handelAreaCode() {
    var a = $("#area-code-value").text();
    var b = formatAreaCodeForDisplay(a);
    $("#area-code-value").text(b), $("#area-code-value").attr("codeid", a)
}