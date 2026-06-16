/* user-login/0.0.24 login.submit.js Date:2026-03-26 15:43:31 */
define("//storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/login.submit.js", ["//storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/login.status.js", "//storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/login.message.js"], function(require, a, b) {
    var c = "1" == $("#useSlideAuthCode").val();
    var d = require("//storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/login.status.js");
    var e = require("//storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/login.message.js");

    function f() {
        return "undefined" != typeof GraphicCaptchaHelper && null !== GraphicCaptchaHelper && "function" == typeof GraphicCaptchaHelper.isEnabled ? GraphicCaptchaHelper.isEnabled() : !1
    }
    var g = {
        elelist: {
            nameEle: $("#loginname"),
            pwdEle: $("#nloginpwd"),
            authEle: $("#authcode")
        },
        clear: function() {
            $("#o-authcode, #entry, .item-fore1").removeClass("item-error item-focus")
        },
        showError: function(a, b, c) {
            var d = '<div class="msg-warn"><b></b>' + a + "</div>";
            var e = '<div class="msg-error"><b></b>' + a + "</div>";
            if (console.log("type", b), "errorAppDialog" == b) $("body").dialog({
                title: null,
                fixed: !0,
                width: 360,
                height: 200,
                left: 5,
                source: '<div class="registerDialog checkRegDialog"><div class="ico"></div><div class="desc"><p class="warning">\u8be5\u8d26\u53f7\u5728\u8be5\u5f53\u524d\u5e73\u53f0\u5df2\u6ce8\u518c\uff0c\u5982\u9700\u7ee7\u7eed\u4f7f\u7528\u8bf7\u91cd\u65b0\u5f00\u901a\u8d26\u53f7</p></div><div class="btn-wrap-container"><div class="btn-wrap"><a href="javascript:void(0)" class="btn-red" id="btn-no" style="width: 88px;color: black;background-color: white;border: 1px solid">\u53d6\u6d88</a></div><div class="btn-wrap"><a href="javascript:void(0)" class="btn-red" id="btn-yes">\u91cd\u65b0\u5f00\u901a</a></div></div></div>',
                onReady: function() {
                    $("#btn-yes").click(function() {
                        var a = "/app/restore";
                        var b = encodeURIComponent($("#loginname").val());
                        var c = $("#source").val();
                        $.ajax({
                            url: a + "?source=" + c + "&loginName=" + b,
                            type: "get",
                            dataType: "text",
                            contentType: "application/x-www-form-urlencoded; charset=utf-8",
                            data: {},
                            error: function() {
                                this.showMesInfo("\u7f51\u7edc\u8d85\u65f6\uff0c\u8bf7\u7a0d\u540e\u518d\u8bd5", "error")
                            },
                            success: function(a) {
                                if (a) {
                                    var b = JSON.parse(a);
                                    if (console.log("result", b), "100" == b.code) return void $("#loginsubmit").trigger("click");
                                    if ("0" == b.code) {
                                        $("#chkOpenCtrl").prop("checked");
                                        $(".msg-wrap .msg-warn").hide();
                                        var d = '<div class="msg-error"><b></b>' + b.msg + "</div>";
                                        $(".msg-wrap .msg-error").replaceWith(d), g.clear()
                                    }
                                }
                            }
                        }), $.closeDialog()
                    }), $("#btn-no").click(function() {
                        $.closeDialog()
                    })
                }
            });
            else {
                $("#chkOpenCtrl").prop("checked");
                if ("warn" == b && ($(".msg-wrap .msg-error").hide(), $(".msg-wrap .msg-warn").replaceWith(d)), "error" == b && ($(".msg-wrap .msg-warn").hide(), $(".msg-wrap .msg-error").replaceWith(e)), g.clear(), "\u8d26\u6237\u540d\u4e0e\u5bc6\u7801\u4e0d\u5339\u914d\uff0c\u8bf7\u91cd\u65b0\u8f93\u5165" !== a)
                    for (var h = 0; h < c.length; h++) $(c[h]).parent().addClass("item-error")
            }
        },
        showMesInfo: function(a, b) {
            if ($(".form>.msg-wrap").empty(), "warn" == b) {
                var c = '<div class="msg-warn"><b></b>' + a + "</div>";
                $(".form>.msg-wrap").append(c)
            }
            if ("error" == b) {
                var c = '<div class="msg-error"><b></b>' + a + "</div>";
                $(".form>.msg-wrap").append(c)
            }
        },
        validateAll: function() {
            var b = $.trim(this.elelist.nameEle.val());
            var g = $.trim(this.elelist.pwdEle.val());
            var h = "undefined" != typeof pgeditor && pgeditor.pwdResult();
            var i = "undefined" != typeof pgeditor && pgeditor.checkInstall();
            var j = $(".safe-chk").prop("checked");
            var k = $("#o-authcode").is(":visible");
            var l = $.trim($("#authcode").val());
            if (this.clear(), !b.length && !g.length && !j) return d.onError(e.NAME_EMPTY, this.elelist.nameEle), void $("#loginsubmit").attr("data-code", "");
            if (!b.length && i && !h.length && j) return d.onError(e.NAME_PASSWORD_EMPTY, [this.elelist.nameEle, this.elelist.pwdEle]), void $("#loginsubmit").attr("data-code", "");
            if (!b.length) return d.onError(e.NAME_EMPTY, this.elelist.nameEle), void $("#loginsubmit").attr("data-code", "");
            if (!g.length && !j) return d.onError(e.PASSWORD_EMPTY, this.elelist.pwdEle), void $("#loginsubmit").attr("data-code", "");
            if (f());
            else if (c);
            else if (k && !l.length) return d.onError(e.AUTHCODE_EMPTY, this.elelist.authEle), void $("#loginsubmit").attr("data-code", "");
            f() ? loginSubmit(this.showError) : c ? jdSlide.verify() : loginSubmit(this.showError)
        },
        init: function(a) {
            var b = this;
            $("#loginsubmit").bind("click", function() {
                b.validateAll.call(b)
            }), $("#loginname, #nloginpwd").bind("keyup", function(a) {
                13 != a.keyCode || $(".sugcontent li").length || $("#loginsubmit").click()
            }), $(".login-form").delegate("#country_code_selector", "hover", function() {
                $("#focus").show()
            }, function() {
                $("#focus").hide()
            }), !!a && a()
        }
    };
    return g
});