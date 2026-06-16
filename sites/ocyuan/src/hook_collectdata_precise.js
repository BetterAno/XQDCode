// 精准Hook collectData加密过程
(function() {
    console.log('=== 开始精准Hook collectData加密 ===\n');
    
    // 1. Hook XMLHttpRequest send
    var _origSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(data) {
        if (data && this._url && this._url.indexOf('collectData') >= 0) {
            console.log('\n========== 捕获collectData请求 ==========');
            console.log('URL:', this._url);
            
            try {
                var parsed = JSON.parse(data);
                console.log('\n📦 请求体:');
                console.log('  type:', parsed.type);
                console.log('  challenge:', parsed.challenge);
                console.log('  verifyId:', parsed.verifyId);
                console.log('  collectData长度:', parsed.collectData ? parsed.collectData.length : 0);
                console.log('  key长度:', parsed.key ? parsed.key.length : 0);
                console.log('  callback:', parsed.callback);
                
                // 保存到全局
                window._lastCollectData = parsed;
                
            } catch(e) {
                console.error('解析错误:', e);
            }
        }
        return _origSend.apply(this, arguments);
    };
    
    var _origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        this._method = method;
        this._url = url;
        return _origOpen.apply(this, arguments);
    };
    
    // 2. Hook JSON.stringify - 在序列化前捕获数据
    var _origStringify = JSON.stringify;
    JSON.stringify = function(value, replacer, space) {
        if (value && typeof value === 'object' && value.collectData && value.key) {
            console.log('\n🔍 JSON.stringify捕获:');
            console.log('  完整对象:', JSON.stringify(value, null, 2));
            
            // 尝试获取调用栈
            console.log('  调用栈:', new Error().stack);
        }
        return _origStringify.apply(this, arguments);
    };
    
    // 3. 尝试Hook CryptoJS.AES.encrypt
    if (typeof CryptoJS !== 'undefined' && CryptoJS.AES) {
        var _origAESEncrypt = CryptoJS.AES.encrypt;
        CryptoJS.AES.encrypt = function(message, key, cfg) {
            console.log('\n🔐 CryptoJS.AES.encrypt调用:');
            console.log('  message类型:', typeof message);
            console.log('  message:', message);
            console.log('  key:', key);
            console.log('  cfg:', cfg);
            console.log('  调用栈:', new Error().stack);
            
            var result = _origAESEncrypt.apply(this, arguments);
            console.log('  加密结果:', result.toString());
            return result;
        };
        console.log('✅ CryptoJS.AES.encrypt Hook成功');
    }
    
    // 4. Hook window.fetch
    if (window.fetch) {
        var _origFetch = window.fetch;
        window.fetch = function() {
            var url = arguments[0];
            if (typeof url === 'string' && url.indexOf('collectData') >= 0) {
                console.log('\n🌐 fetch调用collectData:', url);
                console.log('  参数:', arguments[1]);
                console.log('  调用栈:', new Error().stack);
            }
            return _origFetch.apply(this, arguments);
        };
    }
    
    console.log('\n✅ Hook安装完成！');
    console.log('📝 现在请点击登录按钮触发验证码\n');
    
    return '✅ Hook installed';
})();
