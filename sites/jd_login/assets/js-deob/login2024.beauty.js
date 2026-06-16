/* user-login/0.0.24 login2024.js Date:2026-03-26 15:43:31 */
var LoginConstant = {
    HTTP_SCHEME: "http:",
    HTTPS_SCHEME: "https:"
};
var useSlideAuthCode = "1" == $("#useSlideAuthCode").val();
var Util = {
    Cookie: {
        set: function(a, b, c) {
            var d = new Date;
            d.setTime(d.getTime() + 24 * c * 60 * 60 * 1e3), document.cookie = a + "=" + encodeURIComponent(b, "UTF-8") + ";expires=" + d.toGMTString() + ";domain=passport.jd.com;path=/"
        },
        get: function(a) {
            var b = document.cookie ? document.cookie.split("; ") : [];
            for (var c = 0, d = b.length; d > c; c++) {
                var e = b[c].split("=");
                var f = e.shift();
                var g = e.join("=");
                if (a && a === f) return g
            }
        },
        setALCookie: function() {
            var a = this.get("alpin");
            a && this.set("alpin", "", -100)
        }
    },
    Header: {
        getProtocol: function() {
            var a = "";
            try {
                a = parent.location.protocol
            } catch (b) {}
            if (!a) {
                var c = document.referrer;
                a = 0 == c.indexOf(LoginConstant.HTTPS_SCHEME) ? LoginConstant.HTTPS_SCHEME : LoginConstant.HTTP_SCHEME
            }
            return a
        }
    }
};
var userStatus = !0;

function isGraphicCaptchaEnabled() {
    return "undefined" != typeof GraphicCaptchaHelper && null !== GraphicCaptchaHelper && "function" == typeof GraphicCaptchaHelper.isEnabled ? GraphicCaptchaHelper.isEnabled() : !1
}

function getGraphicCaptchaContext() {
    return "undefined" != typeof GraphicCaptchaHelper && null !== GraphicCaptchaHelper && "function" == typeof GraphicCaptchaHelper.isEnabled ? GraphicCaptchaHelper.getContext() : {
        status: $("#graphicCaptchaStatus").val(),
        appId: $("#graphicCaptchaAppId").val(),
        sessionId: $("#graphicCaptchaSessionId").val(),
        jwtToken: $("#graphicCaptchaJwtToken").val()
    }
}! function() {
    function getEntryptPwd(a) {
        var b = $("#pubKey").val();
        if (!a || !b) return a;
        var c = !1;
        try {
            "undefined" != typeof window && window.SysConfig && "object" == typeof window.SysConfig && (window.SysConfig.hasOwnProperty && window.SysConfig.hasOwnProperty("encryptInfo") ? c = !!window.SysConfig.encryptInfo : "encryptInfo" in window.SysConfig && (c = !!window.SysConfig.encryptInfo))
        } catch (d) {
            console && console.warn && console.warn("SysConfig access failed:", d.message || d)
        }
        if (!c) return a;
        var e = new JSEncrypt;
        return e.setPublicKey(b), e.encrypt(a)
    }

    function loginSubmit(a, b) {
        if (b = b || 0, isGraphicCaptchaEnabled()) {
            window.passportUdr && passportUdr();
            var c = GraphicCaptchaHelper.getContext();
            GraphicCaptchaHelper.create({
                sessionId: c.sessionId,
                account: c.account,
                onSuccess: function(b) {
                    logWrapper(window.logType1, ziwuxian.LOG_TYPE2.diy_login_submit_graphic_captcha_success), proceedWithLogin({
                        status: c.status,
                        appId: c.appId,
                        sessionId: c.sessionId,
                        verifyToken: b.vt,
                        jwtToken: c.jwtToken
                    }, a)
                },
                onFailure: function(d) {
                    console.warn("\u9a8c\u8bc1\u7801\u9a8c\u8bc1\u5931\u8d25: " + d), logWrapper(window.logType1, ziwuxian.LOG_TYPE2.diy_login_submit_graphic_captcha_failure, JSON.stringify({
                        pin: c.account,
                        deviceId: $("#eid").val()
                    })), 5 > b && (b++, GraphicCaptchaHelper.refresh(c.appId, "", function(c) {
                        c ? (showMesInfo("\u9a8c\u8bc1\u5931\u8d25\uff0c\u8bf7\u91cd\u65b0\u9a8c\u8bc1", "warn"), loginSubmit(a, b)) : showMesInfo("\u9a8c\u8bc1\u7801\u5237\u65b0\u5931\u8d25\uff0c\u8bf7\u5237\u65b0\u9875\u9762\u91cd\u8bd5", "error")
                    }))
                },
                onCancel: function() {
                    showMesInfo("\u9a8c\u8bc1\u5df2\u53d6\u6d88\uff0c\u8bf7\u91cd\u65b0\u9a8c\u8bc1", "warn"), logWrapper(window.logType1, ziwuxian.LOG_TYPE2.diy_login_submit_graphic_captcha_cancel, JSON.stringify({
                        pin: c.account,
                        deviceId: $("#eid").val()
                    }))
                },
                onLoad: function(a) {
                    console.log("\u9a8c\u8bc1\u7801\u7ec4\u4ef6\u52a0\u8f7d", a)
                }
            })
        } else proceedWithLogin(getGraphicCaptchaContext() || {}, a)
    }

    function proceedWithLogin(a, b) {
        if (a = a || {}, logWrapper(window.logType1, ziwuxian.LOG_TYPE2.diy_login_submit, JSON.stringify({
                pin: $("#loginname").val(),
                deviceId: $("#eid").val()
            })), !userStatus) return void showMesInfo("\u8d26\u53f7\u7531\u4e8e\u5bc6\u7801\u9891\u7e41\u9519\u8bef\u88ab\u9650\u5236\u767b\u5f5520\u5206\u949f", "error");
        if ($("#loginsubmit").text("\u6b63\u5728\u767b\u5f55..."), -1 != window.location.href.indexOf("/newPopupLogin")) return void newFrameLoginSubmit(a, b);
        if (-1 != window.location.href.indexOf("/popupLogin2013")) return void frameLoginSubmit(a, b);
        var c = "";
        isGraphicCaptchaEnabled() || useSlideAuthCode && (c = $("#loginsubmit").attr("data-code"));
        var d = "";
        window.getAliveSsoDomains && (d = getAliveSsoDomains().join(","));
        var e = {
            uuid: $("#uuid").val(),
            eid: $("#eid").val(),
            fp: $("#sessionId").val(),
            eid2: $("#eid2").val(),
            _t: $("#token").val(),
            loginType: $("#loginType").val(),
            loginname: $("#loginname").val(),
            nloginpwd: getEntryptPwd($("#nloginpwd").val()),
            authcode: c,
            pubKey: $("#pubKey").val(),
            sa_token: $("#sa_token").val(),
            seqSid: window._jdtdmap_sessionId,
            useSlideAuthCode: $("#useSlideAuthCode").val(),
            pageSource: $("#pageSource").val(),
            pageLocation: $("#pageLocation").val(),
            firstShowAccountLoginPage: $("#firstShowAccountLoginPage").val(),
            ssoDomains: d
        };
        Object.keys(a).length > 0 && (a.sessionId && (e.graphicCaptchaSessionId = a.sessionId), a.jwtToken && (e.graphicCaptchaJwtToken = a.jwtToken), a.verifyToken && (e.graphicCaptchaVerifyToken = a.verifyToken));
        var f = "none" !== $(".login-form-body").css("display");
        f ? e.rm = $("label input").length > 0 && $("label input").is(":checked") : (e.token = window.selectedLoginToken, e.hisp = window.selectedHistoryPin);
        try {
            var g = {
                loginname: $("#loginname").val()
            };
            paramsSingUtils(g).then(function(a) {
                e.h5st = a.h5st, e._stk = a._stk, login(e, b)
            })
        } catch (h) {
            console.log("sign loginname error, " + h), login(e, b)
        }
    }

    function login(data, callback) {
        var loginUrl = "/uc/loginService";
        $.ajax({
            url: loginUrl + "?" + location.search.substring(1) + "&r=" + Math.random() + "&version=2015",
            type: "POST",
            dataType: "text",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: data,
            error: function(a) {
                logWrapper(window.logType1, ziwuxian.LOG_TYPE2.diy_lp_login_network_timeout), showMesInfo("\u7f51\u7edc\u8d85\u65f6\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5", "error"), expLog("ajaxError.passport_jd_com.uc-loginService" + a), window.reportSpmLoginStatus && window.reportSpmLoginStatus(0, !1, a)
            },
            success: function(result) {
                if (result) {
                    var obj = eval(result);
                    if (isGraphicCaptchaEnabled() && !obj.success || useSlideAuthCode && !obj.success && (logWrapper(window.logType1, ziwuxian.LOG_TYPE2.diy_login_submit_hit_slide, JSON.stringify({
                            pin: $("#loginname").val(),
                            deviceId: $("#eid").val()
                        })), smartInitSlide()), obj.closeapp) return void(window.location = obj.closeapp);
                    if (obj.success) {
                        var message = {
                            type: "JD_USER_LOGIN_POPUP",
                            url: obj.success
                        };
                        console.log(message, "loginService"), window.parent.postMessage(message, "*"), logWrapper(window.logType1, ziwuxian.LOG_TYPE2.diy_lp_login_success), Util.Cookie.setALCookie(), window.reportSpmLoginStatus && window.reportSpmLoginStatus(0, !0);
                        try {
                            obj.inputLoginName && obj.t && window.addAccountToHistoryList(obj)
                        } catch (e) {
                            console.log(e)
                        }
                        var ssoHost = getSSOHostNew();
                        ssoHost && "sso.jd.com" != ssoHost && $.getJSON("//sso.jd.com/setCookie?t=" + ssoHost + "&callback=?", function() {});
                        var isIE = !-[1];
                        if (isIE) {
                            var link = document.createElement("a");
                            link.href = obj.success, link.style.display = "none", document.body.appendChild(link), link.click()
                        } else logWrapper(window.logType1, ziwuxian.LOG_TYPE2.diy_lp_login_redirect_success), showModal(), window.location = obj.success;
                        return
                    }
                    if ($("#loginsubmit").attr("data-code", ""), obj.transfer) return void(window.location = obj.transfer + window.location.search);
                    if (logWrapper(window.logType1, ziwuxian.LOG_TYPE2.diy_lp_login_fail), window.reportSpmLoginStatus && window.reportSpmLoginStatus(0, !1, obj), obj.enterpriseLimitCheckUrl) return logWrapper(window.logType1, ziwuxian.LOG_TYPE2.diy_lp_login_hit_enterprise_limit_check), void errorRedirectURL(obj.enterpriseLimitCheckUrl);
                    if (obj.newSafeVerify) {
                        try {
                            console.log("\u9b54\u65b9\u8df3\u8f6c"), window.parent.location.href = obj.safeVerifyUrl
                        } catch (error) {
                            console.error("Error redirecting parent window:", error)
                        }
                        return logWrapper(window.logType1, ziwuxian.LOG_TYPE2.diy_lp_login_hit_magic_cube), void(window.location = obj.safeVerifyUrl)
                    }
                    if (obj.rescue) return logWrapper(window.logType1, ziwuxian.LOG_TYPE2.diy_lp_login_hit_magic_cube), logWrapper(window.logType1, ziwuxian.LOG_TYPE2.diy_lp_login_hit_rescue), void(window.location = obj.rescue);
                    obj._t && $("#token").val(obj._t), obj.authcode2 && callback(obj.authcode2, "error", ["#authcode"]), obj.username && callback(obj.username, "error", ["#loginname"]), obj.pwd && callback(obj.pwd, "error", ["#nloginpwd"]), obj.emptyAuthcode && callback(obj.emptyAuthcode, "error", ["#authcode"])
                }
                var input = $(".item-error").eq(0).find("input");
                var t = input.val();
                input.val("").focus().val(t), $("#loginsubmit").html("\u767b\u5f55")
            }
        })
    }

    function getSSOHostNew() {
        var a;
        var b;
        var c = GetUrlParms();
        if (c && (a = c.ReturnUrl, b = c.setCrossCookie), !a || !b) return !1;
        var d = gethostName(a);
        if (0 == d) return !1;
        var e = d.slice(d.indexOf("."), d.length);
        var f = SysConfig.ssoArr;
        for (var g = 0; g < f.length; g++) {
            var h = f[g];
            if (h.indexOf(e) > 0) return h
        }
        return !1
    }

    function gethostName(a) {
        var b = a.split(/\:\/\/|\/|\?/);
        return b.length < 2 ? !1 : b[1]
    }

    function GetUrlParms() {
        var a = new Object;
        var b = location.search.substring(1);
        var c = b.split("&");
        for (var d = 0; d < c.length; d++) {
            var e = c[d].indexOf("=");
            if (-1 != e) {
                var f = c[d].substring(0, e);
                var g = c[d].substring(e + 1);
                a[f] = unescape(g)
            }
        }
        return a
    }

    function frameLoginSubmit(a, b) {
        var c = "";
        isGraphicCaptchaEnabled() || useSlideAuthCode && (c = $("#loginsubmit").attr("data-code"));
        var d;
        location.ancestorOrigins && location.ancestorOrigins.length > 0 && (d = location.ancestorOrigins[0]);
        var e = "";
        window.getAliveSsoDomains && (e = getAliveSsoDomains().join(","));
        var f = {
            uuid: $("#uuid").val(),
            eid: $("#eid").val(),
            fp: $("#sessionId").val(),
            eid2: $("#eid2").val(),
            _t: $("#token").val(),
            loginType: $("#loginType").val(),
            loginname: $("#loginname").val(),
            nloginpwd: getEntryptPwd($("#nloginpwd").val()),
            authcode: c,
            pubKey: $("#pubKey").val(),
            sa_token: $("#sa_token").val(),
            seqSid: window._jdtdmap_sessionId,
            useSlideAuthCode: $("#useSlideAuthCode").val(),
            top: d,
            pageSource: $("#pageSource").val(),
            pageLocation: $("#pageLocation").val(),
            ssoDomains: e
        };
        Object.keys(a).length > 0 && (a.sessionId && (f.graphicCaptchaSessionId = a.sessionId), a.jwtToken && (f.graphicCaptchaJwtToken = a.jwtToken), a.verifyToken && (f.graphicCaptchaVerifyToken = a.verifyToken));
        try {
            var g = {
                loginname: $("#loginname").val()
            };
            paramsSingUtils(g).then(function(a) {
                f.h5st = a.h5st, f._stk = a._stk, frameLogin(f, b)
            })
        } catch (h) {
            frameLogin(f, b)
        }
    }

    function frameLogin(data, callback) {
        var protocol = Util.Header.getProtocol();
        $.ajax({
            type: "POST",
            dataType: "text",
            url: "../uc/loginService?nr=1&" + location.search.substring(1) + "&r=" + Math.random() + "&version=2015",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: data,
            error: function(a) {
                logWrapper(window.logType1, ziwuxian.LOG_TYPE2.diy_lp_login_network_timeout, JSON.stringify({
                    pin: $("#loginname").val(),
                    deviceId: $("#eid").val()
                })), showMesInfo("\u7f51\u7edc\u8d85\u65f6\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5", "error"), expLog("ajaxError.passport_jd_com.uc-loginService" + a), window.reportSpmLoginStatus && window.reportSpmLoginStatus(0, !1, a)
            },
            success: function(result) {
                if (window.apiLog && window.apiLog("/uc/loginService\u767b\u5f55\u8fd4\u56de\u7ed3\u679c", result), result) {
                    var obj = eval(result);
                    if (obj.closeapp) return void(window.parent.location = obj.closeapp);
                    if (isGraphicCaptchaEnabled() && !obj.success || useSlideAuthCode && !obj.success && (logWrapper(window.logType1, ziwuxian.LOG_TYPE2.diy_login_submit_hit_slide, JSON.stringify({
                            pin: $("#loginname").val(),
                            deviceId: $("#eid").val()
                        })), smartInitSlide()), obj.success || obj.transfer) {
                        logWrapper(window.logType1, ziwuxian.LOG_TYPE2.diy_lp_login_success, JSON.stringify({
                            pin: $("#loginname").val(),
                            deviceId: $("#eid").val()
                        })), Util.Cookie.setALCookie();
                        var relayUrl = protocol + "//passport.jd.com/relay/loginRelay.htm";
                        try {
                            docRef = document.referrer;
                            var regExp = $("#popupRefererCheckRegex").val();
                            regExp = null == regExp ? /([\w-]+)\.(jd\.hk|jd360\.hk|yiyaojd\.com|baitiao\.com|jkcsjd\.com)/ : "/" + regExp + "/";
                            var match = docRef.match(regExp);
                            if (null != match && match.length >= 3) {
                                var ua = navigator.userAgent;
                                var isIE = ua.indexOf("MSIE") >= 0 || ua.indexOf("Trident") >= 0;
                                var hkShortDomainEnable = window.popupConfig.hkShortDomainEnable;
                                relayUrl = isIE && "jd.hk" == match[2] && hkShortDomainEnable ? protocol + "//" + match[0] + "/relay/loginRelay.htm" : protocol + "//sso." + match[2] + "/popup/redirect"
                            }
                        } catch (e) {}
                        if (obj.notnr) {
                            var message = {
                                type: "JD_USER_LOGIN_POPUP",
                                url: obj.success
                            };
                            return window.reportSpmLoginStatus && window.reportSpmLoginStatus(0, !0), console.log("frameLogin/loginService", message, relayUrl), window.parent.postMessage(message, "*"), logWrapper(window.logType1, ziwuxian.LOG_TYPE2.diy_lp_login_redirect_success, {}), void(window.location.href = relayUrl)
                        }
                        try {
                            $.ajax({
                                type: "GET",
                                url: obj.success,
                                dataType: "jsonp",
                                timeout: 1e3,
                                success: function(a) {
                                    logWrapper(window.logType1, ziwuxian.LOG_TYPE2.diy_lp_login_redirect_success, {}), window.reportSpmLoginStatus && window.reportSpmLoginStatus(0, !0), window.location.href = relayUrl
                                }
                            })
                        } catch (e) {
                            return void(window.location.href = relayUrl)
                        }
                    } else logWrapper(window.logType1, ziwuxian.LOG_TYPE2.diy_lp_login_fail, {}), $("#loginsubmit").attr("data-code", ""), window.reportSpmLoginStatus && window.reportSpmLoginStatus(0, !1, obj);
                    if (obj.enterpriseLimitCheckUrl) return logWrapper(window.logType1, ziwuxian.LOG_TYPE2.diy_lp_login_hit_enterprise_limit_check, {}), void errorRedirectURL(obj.enterpriseLimitCheckUrl);
                    if (obj.newSafeVerify) {
                        try {
                            console.log("\u9b54\u65b9\u8df3\u8f6c"), window.parent.location.href = obj.safeVerifyUrl
                        } catch (error) {
                            console.error("Error redirecting parent window:", error)
                        }
                        return logWrapper(window.logType1, ziwuxian.LOG_TYPE2.diy_lp_login_hit_magic_cube, {}), void(window.parent.location = obj.safeVerifyUrl)
                    }
                    if (obj.rescue) return logWrapper(window.logType1, ziwuxian.LOG_TYPE2.diy_lp_login_hit_rescue, {}), void(window.parent.location = obj.rescue);
                    obj._t && $("#token").val(obj._t), useSlideAuthCode || $("#JD_Verification1").click(), obj.username && callback(obj.username, "error", ["#loginname"]), obj.pwd && (callback(obj.pwd, "error", ["#nloginpwd"]), clearPwd()), obj.emptyAuthcode && callback(obj.emptyAuthcode, "error", ["#authcode"])
                }
                var input = $(".item-error").eq(0).find("input");
                var t = input.val();
                input.val("").focus().val(t), $("#loginsubmit").html("\u767b\u5f55")
            }
        })
    }

    function newFrameLoginSubmit(a, b) {
        var c = "";
        isGraphicCaptchaEnabled() || useSlideAuthCode && (c = $("#loginsubmit").attr("data-code"));
        var d;
        location.ancestorOrigins && location.ancestorOrigins.length > 0 && (d = location.ancestorOrigins[0]);
        var e = "";
        window.getAliveSsoDomains && (e = getAliveSsoDomains().join(","));
        var f = {
            uuid: $("#uuid").val(),
            eid: $("#eid").val(),
            fp: $("#sessionId").val(),
            eid2: $("#eid2").val(),
            _t: $("#token").val(),
            loginType: $("#loginType").val(),
            loginname: $("#loginname").val(),
            nloginpwd: getEntryptPwd($("#nloginpwd").val()),
            authcode: c,
            pubKey: $("#pubKey").val(),
            sa_token: $("#sa_token").val(),
            seqSid: window._jdtdmap_sessionId,
            useSlideAuthCode: $("#useSlideAuthCode").val(),
            top: d,
            pageSource: $("#pageSource").val(),
            pageLocation: $("#pageLocation").val(),
            ssoDomains: e
        };
        Object.keys(a).length > 0 && (a.sessionId && (f.graphicCaptchaSessionId = a.sessionId), a.jwtToken && (f.graphicCaptchaJwtToken = a.jwtToken), a.verifyToken && (f.graphicCaptchaVerifyToken = a.verifyToken));
        try {
            var g = {
                loginname: $("#loginname").val()
            };
            paramsSingUtils(g).then(function(a) {
                f.h5st = a.h5st, f._stk = a._stk, newFrameLogin(f, b)
            })
        } catch (h) {
            newFrameLogin(f, b)
        }
    }

    function newFrameLogin(data, callback) {
        var protocol = Util.Header.getProtocol();
        $.ajax({
            type: "POST",
            dataType: "text",
            url: "/uc/loginService?nr=1&" + location.search.substring(1) + "&r=" + Math.random() + "&version=2025",
            contentType: "application/x-www-form-urlencoded; charset=utf-8",
            data: data,
            error: function(a) {
                logWrapper(window.logType1, ziwuxian.LOG_TYPE2.diy_lp_login_network_timeout, JSON.stringify({
                    pin: $("#loginname").val(),
                    deviceId: $("#eid").val()
                })), showMesInfo("\u7f51\u7edc\u8d85\u65f6\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5", "error"), expLog("ajaxError.passport_jd_com.uc-loginService" + a)
            },
            success: function(result) {
                if (result) {
                    var obj = eval(result);
                    if (obj.closeapp) return void(window.parent.location = obj.closeapp);
                    if (isGraphicCaptchaEnabled() && !obj.success || useSlideAuthCode && !obj.success && (logWrapper(window.logType1, ziwuxian.LOG_TYPE2.diy_login_submit_hit_slide, JSON.stringify({
                            pin: $("#loginname").val(),
                            deviceId: $("#eid").val()
                        })), smartInitSlide()), obj.success || obj.transfer) {
                        logWrapper(window.logType1, ziwuxian.LOG_TYPE2.diy_lp_login_success, JSON.stringify({
                            pin: $("#loginname").val(),
                            deviceId: $("#eid").val()
                        })), Util.Cookie.setALCookie();
                        var message = {
                            type: "JD_USER_LOGIN_POPUP",
                            url: obj.success || obj.transfer
                        };
                        return window.reportSpmLoginStatus && window.reportSpmLoginStatus(0, !0), window.parent.postMessage(message, "*"), void logWrapper(window.logType1, ziwuxian.LOG_TYPE2.diy_lp_login_redirect_success, {})
                    }
                    if (logWrapper(window.logType1, ziwuxian.LOG_TYPE2.diy_lp_login_fail, {}), window.reportSpmLoginStatus && window.reportSpmLoginStatus(0, !1, obj), $("#loginsubmit").attr("data-code", ""), obj.username) return callback(obj.username, "error", ["#loginname"]), void $("#loginsubmit").html("\u767b\u5f55");
                    if (obj.enterpriseLimitCheckUrl) return logWrapper(window.logType1, ziwuxian.LOG_TYPE2.diy_lp_login_hit_enterprise_limit_check, {}), void errorRedirectURL(obj.enterpriseLimitCheckUrl);
                    if (obj.newSafeVerify) {
                        try {
                            var message = {
                                type: "JD_USER_LOGIN_POPUP",
                                url: obj.safeVerifyUrl
                            };
                            window.parent.postMessage(message, "*")
                        } catch (error) {
                            console.error("Error redirecting parent window:", error)
                        }
                        return void logWrapper(window.logType1, ziwuxian.LOG_TYPE2.diy_lp_login_hit_magic_cube, {})
                    }
                    obj._t && $("#token").val(obj._t), useSlideAuthCode || $("#JD_Verification1").click(), obj.pwd && (callback(obj.pwd, "error", ["#nloginpwd"]), clearPwd()), obj.emptyAuthcode && callback(obj.emptyAuthcode, "error", ["#authcode"])
                }
                var input = $(".item-error").eq(0).find("input");
                var t = input.val();
                input.val("").focus().val(t), $("#loginsubmit").html("\u767b\u5f55")
            }
        })
    }

    function errorRedirectURL(a) {
        var b = !-[1];
        if (b) {
            var c = document.createElement("a");
            c.href = a, c.style.display = "none", document.body.appendChild(c), c.target = "_top", c.click()
        } else window.top.location = a
    }

    function showMesInfoBak(a, b) {
        if ($(".msg-wrap").empty(), "warn" == b) {
            var c = '<div class="msg-warn"><b></b>' + a + "</div>";
            $(".msg-wrap").append(c)
        }
        if ("error" == b) {
            var c = '<div class="msg-error"><b></b>' + a + "</div>";
            $(".msg-wrap").append(c)
        }
    }

    function showMesInfo(a, b) {
        var c = $(".msg-wrap");
        var d = '<div class="msg-' + b + '"><b></b>' + a + "</div>";
        c.find(".msg-warn, .msg-error").hide();
        var e = c.find(".msg-" + b);
        e.length ? e.replaceWith(d) : c.append(d), c.find(".msg-" + b).show()
    }

    function clearPwd() {
        $("#nloginpwd").val(""), $("#nloginpwd").siblings(".clear-btn").hide()
    }

    function assemblyForm() {}

    function showAuthCode() {}
    window.showAuthCode = showAuthCode, window.loginSubmit = loginSubmit, window.assemblyForm = assemblyForm
}();

function loginConfirm() {
    var a = location.search.substring(1);
    var b = a.substring(a.indexOf("ReturnUrl=") + "ReturnUrl=".length);
    var c = "";
    window.getAliveSsoDomains && (c = getAliveSsoDomains().join(","));
    var d = document.createElement("script");
    d.src = "/user/login/confirm?callback=callBack&returnUrl=" + b + "&ssoDomains=" + c, document.head.appendChild(d)
}

function callBack(a) {
    showModal(), window.location = a && a.returnUrl ? a.returnUrl : "https://www.jd.com"
}

function callbackjsonp(a) {
    if (a && a.loginName && a.imageUrl) {
        $(".login-form-body").hide(), $(".not-login").hide(), $("#login-account").text(a.loginName);
        var b = document.getElementById("login-img");
        b.src = a.imageUrl, $("#login-status-form-submit-btn").attr("url-data");
        var c = document.getElementById("login-status-form-submit-btn");
        c.setAttribute("data", a.returnUrl ? a.returnUrl : "https://www.jd.com"), $(".login-status-form").show(), $(".is-login").show()
    }
}