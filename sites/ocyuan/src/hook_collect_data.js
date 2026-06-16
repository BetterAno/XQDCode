// 综合 Hook 脚本 - 捕获 collectData 和 login 的加密过程
// 复制以下代码到浏览器 Console 执行

(function() {
    console.log('=== 开始安装 Hook ===');
    
    // 1. Hook XMLHttpRequest
    var _origOpen = XMLHttpRequest.prototype.open;
    var _origSend = XMLHttpRequest.prototype.send;
    
    XMLHttpRequest.prototype.open = function(method, url) {
        this._method = method;
        this._url = url;
        return _origOpen.apply(this, arguments);
    };
    
    XMLHttpRequest.prototype.send = function(data) {
        // 捕获 collectData 请求
        if (data && this._url && this._url.indexOf('collectData') >= 0) {
            console.log('\n========== collectData 请求 ==========');
            console.log('URL:', this._url);
            console.log('Method:', this._method);
            
            try {
                var parsed = JSON.parse(data);
                console.log('\n📦 请求体:');
                console.log('  type:', parsed.type);
                console.log('  challenge:', parsed.challenge);
                console.log('  verifyId:', parsed.verifyId);
                console.log('  collectData 长度:', parsed.collectData ? parsed.collectData.length : 0);
                console.log('  key 长度:', parsed.key ? parsed.key.length : 0);
                console.log('  callback:', parsed.callback);
                
                // 保存到全局变量
                window._collectDataRequest = {
                    url: this._url,
                    method: this._method,
                    data: parsed,
                    timestamp: Date.now()
                };
                
                console.log('\n✅ collectData 请求已捕获');
                console.log('=====================================\n');
            } catch(e) {
                console.error('解析错误:', e);
            }
        }
        
        // 捕获 login 请求
        if (data && this._url && this._url.indexOf('/v3/api/hotel/login') >= 0) {
            console.log('\n========== Login 请求 ==========');
            console.log('URL:', this._url);
            
            try {
                var parsed = JSON.parse(data);
                console.log('\n📦 请求体:');
                console.log('  username:', parsed.username);
                console.log('  password:', parsed.password);
                console.log('  secret_key_id:', parsed.secret_key_id);
                
                window._loginRequest = {
                    url: this._url,
                    data: parsed,
                    timestamp: Date.now()
                };
                
                console.log('\n✅ Login 请求已捕获');
                console.log('=====================================\n');
            } catch(e) {
                console.error('解析错误:', e);
            }
        }
        
        return _origSend.apply(this, arguments);
    };
    
    // 2. Hook JSON.stringify (捕获加密前的数据)
    var _origStringify = JSON.stringify;
    JSON.stringify = function(value, replacer, space) {
        // 检查是否包含 collectData
        if (value && typeof value === 'object' && value.collectData) {
            console.log('\n🔍 JSON.stringify 捕获到 collectData:');
            console.log('  原始对象:', value);
        }
        return _origStringify.apply(this, arguments);
    };
    
    // 3. 尝试 Hook 涂鸦验证码的加密函数
    // 搜索可能的加密函数
    setTimeout(function() {
        console.log('\n🔍 搜索加密函数...');
        
        // 搜索全局对象中的加密相关函数
        var possibleEncrypt = [];
        for (var key in window) {
            if (key.toLowerCase().indexOf('encrypt') >= 0 || 
                key.toLowerCase().indexOf('crypto') >= 0 ||
                key.toLowerCase().indexOf('yrule') >= 0) {
                possibleEncrypt.push(key);
            }
        }
        
        if (possibleEncrypt.length > 0) {
            console.log('找到的可能加密函数:', possibleEncrypt);
        }
    }, 2000);
    
    console.log('✅ Hook 安装完成！');
    console.log('📝 现在请完成验证码验证和登录');
    console.log('📊 Console 会自动捕获所有加密数据\n');
    
    return '✅ Hook installed successfully';
})();
