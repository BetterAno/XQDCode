/**
 * overwrite by lijincheng 2016/12/01
 * login module
 */
define(function (require, exports, module) {
	require('jsencrypt');
  var dataServices = require('dataServices');
  window.fio('init', {
    fc_page: 'login'
  })
  
	var vm = avalon.define({
		$id: 'login',
		currUserInfo: {
			username: "",	//用户名
			password: "",	//密码
			encryptStr: "",	//加密密码
			verifyCode: ""	//验证码
		},
		// needVerifyCode: false,
		isLogin: false,
		loginWay: "vip",	//登录方式：'vip'，会员登录；'fast'，快捷登录
		errMsg: {
			errName: false,//用户名错误标记
			errPwd: false,	//密码错误标记
			errCode: false,	//验证码错误标记
			errTel: false,	//手机号错误标记
			errTelCode: false,	//手机验证码
			errImgCode: false,	//快速登录的图片验证码错误标志
			others: false	//其他错误标记
		},
		isValidCodeFast: false,	//快捷登录图片验证码是否正确
		isSendMsgClick: false,	//是否发送了手机验证码
		loginPhone: "",//快捷登录的手机号
		imgCode: "",	//快捷登录图形验证码
		validCode: "",	//快捷登录的短信验证码
		validateToken: "",	//快捷登录的令牌
		codeBtnText: "获取验证码", //获取验证码区域文字

		errorText: "",	//错误信息
		errorTextFromInner:false,
		loginBtnText: "登录",
		protocolChecked: false,
		toggleProtocolChecked: function () {
			vm.protocolChecked = !vm.protocolChecked
		},
		//切换登录方式
		changeTabClick: function () {
			var _this = $(this);
			if (!_this.hasClass('active')) {
				vm.clearData();
				_this.addClass('active');
				vm.loginWay = vm.loginWay == 'vip' ? 'fast' : 'vip';
				// vm.isSendMsgClick = false;
				// vm.codeBtnText = "获取验证码";
			} else {
				return;
			}

		},
		clearData: function () {
			vm.currUserInfo = {
				username: "",
				password: "",
				verifyCode: ""
			};
			vm.errMsg = {
				errName: false,
				errPwd: false,
				errCode: false,
				errTel: false,
				errImgCode: false,
				errTelCode: false,
				others: false
			};
			vm.loginPhone = "";
			vm.validCode = "";
			vm.validateToken = "";
			vm.errorText = "";
			vm.loginBtnText = "登录"
		},
		//获取用户信息并存储到cookie
		getUserInfo: function (params) {
			$.ajax({
				type: "POST",
				url: "/accountManage/userInfoGet",
				// data:data,
				contentType: "application/json",
				success: function (res) {
					if (res.code == 0) {
						setCookie("username", res.data.userName || res.data.mobile || res.data.realName);
						setCookie("mobile", res.data.mobile );
						setCookie("identityType", JSON.stringify(res.data.identityType));
						setCookie("userId", res.data.userId);

						window.GraySDK && window.GraySDK.checkGray();
						
						//删除当前目录下对应的cookie
						// delCookie('username', '/pages/user');
						if(!params.noRedirect){
							if (params.path) {
								window.location.href = params.path;	//重置密码后自动跳转到我的丰巢
							} else {
								window.location.href = '/index.html';
							}
						}
					} else {
						vm.errorText = res.chnDesc;
					}
				},
				fail: function () {
					avalon.log(params && params.path);
				}
			});

		},
		//校验规则
		regList: {
			specReg: /^[a-zA-Z0-9.@]+$/im,  //英文数字和‘.‘
			cellPhoneReg: /^((\+?86)|(\(\+86\)))?(1[3456789][0123456789][0-9]{8}|15[012356789][0-9]{8}|18[02356789][0-9]{8}|147[0-9]{8}|1349[0-9]{7})$/,//手机号码
			telPhoneReg: /^0[0-9]{2,3}-[0-9]{7}/, //固话
			checkCodeReg: /^[a-zA-Z0-9]{4}$/, //4位
			checkMsgCodeReg: /^[a-zA-Z0-9]{6}$/ //6位
		},
		//数据校验
		checkData: {
			validateName: function () {
				var reg1 = vm.regList.specReg.test(vm.currUserInfo.username);
				var reg2 = vm.regList.cellPhoneReg.test(vm.currUserInfo.username) || vm.regList.telPhoneReg.test(vm.currUserInfo.username);
				if (!vm.currUserInfo.username) {
					vm.errorText = "用户名不可以为空";
					vm.errMsg.errName = true;
					vm.errMsg.errCode = false;
					vm.errMsg.errPwd = false;
					return false;
				} else if (vm.currUserInfo.username.length > 50) {
					vm.errorText = "你输入的用户名过长，请重新输入";
					vm.errMsg.errName = true;
					vm.errMsg.errCode = false;
					vm.errMsg.errPwd = false;
					return false;
				} else if (!reg1 && !reg2) {
					vm.errorText = "你输入的格式不正确，请重新输入";
					vm.errMsg.errName = true;
					vm.errMsg.errCode = false;
					vm.errMsg.errPwd = false;
					return false;
				} else {
					vm.errorText = "";
					vm.errMsg.errName = false;
					vm.errMsg.errCode = false;
					vm.errMsg.errPwd = false;
					return true;
				}
			},
			validatePwd: function () {
				if (!vm.currUserInfo.password) {
					vm.errorText = "当前密码不可以为空";
					vm.errMsg.errName = false;
					vm.errMsg.errCode = false;
					vm.errMsg.errPwd = true;
					return false;
				} else {
					vm.errorText = "";
					vm.errMsg.errName = false;
					vm.errMsg.errCode = false;
					vm.errMsg.errPwd = false;
					return true;
				}


			},
			//校验快速登录的手机号
			validatePhone: function () {
				var reg = vm.regList.cellPhoneReg.test(vm.loginPhone);
				if (!vm.loginPhone) {
					vm.errorText = "手机号码不可以为空";
					vm.errMsg.errTel = true;
					vm.errMsg.errTelCode = false;
					vm.errMsg.errImgCode = false;
					return false;
				} else if (vm.loginPhone.length < 11) {
					vm.errorText = "请输入11位手机号";
					vm.errMsg.errTelCode = false;
					vm.errMsg.errImgCode = false;
					vm.errMsg.errTel = true;
					return false;
				} else if (!reg) {
					vm.errorText = "你输入的手机号码格式不正确";
					vm.errMsg.errTelCode = false;
					vm.errMsg.errImgCode = false;
					vm.errMsg.errTel = true;
					return false;
				} else {
					vm.errorText = "";
					vm.errMsg.errTelCode = false;
					vm.errMsg.errImgCode = false;
					vm.errMsg.errTel = false;
					return true;
				}
			},
			//校验快速登录的短信验证码
			validateMsg: function () {
				var reg = vm.regList.checkMsgCodeReg.test(vm.validCode);
				if (!vm.validCode) {
					vm.errorText = "验证码不可以为空";
					vm.errMsg.errTel = false;
					vm.errMsg.errImgCode = false;
					vm.errMsg.errTelCode = true;
					return false;
				}  else if (!reg) {
					vm.errorText = "请输入6位短信验证码";
					vm.errMsg.errTel = false;
					vm.errMsg.errImgCode = false;
					vm.errMsg.errTelCode = true;
					return false;
				} else {
					vm.errorText = "";
					vm.errMsg.errTel = false;
					vm.errMsg.errImgCode = false;
					vm.errMsg.errTelCode = false;
					return true;
				}
			},
			//会员登录校验
			validateAll: function () {
				if (vm.checkData.validateName()) {
					if (vm.checkData.validatePwd()) {
						return true;
					}
					return false;
				}
				return false;
			},
			//快捷登录校验
			fastValideAll: function () {
				if (vm.checkData.validatePhone()) {
					if (vm.checkData.validateMsg()) {
						return true;
					}
					return false;
				}
				return false;
			}

		},
		// checkNeedVerifyCode: function () {
		// 	if (!vm.checkData.validateName()) {
		// 		return;
		// 	}
		// 	var param = {
		// 		username: vm.currUserInfo.username
		// 	};
		// 	$.ajax({
		// 		type: "POST",
		// 		url: "/noshiro/loginNeedCaptcha",
		// 		data: param,
		// 		success: function (res) {
		// 			if (res.data == true) {
		// 				vm.needVerifyCode = true;
		// 			} else {
		// 				vm.needVerifyCode = false;
		// 			}
		// 		}
		// 	});
		// },
		//验证码格式正确后判定输入的验证码是否匹配
		checkCode: function () {
			var param = {
				verifyCode: vm.currUserInfo.verifyCode
			};
			$.ajax({
				type: "POST",
				url: "/captcha/validateVerifyCode",
				data: param,
				success: function (res) {
					if (res.code == 0) {
						vm.errMsg.errName = false;
						vm.errMsg.errPwd = false;
						vm.errMsg.errCode = false;
						vm.errorText = ""
					} else {
						vm.errMsg.errName = false;
						vm.errMsg.errPwd = false;
						vm.errMsg.errCode = true;
						vm.errorText = res.chnDesc;
						// $(".img-code img").trigger("click");
					}
				}
			});
		},
		checkCodeFast: function () {
			var param = {
				verifyCode: vm.imgCode
			};
			$.ajax({
				type: "POST",
				url: "/captcha/validateVerifyCode",
				data: param,
				success: function (res) {
					if (res.code == 0) {
						// vm.errMsg.errTel = false;
						// vm.errMsg.errTelCode = false;
						vm.errMsg.errImgCode = false;
						vm.isValidCodeFast = true;
						// vm.errorText = ""
					} else {
						vm.errMsg.errTel = false;
						vm.errMsg.errTelCode = false;
						vm.errMsg.errImgCode = true;
						vm.isValidCodeFast = false;
						vm.errorText = res.chnDesc;
						$("#verifyCodeFast").trigger("click");
					}
				}
			});
		},
		//会员登录
		vipLogin: function () {
			if (!vm.protocolChecked) {
				vm.toast('请查看并同意服务条款')
				return
			}
			if (!vm.checkData.validateAll()) {
				return;
			}
			var submitFn = (verifyCode) => {
				var data = {
					username: vm.currUserInfo.username,
					password: vm.currUserInfo.encryptStr,
					verifyCode
				};
				// if (vm.currUserInfo.verifyCode) {//需要验证码时，请求参数加上验证码
				// 	data.verifyCode = vm.currUserInfo.verifyCode;
				// }
				// if (vm.needVerifyCode) {//输入三次及以上需要验证码
				// 	data.verifyCode = vm.currUserInfo.verifyCode;
				// 	if (!data.verifyCode) {
				// 		return;
				// 	}
				// }
				if (vm.loginBtnText == "登录中...") {
					return;
				}
				//获取公钥
				dataServices.get("fcbox").getPublicKey().done(function (req) {
					if (req.code == 0) {
						var encrypt = new JSEncrypt();
						var time = new Date().getTime();
						encrypt.setPublicKey(req.data);
						var pwd = vm.currUserInfo.password;
						data.password = encrypt.encrypt(pwd);
						vm.loginFun(data);
					}
				}).fail(function () {

				});
			}
			// 滑块验证登录
			new fcSliderCaptcha({
				success: function (data) {
					submitFn(data.token)
				}
			})
		},
		//快捷登录
		fastLogin: function () {
			if (!vm.protocolChecked) {
				vm.toast('请查看并同意服务条款')
				return
			}
			if (!vm.checkData.fastValideAll()) {
				return;
			}
			/*if(!vm.isValidCodeFast){
				vm.errorText = "图片验证码校验失败";
				vm.errMsg.errImgCode = true;
				return;
			}*/
			//验证短信验证码
			// vm.checkPhoneMsg();
			if (!vm.validateToken) {
				vm.errorText = "短信验证码校验失败";
				vm.errMsg.errTelCode = true;
				return;
			}

			var data = {
				username: vm.loginPhone,
				validateToken: vm.validateToken, // 实时校验时返回的validateToken的值
				loginType: 4
			};
			vm.loginFun(data);
		},
		//校验短信验证码
		checkPhoneMsg: function () {
			if (!vm.checkData.validateMsg()) { return; }
			var confirmFn = (token) => {
				var param = {
					mobilePhone: vm.loginPhone,
					smsType: 5,
					validCode: vm.validCode,
				};
				if(token){
					param.validPictureCode = token
				}
				$.ajax({
					type: "POST",
					url: "/noshiro/validatePhoneMessage",
					data: param,
					success: function (res) {
						if (res.code == 0) {
							vm.errorText = "";
							vm.validateToken = res.data.validateToken || "";
							return true;
						} else if(res.code == 119) {
							// 错误码119，代表错误三次，需要重新拉取滑块
							new fcSliderCaptcha({
								success: function (data) {
									confirmFn(data.token)
								}
							})
							return false;
						} else {
							vm.errMsg.errTelCode = true;
							vm.errorText = res.chnDesc;
							return false;
						}
					}
				});
			}
			confirmFn()
		},
		getPhoneMsg: function () {
			// if(vm.errorText) {return;}
			if (!vm.checkData.validatePhone()) {
				return;
			}
			/*if(vm.loginWay=='fast'&&!vm.isValidCodeFast){
				vm.errorText = "验证码校验失败";
				vm.errMsg.errImgCode;
				return;
			}*/
			if (vm.isSendMsgClick) {
				return;
			}

			var submitFn = (validCode) => {
				vm.codeBtnText = "获取中...";
				var param = {
					mobilePhone: vm.loginPhone,               // 手机号
					smsType: 5, // smsType为5表示获取的是手机验证登录的验证码
					validCode
				};

				$.ajax({
					type: "POST",
					url: "/noshiro/retrievePhoneMessageAttacksShameless",
					data: param,
					success: function (res) {
						if (res.code == '0') {
							vm.isSendMsgClick = true;
							vm.countTimes(180);
						} else {
							vm.isSendMsgClick = false;
							vm.codeBtnText = "重新获取";
							vm.errorText = res.chnDesc;
							vm.loginWay == 'vip' ? $("#verifyCode").trigger("click") : $("#verifyCodeFast").trigger("click");
						}

					},
					error: function (res) {
						vm.isSendMsgClick = false;
						vm.codeBtnText = "重新获取";
						vm.errorText = "获取验证码失败";
						vm.loginWay == 'vip' ? $("#verifyCode").trigger("click") : $("#verifyCodeFast").trigger("click");
					}
				});
			}
			
			// 滑块验证登录
			new fcSliderCaptcha({
				success: function (data) {
					submitFn(data.token)
				}
			})
		},
		//倒计时功能
		countTimes: function (num) {//num秒数
			// vm.isSendMsgClick = true;
			var timer = setInterval(function () {
				vm.codeBtnText = num + 's';
				num--;
				if (num <= 0) {
					clearInterval(this)
				}
			}, 1000);
			setTimeout(function () {
				clearInterval(timer);
				vm.codeBtnText = "重新获取";
				vm.isSendMsgClick = false;
			}, 181000);

		},
		//登录
		loginFun: function (data, path) {	//path： 登录成功后跳转页面名称，默认跳转到首页
			// console.log(data.userName);
			// console.log(vm.currUserInfo.username);
			if (vm.loginBtnText == "登录中...") {
				return;
			}
      const redirectUrl =  path ? path : sessionStorage.getItem('redirectUrl') ? decodeURIComponent(sessionStorage.getItem('redirectUrl')) : '';

			//登录请求配置
			var loginObj = {
				type: "GET",
				url: "/passport/login",
				data: data,
				beforeSend: function () {
					vm.loginBtnText = "登录中..."
				},
				success: function (res) {
					vm.loginBtnText = "登录";
					res = JSON.parse(res);
					if (res.code == 0) {
						//清空错误信息
						vm.errMsg = { errName: false, errPwd: false, errCode: false, others: false };
						//setCookie("username", data.username||"");
						if (redirectUrl) {
							vm.getUserInfo({path:redirectUrl});
						} else {
							vm.getUserInfo({});//获取用户信息并存入cookie;
						}
					} else if(res.code == 113){
						//清空错误信息
						vm.errMsg = { errName: false, errPwd: false, errCode: false, others: false };
						//setCookie("username", data.username||"");
						// vm.errorText = res.chnDesc;
						vm.errorTextFromInner = true;
						vm.getUserInfo({noRedirect:true});//获取用户信息并存入cookie;
					
					}else {
						if (!path) {
							// vm.needVerifyCode = res.data;
							// if (vm.needVerifyCode) {
							// 	vm.loginWay == 'vip' ? $("#verifyCode").trigger("click") : $("#verifyCodeFast").trigger("click");

							// }
							avalon.log(res.chnDesc);
							vm.errorText = res.chnDesc;
						} else {
							window.location.href = "/pages/user/login.html";
						}

					}
				},
				error: function (res) {
					// if (vm.currUserInfo.verifyCode) {
					// 	vm.loginWay == 'vip' ? $("#verifyCode").trigger("click") : $("#verifyCodeFast").trigger("click");;//刷新验证码
					// }
					res = JSON.parse(res);
					// vm.needVerifyCode = res.data;
					vm.errorText = res.chnDesc;
				}
			};
			$.ajax(loginObj);
		},
		//输入框获取焦点时的操作 验证码需要参数
		focusInput: function (param) {
			var _this = $(this);
			if (param == 'nomal') {
				_this.parent().addClass('active');
			} else if (param == 'code') {
				_this.addClass('active');
			}
		},
		//输入框失去焦点时的操作
		blurInput: function (opts) {
			var _this = $(this);
			opts == 'code' ? _this.removeClass('active') : _this.parent().removeClass('active');

		},
		//记住用户名
		remenberName: function () {
			var _this = $(this);
			_this.find(".checkbox").toggleClass("checkbox-active");
		},
		init: function () {

		},
		toast(text) {
			if (vm.toastTarget) return
			var target = vm.toastTarget = document.createElement('div')
			var toastHtml = '<div style="width:200px;height:60px;background-color:rgba(0, 0, 0, 0.5);position:fixed;left:0;right:0;top:0;bottom:0;margin:auto;font-size:16px;color:#ffffff;line-height:60px;text-align:center" >' + text + '</div>'
			target.innerHTML = toastHtml
			document.body.appendChild(target)
			setTimeout(function(){
				document.body.removeChild(target)
				vm.toastTarget = null
			}, 3000)
		}
	});
	avalon.scan();
	return vm;
});

