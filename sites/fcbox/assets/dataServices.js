define(function(require, exports, module) {
    'use strict';
    /**
     * 公共ajax服务模块
     *
     */
      //JD 服务token
    var DataServices = function() {
        this.init();
    };

    DataServices.prototype = {
        constructor: DataServices,

        init: function() {
            this.dataServices = [];
        },

        add: function(name, url, dataMap, action) {
            this.dataServices[name] = new CURD(url, dataMap, action);
        },

        get: function(name) {
            return this.dataServices[name];
        }
    };

    var CURD = function(url, dataMap, action) {
        this.action = $.extend(true, {
            query: {},
            create: {},
            update: {},
            remove: {}
        }, action);
        this.params = {url: url};
        this.dataMap = dataMap;
        this.init();
    };

    CURD.prototype = {
        constructor: CURD,

        init: function() {
            for (var x in this.action) {
                this[x] = function(type) {
                    return function(params){
                        return this.send(params, type);
                    };
                }(x);
            }
        },

        //发送信息
        send: function(params, type) {
            var _params = $.extend(true, {data: {}}, this.params, this.action[type], params);
            for (var x in this.dataMap) {
                if (_params.hasOwnProperty(x)) {
                    var reg = new RegExp(':\\b' + x + '\\b');
                    _params.url = _params.url.replace(reg, _params[x]);
                }
            }
            var timeout = 1600000;
            var requetType = _params.method || 'post';
            var url_Joint = _params.url_Joint ? _params.url_Joint : '';//动态拼接URL
            var url = url_Joint.length != 0 ? _params.url+'/'+url_Joint : _params.url;
            var header = '';
            var data =  _params.data || {};
            var httpHandler = $.Deferred();
            var resp = '';
            /*var _token_ = _params.customConfig ? _params.customConfig.FC_AUTHENTICATED_TOKEN ? _params.customConfig.FC_AUTHENTICATED_TOKEN : "" : "";*/
            if(requetType === 'post') {
                var paramConfigPost = {
                    url:url,
                    type:"POST",
                    dataType:'json',
                    data:data,
                    timeout:timeout
                };

                var postObj = $.extend(true,paramConfigPost,this.action[type].customConfig);
                resp = $.ajax(postObj);
            } else {
                var param = [];
                for(x in data){
                    param.push(x + '=' + data[x]);
                }
                // avalon.each(data, function(k, v) {
                // 	param.push(k + '=' + v);
                // });
                url += '?v='+(new Date()).getTime()+"&"+ param.join('&');
                var paramConfigGet = {
                    url:url,
                    type:"GET",
                    dataType:'json',
                    timeout:timeout
                };

                var getObj = $.extend(true,paramConfigGet,this.action[type].customConfig);
                resp = $.ajax(getObj);
            }

            return resp;
        }
    };

    var ins = new DataServices();
    var machine = "";
    switch (location.hostname) {
        //TODO 测试环境
        case "10.202.35.46":
          if(location.protocol=="https:"){
            machine = "https://10.202.35.46";
          }else{
            machine = '//'+location.hostname+':'+location.port
          }
            break;
        //TODO 生产环境
        case "fcbox.com":
            machine = "//";
            break;
        //TODO 默认本机
        default :
              machine = '//'+location.hostname+':'+location.port
    }
    //官网接口
    ins.add('fcbox',machine+'/:_method_',{_method_: '@_method_'}, {
        //获取公钥
        getPublicKey:{_method_: 'noshiro/getPublicKey', method: 'post', data: {}},
        //取消认证
        cancelAuth:{_method_: 'companyAuth/cancelAuth', method: 'post', data: {}},
    });
    return ins;
});