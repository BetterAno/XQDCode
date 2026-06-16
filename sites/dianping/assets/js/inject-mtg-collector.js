/**
 * H5guard mtgsig 样本采集脚本
 * 注入浏览器后自动捕获 VM 输入/输出配对
 */
(function() {
  'use strict';

  window.__mtgSamples = [];
  window.__mtgCollectActive = true;

  // Hook XHR: 捕获 open URL 和 setRequestHeader mtgsig
  const origOpen = XMLHttpRequest.prototype.open;
  const origSetHeader = XMLHttpRequest.prototype.setRequestHeader;
  const origSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function(method, url) {
    this.__mtgMethod = method;
    this.__mtgUrl = url;
    return origOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.setRequestHeader = function(name, value) {
    if (name === 'mtgsig' && window.__mtgCollectActive) {
      try {
        const mtgObj = JSON.parse(value);
        const sample = {
          ts: Date.now(),
          url: this.__mtgUrl || '',
          method: this.__mtgMethod || '',
          mtgsig: mtgObj,
          // 提取关键字段
          a2: mtgObj.a2,
          a5: mtgObj.a5,
          a5_len: mtgObj.a5 ? mtgObj.a5.length : 0,
          a8: mtgObj.a8,
          d1: mtgObj.d1,
          // 尝试解码 a5
          a5_bytes: null,
          a5_hex: null,
        };

        try {
          const decoded = atob(mtgObj.a5);
          sample.a5_bytes = decoded.length;
          sample.a5_hex = Array.from(decoded)
            .map(b => b.charCodeAt(0).toString(16).padStart(2, '0'))
            .join('');
        } catch(e) {}

        // 提取 VM 缓存实例的 b[] 数组
        try {
          if (typeof aS !== 'undefined') {
            const vmKey = 'dfdb71b1fa2738418bb11c4f7d70fb2c';
            const vm = aS.prototype.d[vmKey];
            if (vm && vm.b) {
              sample.vm_b = vm.b.map((item, i) => {
                if (typeof item === 'function') return { idx: i, type: 'function', name: item.name || 'anon' };
                if (typeof item === 'string') return { idx: i, type: 'string', value: item.substring(0, 100), len: item.length };
                if (typeof item === 'number') return { idx: i, type: 'number', value: item };
                if (typeof item === 'boolean') return { idx: i, type: 'boolean', value: item };
                if (Array.isArray(item)) return { idx: i, type: 'array', len: item.length, preview: item.slice(0, 10) };
                if (item && typeof item === 'object') return { idx: i, type: 'object', keys: Object.keys(item).slice(0, 10) };
                return { idx: i, type: typeof item, value: String(item).substring(0, 50) };
              });
            }
          }
        } catch(e) {
          sample.vm_b_error = e.message;
        }

        window.__mtgSamples.push(sample);
        console.log(`[mtg-collect] Sample #${window.__mtgSamples.length}: ${sample.method} ${(sample.url || '').substring(0, 60)}`);
      } catch(e) {
        console.error('[mtg-collect] Parse error:', e.message);
      }
    }
    return origSetHeader.apply(this, arguments);
  };

  console.log('[mtg-collect] VM I/O tracker injected. Trigger requests to collect samples.');
})();
