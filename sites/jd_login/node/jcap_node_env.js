/**
 * Node.js补环境 for jcap WASM
 * 提供浏览器环境的必要API，让jcap模块能在Node.js中运行
 */
const fs = require('fs');
const path = require('path');

// 加载jcap JS文件
const jcapPath = path.join(__dirname, '..', 'assets', 'js', 'jcap_ap0b2a.js');
const jcapCode = fs.readFileSync(jcapPath, 'utf-8');

console.log(`Loaded jcap_ap0b2a.js: ${jcapCode.length} chars`);

// 创建最小浏览器环境
global.window = global;
global.document = {
    createElement: () => ({}),
    getElementsByTagName: () => [],
    addEventListener: () => {},
    documentElement: { style: {} },
    cookie: '',
    referrer: '',
    title: 'Node.js',
};
global.navigator = {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    platform: 'Win32',
    language: 'zh-CN',
    appName: 'Netscape',
    appVersion: '5.0',
};
global.location = { href: 'https://captcha.jd.com', host: 'captcha.jd.com', protocol: 'https:' };
global.screen = { width: 1920, height: 1080, colorDepth: 24 };
global.XMLHttpRequest = function() {};
global.atob = (s) => Buffer.from(s, 'base64').toString('binary');
global.btoa = (s) => Buffer.from(s, 'binary').toString('base64');

// Define (AMD support - no-op)
global.define = undefined;

try {
    // Run the jcap code
    eval(jcapCode);
    
    console.log('jcap code evaluated successfully');
    
    if (global.jdCAP) {
        console.log('jdCAP available:', Object.keys(global.jdCAP));
        
        // Try to create captcha instance
        const Captcha = global.jdCAP.captcha;
        if (Captcha) {
            console.log('Captcha constructor found');
            
            const initFn = new Captcha({
                host: 'captcha.jd.com',
                tdat_version: 0,
                appType: 1,
                tdat_ctx: '',
                sen: 0,
                cs: 0
            });
            
            console.log('initFn type:', typeof initFn);
            
            // Try calling the init function
            if (typeof initFn === 'function') {
                initFn().then((instance) => {
                    console.log('Instance created!');
                    console.log('Instance type:', typeof instance);
                    if (instance) {
                        const keys = Object.keys(instance);
                        console.log('Instance keys:', keys);
                        
                        // Test getCTData
                        if (instance.getCTData) {
                            const testSi = 'dcr7_gABAAAGoUilqQIAMHJmrlhIvz9RIEm-mqcPKpQfZf1PlhBCZXXrczd1TqnROY7nt1r620knAe9_wX-AsAAAAAA';
                            try {
                                const ct = instance.getCTData([testSi, {}]);
                                console.log('CT result:', ct?.substring(0, 100));
                            } catch(e) {
                                console.log('CT error:', e.message);
                            }
                        }
                    }
                }).catch((e) => {
                    console.error('Init failed:', e.message);
                    console.error('Stack:', e.stack?.substring(0, 500));
                });
            }
        }
    } else {
        console.log('jdCAP not found on global');
    }
} catch(e) {
    console.error('Error running jcap:', e.message);
    console.error('Stack:', e.stack?.substring(0, 1000));
}
