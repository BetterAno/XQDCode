/**
 * 今日头条 a_bogus 加密参数 - 本地补环境实现
 * 目标: 获取科技频道文章标题
 * 网站: https://www.toutiao.com/
 * 
 * 根据补环境定义规范实现 (大厂标准)
 */

// ========== 1. 核心工具函数 ==========

/**
 * 原生伪装函数 (大厂标准)
 */
function managerNative(fn, name) {
    const fake = function () { 
        return `function ${name || fn.name}() { [native code] }`; 
    };
    Object.defineProperty(fn, 'toString', {
        value: fake,
        configurable: true, 
        enumerable: false, 
        writable: true
    });
    return fn;
}

/**
 * 参数感知型监控代理
 */
function watch(obj, name) {
    if (typeof obj !== 'object' || obj === null) return obj;
    const SYMBOL_PROXY = Symbol("isProxy");
    if (obj[SYMBOL_PROXY]) return obj;

    return new Proxy(obj, {
        get: function (target, property, receiver) {
            let value;
            try {
                value = target[property];
                const type = typeof value;

                if (typeof property !== 'symbol') {
                    console.log(`[读取] => ${name}.${String(property)}, 类型: ${type}`);
                }

                if (type === "function") {
                    return function (...args) {
                        console.log(`[参数调用] => ${name}.${String(property)}(${args.slice(0, 2).join(', ')})`);
                        const result = value.apply(this, args);
                        if (result === undefined || result === null) {
                            console.log(`@@@MISSING@@@${name}.${String(property)}`);
                        }
                        return result;
                    };
                }
            } catch (e) {
                console.log(`[异常] => ${name}.${String(property)}: ${e.message}`);
            }

            if (value !== null && typeof value === 'object') {
                return watch(value, `${name}.${String(property)}`);
            }
            return value;
        }
    });
}

// ========== 2. 浏览器环境补全 ==========

// Window 对象
function Window() {}
window = globalThis;
window.self = window;
window.top = window;
window.innerWidth = 1535;
window.innerHeight = 743;
window.outerWidth = 1536;
window.outerHeight = 864;
window.screenX = 8;
window.screenY = 8;

// Chrome 对象
window.chrome = {
    app: {
        isInstalled: false,
        InstallState: { DISABLED: "disabled", INSTALLED: "installed", NOT_INSTALLED: "not_installed" },
        RunningState: { CANNOT_RUN: "cannot_run", READY_TO_RUN: "ready_to_run", RUNNING: "running" }
    },
    runtime: {}
};

// 事件监听
window.addEventListener = managerNative(function(type, listener) {}, 'addEventListener');
window.removeEventListener = managerNative(function(type, listener) {}, 'removeEventListener');

// matchMedia
window.matchMedia = managerNative((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => true
}), 'matchMedia');

// Screen 对象
screen = {
    availHeight: 800,
    availWidth: 1280,
    colorDepth: 32,
    height: 800,
    orientation: { angle: 0, type: "landscape-primary", onchange: null },
    pixelDepth: 32,
    width: 1280
};

// Navigator 对象
navigator = {
    appCodeName: "Mozilla",
    appName: "Netscape",
    appVersion: "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
    cookieEnabled: true,
    deviceMemory: 8,
    hardwareConcurrency: 20,
    language: "zh-CN",
    languages: ["zh-CN"],
    onLine: true,
    platform: "Win32",
    product: "Gecko",
    productSub: "20030107",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
    vendor: "Google Inc.",
    vendorSub: "",
    pdfViewerEnabled: true,
    webdriver: false
};

// Location 对象
location = {
    ancestorOrigains: {},
    href: "https://www.toutiao.com/?wid=1659882176248",
    origin: "https://www.toutiao.com",
    protocol: "https:",
    host: "www.toutiao.com",
    hostname: "www.toutiao.com",
    port: "",
    pathname: "/",
    search: "?wid=1659882176248",
    hash: ""
};

// Document 对象
function HTMLDocument() {
    this.hidden = false;
    this.currentScript = null;
    this.wasDiscarded = false;
    this.referrer = '';
    this.cookie = 'ttwid=1%7CQyBqMjN4cGV5cVhOVXg3VGpGcG1KdHhfb0xWS0pYMzJ3aEJMOHpfN1Ek%7C1775708616%7C1234567890abcdef; msToken=8ylJ54lgeSMBtd8YK4kS7JZMxAeO3wjuSZWNcOS-YHJlNwqjbc9_iMCCHOOdihuNpM-ZIALIo4DoVKlx-QPOSq_JGQ6ZAkJEL8qZ9mkkoAWvAmynVMehfaC-ehelMPc=';
}

function HTMLHtmlElement() {
    this.style = {};
}

documentElement = new HTMLHtmlElement();

HTMLDocument.prototype.documentElement = documentElement;
HTMLDocument.prototype.addEventListener = managerNative(function(type, listener) {}, 'addEventListener');
HTMLDocument.prototype.querySelector = managerNative(function(selector) {
    console.log(`[querySelector] ${selector}`);
    return null;
}, 'querySelector');

HTMLDocument.prototype.createElement = managerNative(function(tagName) {
    console.log(`[createElement] ${tagName}`);
    const element = {
        tagName: tagName.toUpperCase(),
        nodeName: tagName.toUpperCase(),
        nodeType: 1,
        style: {},
        appendChild: function() {},
        setAttribute: function() {}
    };
    return element;
}, 'createElement');

HTMLDocument.prototype.getElementsByTagName = managerNative(function(tagName) {
    console.log(`[getElementsByTagName] ${tagName}`);
    return [];
}, 'getElementsByTagName');

document = new HTMLDocument();

// Canvas 环境 (头条检测指纹)
function CanvasRenderingContext2D() {
    this.direction = "ltr";
    this.fillStyle = "#000000";
    this.filter = "none";
    this.font = "10px sans-serif";
    this.globalAlpha = 1;
    this.lineWidth = 1;
    this.lineCap = "butt";
    this.lineJoin = "miter";
    this.miterLimit = 10;
    this.shadowColor = "rgba(0, 0, 0, 0)";
    this.strokeStyle = "#000000";
    this.textAlign = "start";
    this.textBaseline = "alphabetic";
}

CanvasRenderingContext2D.prototype.fillText = managerNative(function() {}, 'fillText');
CanvasRenderingContext2D.prototype.measureText = managerNative(function() {
    return { width: 100 };
}, 'measureText');

can_2d = new CanvasRenderingContext2D();

function HTMLCanvasElement() {
    this.style = { display: '' };
    this.width = 300;
    this.height = 150;
}

HTMLCanvasElement.prototype.getContext = managerNative(function(contextId) {
    console.log(`[getContext] ${contextId}`);
    if (contextId === '2d') return can_2d;
    if (contextId === 'webgl') return null;
    return null;
}, 'getContext');

HTMLCanvasElement.prototype.toDataURL = managerNative(function() {
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
}, 'toDataURL');

canvas = new HTMLCanvasElement();

// Time 函数
const fixedTimestamp = Date.now();
Date.now = managerNative(function() {
    return fixedTimestamp;
}, 'now');

// ========== 3. 应用监控 ==========

window = watch(window, 'window');
document = watch(document, 'document');
navigator = watch(navigator, 'navigator');
screen = watch(screen, 'screen');
location = watch(location, 'location');

console.log('✅ 基础环境补全完成');

// ========== 4. a_bogus 加密逻辑分析与实现 ==========

/**
 * a_bogus 生成逻辑分析 (基于浏览器捕获):
 * 
 * 真实 a_bogus 示例:
 * QjR0/d0gmE2TvfyZ5lVLfY3qV-P3YhMr0t9bMDhqDdfZLL39HMT19exoGtzvIzWjE4/0IeWjy4hbYNcQrQAn8NgUHW4x/2nM-hbdte-25xSi5q4reyUgrsJNmkJ5tlc25klIE/iMow2aSYuhl9Fe-XKAO6ZCcrtswytrGI/bXfR3E-6/WE==
 * 
 * 特征:
 * - 长度: 约 180 字符
 * - 编码: Base64 变种 (使用 - 和 _ 替代 + 和 /)
 * - 包含: 时间戳、URL 参数、浏览器指纹、随机数
 * - 算法: 可能是 HMAC-SHA256 或自定义加密
 * 
 * 生成步骤推测:
 * 1. 收集请求参数 (URL、msToken、时间戳)
 * 2. 收集浏览器指纹 (Canvas、UserAgent、Screen)
 * 3. 混合加密生成签名
 * 4. Base64 编码输出
 */

/**
 * a_bogus 生成函数 (简化版本 - 需要进一步完善)
 * 
 * @param {Object} params - 请求参数
 * @returns {String} a_bogus 加密值
 */
function generateABogus(params) {
    console.log('\n========== 开始生成 a_bogus ==========');
    
    // 1. 收集请求参数
    const urlParams = {
        offset: params.offset || 0,
        channel_id: params.channel_id || 94349549395,
        max_behot_time: params.max_behot_time || 0,
        category: params.category || 'pc_profile_channel',
        disable_raw_data: params.disable_raw_data !== undefined ? params.disable_raw_data : true,
        aid: params.aid || 24,
        app_name: params.app_name || 'toutiao_web',
        msToken: params.msToken || ''
    };
    
    console.log('请求参数:', urlParams);
    
    // 2. 收集浏览器指纹
    const fingerprint = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screen: `${screen.width}x${screen.height}`,
        colorDepth: screen.colorDepth,
        deviceMemory: navigator.deviceMemory,
        hardwareConcurrency: navigator.hardwareConcurrency,
        timezone: new Date().getTimezoneOffset(),
        canvas: getCanvasFingerprint()
    };
    
    console.log('浏览器指纹:', fingerprint);
    
    // 3. 时间戳
    const timestamp = Date.now();
    console.log('时间戳:', timestamp);
    
    // 4. 生成签名 (这里需要逆向真实的加密算法)
    // 注意: 这是简化版本，真实算法需要进一步逆向
    const signData = JSON.stringify({
        params: urlParams,
        fingerprint: fingerprint,
        timestamp: timestamp
    });
    
    // 使用简单的哈希模拟 (实际需要头条的加密算法)
    const bogus = simpleEncrypt(signData);
    
    console.log('生成的 a_bogus:', bogus);
    console.log('========== 生成完成 ==========\n');
    
    return bogus;
}

/**
 * Canvas 指纹获取
 */
function getCanvasFingerprint() {
    try {
        const canvas = document.createElement('canvas');
        canvas.width = 200;
        canvas.height = 50;
        const ctx = canvas.getContext('2d');
        
        ctx.textBaseline = "top";
        ctx.font = "14px 'Arial'";
        ctx.fillStyle = "#f60";
        ctx.fillRect(125, 1, 62, 20);
        ctx.fillStyle = "#069";
        ctx.fillText("toutiao", 2, 15);
        ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
        ctx.fillText("toutiao", 4, 17);
        
        return canvas.toDataURL().slice(-20);
    } catch (e) {
        return 'unknown';
    }
}

/**
 * 简单加密 (模拟头条算法 - 需要替换为真实算法)
 */
function simpleEncrypt(data) {
    // 这是一个占位符，实际需要逆向头条的真实加密算法
    // 可以使用 CryptoJS 实现 HMAC-SHA256
    
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
        const char = data.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    
    // 生成类似真实 a_bogus 的格式
    const base64 = btoa(String(Math.abs(hash))).replace(/\+/g, '-').replace(/\//g, '_');
    return base64 + '==';
}

// ========== 5. 测试代码 ==========

console.log('\n========== 开始测试 ==========');

// 构造请求参数 (科技频道)
const requestParams = {
    offset: 0,
    channel_id: 94349549395,  // 科技频道
    max_behot_time: 0,
    category: 'pc_profile_channel',
    disable_raw_data: true,
    aid: 24,
    app_name: 'toutiao_web',
    msToken: '8ylJ54lgeSMBtd8YK4kS7JZMxAeO3wjuSZWNcOS-YHJlNwqjbc9_iMCCHOOdihuNpM-ZIALIo4DoVKlx-QPOSq_JGQ6ZAkJEL8qZ9mkkoAWvAmynVMehfaC-ehelMPc='
};

// 生成 a_bogus
const aBogus = generateABogus(requestParams);

// 构造完整 URL
const baseUrl = 'https://www.toutiao.com/api/pc/list/feed';
const queryString = Object.entries(requestParams)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
const fullUrl = `${baseUrl}?${queryString}&a_bogus=${encodeURIComponent(aBogus)}`;

console.log('完整请求 URL:');
console.log(fullUrl);
console.log('\n========== 测试完成 ==========');
console.log('\n💡 下一步:');
console.log('1. 使用浏览器调试，Hook 头条真实的 a_bogus 生成函数');
console.log('2. 逆向加密算法，替换 simpleEncrypt 函数');
console.log('3. 使用 HTTP 客户端 (如 axios) 发起请求获取数据');
