/* user-login/0.0.24 login.password.js Date:2026-03-26 15:43:31 */
define("//storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/login.password.js", ["//storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/login.reg.js", "//storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/login.status.js", "//storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/login.pubSub.js"], function(require, a, b) {
    var c = require("//storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/login.reg.js");
    var d = require("//storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/login.status.js");
    var e = require("//storage.jd.com/retail-mall/jdc_user_login/pc/user/login/0.0.24/js/login.pubSub.js");
    var f = function(a) {
        a ? $(".capslock").show() : $(".capslock").hide()
    };
    var g = "";
    var h = function(a) {
        var b = a.keyCode || a.which;
        var c = a.shiftKey || 16 == b || !1;
        var d = b >= 65 && 90 >= b && !c;
        var e = b >= 97 && 122 >= b && c;
        var h = b >= 65 && 90 >= b && c;
        var i = b >= 97 && 122 >= b && !c;
        return d || e ? (g = "on", f(!0)) : h || i ? (g = "off", f(!1)) : void 0
    };
    var i = function(a) {
        var b = a || window.event;
        20 == b.keyCode && "" != g && ("on" == g ? (g = "off", f(!1)) : (g = "on", f(!0)))
    };
    var j = {
        "password.focus": function() {
            e.subscribe("password.focus", function() {
                d.onEvent({
                    ele: l.ele.parent(),
                    addClass: "item-focus",
                    callback: function() {
                        var a = l.ele.val();
                        var b = l.safeEleCheck.prop("checked");
                        c.isEmpty(a) || b || l.ele.siblings(".clear-btn").show()
                    }
                })
            })
        },
        "password.blur": function() {
            e.subscribe("password.blur", function() {
                d.onEvent({
                    ele: l.ele.parent(),
                    removeClass: "item-focus",
                    callback: function() {
                        var a = l.ele.val();
                        c.isEmpty(a) && l.safeEle.next("txt").show()
                    }
                })
            })
        },
        "password.keyup": function() {
            e.subscribe("password.keyup", function(a) {
                i(a), d.onEvent({
                    callback: function() {
                        var a = l.ele.val();
                        c.isEmpty(a) ? l.ele.siblings(".clear-btn").hide() : l.ele.siblings(".clear-btn").show()
                    }
                })
            })
        },
        "password.keypress": function() {
            e.subscribe("password.keypress", function(a) {
                h(a)
            })
        },
        "password.clear": function() {
            e.subscribe("password.clear", function(a) {
                f(!1)
            })
        },
        "passwordField.focus": function() {
            e.subscribe("passwordField.focus", function() {
                l.ele.trigger("focus"), l.ocxEle.trigger("focus")
            })
        }
    };
    for (var k in j) j.hasOwnProperty(k) && j[k]();
    var l = {
        ele: $("#nloginpwd"),
        safeEle: $("#sloginpwd"),
        ocxEle: $("#_ocx_password"),
        safeEleCheck: $("#chkOpenCtrl"),
        autoLoginEle: $("#autoLogin"),
        otherUser: $(".more-slide"),
        init: function() {
            this.ele.bind("focus", function(a) {
                e.publish("password.focus")
            }), this.ocxEle.live("focus", function() {
                e.publish("password.focus")
            }), this.ele.bind("blur", function(a) {
                e.publish("password.blur")
            }), this.ocxEle.live("blur", function() {
                e.publish("password.blur")
            }), this.ele.bind("keyup", function(a) {
                e.publish("password.keyup", a)
            }), this.ele.bind("keypress", function(a) {
                e.publish("password.keypress", a)
            }), this.safeEleCheck.bind("click", function() {
                e.publish("password.safeOcx.use", $(this))
            }), this.autoLoginEle.bind("click", function() {
                e.publish("password.autologinInfo", $(this))
            }), this.otherUser.hover(function() {
                var a = $(this).attr("timer");
                var b = $(this);
                clearTimeout(a), $(this).attr("timer", setTimeout(function() {
                    b.addClass("more-hover")
                }, 500))
            }, function() {
                var a = $(this).attr("timer");
                clearTimeout(a), $(this).removeClass("more-hover")
            }), e.publish("password.clear"), e.publish("password.Tips")
        }
    };
    return l
});