// 验证码 verify 请求 Hook 脚本
// 在浏览器控制台中执行此脚本，然后触发验证码验证

(function() {
  if (window.__verifyHookInstalled) {
    console.log('[VERIFY-HOOK] Already installed');
    return;
  }
  
  const origOpen = XMLHttpRequest.prototype.open;
  const origSend = XMLHttpRequest.prototype.send;
  const origSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
  
  window.__verifyHookInstalled = true;
  window.__verifyCaptureLog = [];
  
  XMLHttpRequest.prototype.open = function(method, url) {
    this.__hookMethod = method;
    this.__hookUrl = url;
    this.__hookHeaders = {};
    return origOpen.apply(this, arguments);
  };
  
  XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
    if (this.__hookHeaders) {
      this.__hookHeaders[header] = value;
    }
    return origSetRequestHeader.apply(this, arguments);
  };
  
  XMLHttpRequest.prototype.send = function(body) {
    if (this.__hookUrl && this.__hookUrl.includes('/captcha/verify')) {
      const capture = {
        timestamp: Date.now(),
        method: this.__hookMethod,
        url: this.__hookUrl,
        body: body,
        bodyLength: body ? body.length : 0,
        headers: this.__hookHeaders || {},
        readyState: this.readyState
      };
      
      window.__verifyCaptureLog.push(capture);
      
      console.log('='.repeat(80));
      console.log('[VERIFY-HOOK] 🎯 Captured verify request!');
      console.log('='.repeat(80));
      console.log('[VERIFY-HOOK] URL:', capture.url);
      console.log('[VERIFY-HOOK] Method:', capture.method);
      console.log('[VERIFY-HOOK] Body length:', capture.bodyLength);
      console.log('[VERIFY-HOOK] Body preview:', capture.body ? capture.body.substring(0, 200) : 'none');
      console.log('[VERIFY-HOOK] Full body stored in: window.__verifyCaptureLog[' + (window.__verifyCaptureLog.length - 1) + ']');
      console.log('='.repeat(80));
    }
    return origSend.apply(this, arguments);
  };
  
  // Also hook fetch
  const origFetch = window.fetch;
  window.fetch = function(url, options) {
    if (typeof url === 'string' && url.includes('/captcha/verify')) {
      const capture = {
        timestamp: Date.now(),
        method: options?.method || 'GET',
        url: url,
        body: options?.body,
        bodyLength: options?.body ? options.body.length : 0,
        headers: options?.headers || {},
        type: 'fetch'
      };
      
      window.__verifyCaptureLog.push(capture);
      console.log('[VERIFY-HOOK] 🎯 Captured fetch verify request!');
      console.log('[VERIFY-HOOK] URL:', capture.url);
      console.log('[VERIFY-HOOK] Body length:', capture.bodyLength);
    }
    return origFetch.apply(this, arguments);
  };
  
  console.log('='.repeat(80));
  console.log('[VERIFY-HOOK] ✅ Hooks installed successfully!');
  console.log('[VERIFY-HOOK] 📝 Captured data will be stored in: window.__verifyCaptureLog');
  console.log('[VERIFY-HOOK] 🎯 Now please trigger captcha verify (drag slider)...');
  console.log('='.repeat(80));
  
})();
