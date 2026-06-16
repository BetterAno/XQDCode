/**
 * Verify5 加密桥接模块 (Node.js 补环境方案)
 * 
 * 功能: 在 Node.js 中加载原始 v5.js SDK, 通过补环境执行加密函数
 * 用途: 
 *  1. 作为 Python 纯算法方案的对照验证
 *  2. 在 SDK 升级后快速恢复可用性
 *  3. 为其他 Verify5 实例提供通用解决方案
 * 
 * 用法:
 *   node core/bridge.js          # 测试模式
 *   node core/bridge.js --server # HTTP RPC 服务模式
 */

const fs = require('fs');
const path = require('path');

// ============================================================
// 最小补环境 (仅用于加密, 不涉及 DOM 操作)
// ============================================================
const MINIMAL_ENV = {
    // window 对象
    window: {},
    
    // navigator (模拟 Chrome 120 on Windows)
    navigator: {
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        platform: 'Win32',
        language: 'zh-CN',
        languages: ['zh-CN', 'zh', 'en-US', 'en'],
        cookieEnabled: true,
        doNotTrack: null,
        hardwareConcurrency: 8,
        maxTouchPoints: 0,
        vendor: 'Google Inc.',
        product: 'Gecko',
        productSub: '20030107',
        appName: 'Netscape',
        appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        webdriver: false,
        plugins: [],
        mimeTypes: [],
        deviceMemory: 8,
    },
    
    // document (最小模拟)
    document: {
        createElement: function(tag) {
            var el = {
                tagName: tag.toUpperCase(),
                style: {},
                setAttribute: function() {},
                getAttribute: function() { return null; },
                appendChild: function() {},
                removeChild: function() {},
            };
            
            if (tag === 'canvas') {
                el.getContext = function(type) {
                    if (type === '2d') {
                        return {
                            fillRect: function() {},
                            fillText: function() {},
                            getImageData: function() { return {data: []}; },
                            measureText: function() { return {width: 100}; },
                            rect: function() {},
                            arc: function() {},
                            beginPath: function() {},
                            closePath: function() {},
                            fill: function() {},
                            stroke: function() {},
                            isPointInPath: function() { return true; },
                            save: function() {},
                            restore: function() {},
                        };
                    }
                    if (type === 'webgl' || type === 'experimental-webgl') {
                        return null;  // Node.js 不支持真实 WebGL
                    }
                    return null;
                };
                el.toDataURL = function() { 
                    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
                };
            }
            
            return el;
        },
        querySelectorAll: function() { return []; },
        getElementById: function() { return null; },
        getElementsByTagName: function() { return []; },
        body: {
            appendChild: function() {},
            removeChild: function() {},
        },
        addEventListener: function() {},
        removeEventListener: function() {},
    },
    
    // localStorage (最小模拟)
    localStorage: {
        _data: {},
        getItem: function(key) { return this._data[key] || null; },
        setItem: function(key, value) { this._data[key] = value; },
        removeItem: function(key) { delete this._data[key]; },
    },
    
    // sessionStorage
    sessionStorage: {
        _data: {},
        getItem: function(key) { return this._data[key] || null; },
        setItem: function(key, value) { this._data[key] = value; },
    },
    
    // indexedDB
    indexedDB: null,
    
    // screen
    screen: {
        width: 1920,
        height: 1080,
        availWidth: 1920,
        availHeight: 1040,
        colorDepth: 24,
        pixelDepth: 24,
    },
    
    // location
    location: {
        href: 'https://www.verify5.com/demo',
        protocol: 'https:',
        host: 'www.verify5.com',
        hostname: 'www.verify5.com',
        port: '',
        pathname: '/demo',
        search: '',
        hash: '',
    },
    
    // Console
    console: {
        log: function() {},
        warn: function() {},
        error: function() {},
        info: function() {},
    },
    
    // Timers
    setTimeout: setTimeout,
    clearTimeout: clearTimeout,
    setInterval: setInterval,
    clearInterval: clearInterval,
    
    // JavaScript 内建
    Math: Math,
    Date: Date,
    JSON: JSON,
    parseInt: parseInt,
    parseFloat: parseFloat,
    String: String,
    Number: Number,
    Boolean: Boolean,
    Array: Array,
    Object: Object,
    Function: Function,
    RegExp: RegExp,
    Error: Error,
    TypeError: TypeError,
    Promise: Promise,
    Symbol: Symbol,
    Map: Map,
    Set: Set,
    WeakMap: WeakMap,
    WeakSet: WeakSet,
    Intl: Intl,
    ArrayBuffer: ArrayBuffer,
    Uint8Array: Uint8Array,
    Int8Array: Int8Array,
    Uint16Array: Uint16Array,
    Int16Array: Int16Array,
    Uint32Array: Uint32Array,
    Int32Array: Int32Array,
    Float32Array: Float32Array,
    Float64Array: Float64Array,
    DataView: DataView,
    TextEncoder: TextEncoder,
    TextDecoder: TextDecoder,
    atob: function(a) { return Buffer.from(a, 'base64').toString('binary'); },
    btoa: function(b) { return Buffer.from(b, 'binary').toString('base64'); },
};

// 建立循环引用
MINIMAL_ENV.window = MINIMAL_ENV;
MINIMAL_ENV.self = MINIMAL_ENV;
MINIMAL_ENV.top = MINIMAL_ENV;
MINIMAL_ENV.parent = MINIMAL_ENV;
MINIMAL_ENV.globalThis = MINIMAL_ENV;

// ============================================================
// 加载原始 Verify5 SDK
// ============================================================
function loadV5SDK() {
    const v5Path = path.join(__dirname, '..', 'assets', 'v5.js');
    
    if (!fs.existsSync(v5Path)) {
        console.error('v5.js not found at:', v5Path);
        console.error('Please run the main script first to download it.');
        return false;
    }
    
    const code = fs.readFileSync(v5Path, 'utf-8');
    
    try {
        const vm = require('vm');
        const script = new vm.Script(code);
        const context = vm.createContext(MINIMAL_ENV);
        script.runInContext(context);
        
        // 检查是否加载成功
        if (typeof MINIMAL_ENV.c12_ !== 'undefined') {
            console.log('Verify5 SDK loaded successfully');
            console.log('c12_ (CryptoJS) available:', typeof MINIMAL_ENV.c12_);
            return true;
        }
        
        console.error('Verify5 SDK loaded but c12_ not found');
        return false;
        
    } catch (e) {
        console.error('Failed to load Verify5 SDK:', e.message);
        return false;
    }
}

// ============================================================
// 加密函数封装 (用于外部调用)
// ============================================================
const bridge = {
    loaded: false,
    
    init: function() {
        this.loaded = loadV5SDK();
        return this.loaded;
    },
    
    /**
     * MurmurHash3 x64 128-bit
     */
    hash: function(data, seed) {
        seed = seed || 31;
        if (MINIMAL_ENV.c12_) {
            const hashFn = MINIMAL_ENV.c12_.x64hash128 || MINIMAL_ENV.c12_.hash;
            return hashFn(data, seed);
        }
        return null;
    },
    
    /**
     * Verify5 Y 解密 (XOR)
     */
    yDecrypt: function(encrypted, fp) {
        // 需要加载 SDK 后才能使用
        // 简化实现
        var start = fp.charCodeAt(fp.length - 1) % 2;
        var result = [];
        for (var i = start; i < encrypted.length; i += 2) {
            result.push(encrypted.charAt(i));
        }
        return result.join('');
    },
    
    /**
     * AES-CTR 加密
     */
    encrypt: function(data, key) {
        if (!MINIMAL_ENV.c12_) return null;
        
        // Use c12_ CryptoJS
        try {
            const Utf8 = MINIMAL_ENV.c12_.Utf8 || MINIMAL_ENV.c12_.enc.Utf8;
            const AES = MINIMAL_ENV.c12_.AES;
            const CTR = MINIMAL_ENV.c12_.CTR || MINIMAL_ENV.c12_.mode.CTR;
            const NoPadding = MINIMAL_ENV.c12_.NoPadding || MINIMAL_ENV.c12_.pad.NoPadding;
            const Base64 = MINIMAL_ENV.c12_.Base64 || MINIMAL_ENV.c12_.enc.Base64;
            const Hex = MINIMAL_ENV.c12_.Hex || MINIMAL_ENV.c12_.enc.Hex;
            
            var keyWords = Utf8.parse(key);
            var iv = Utf8.parse(Array(16).fill(0).map(function() {
                return '0123456789abcdef'[Math.floor(Math.random() * 16)];
            }).join(''));
            
            var encrypted = AES.encrypt(data, keyWords, {
                iv: iv,
                mode: CTR,
                padding: NoPadding,
            });
            
            var ivStr = iv.toString(Hex);
            var ctStr = encrypted.ciphertext.toString(Hex);
            
            return ivStr + ctStr;
            
        } catch (e) {
            console.error('Encryption failed:', e.message);
            return null;
        }
    },
    
    /**
     * AES-CTR 解密
     */
    decrypt: function(encryptedHex, key) {
        if (!MINIMAL_ENV.c12_) return null;
        
        try {
            const Utf8 = MINIMAL_ENV.c12_.Utf8 || MINIMAL_ENV.c12_.enc.Utf8;
            const AES = MINIMAL_ENV.c12_.AES;
            const CTR = MINIMAL_ENV.c12_.CTR || MINIMAL_ENV.c12_.mode.CTR;
            const NoPadding = MINIMAL_ENV.c12_.NoPadding || MINIMAL_ENV.c12_.pad.NoPadding;
            const Base64 = MINIMAL_ENV.c12_.Base64 || MINIMAL_ENV.c12_.enc.Base64;
            const Hex = MINIMAL_ENV.c12_.Hex || MINIMAL_ENV.c12_.enc.Hex;
            
            var keyWords = Utf8.parse(key);
            var iv = Hex.parse(encryptedHex.substring(0, 32));
            var ct = Hex.parse(encryptedHex.substring(32));
            
            var decrypted = AES.decrypt({
                ciphertext: ct,
            }, keyWords, {
                iv: iv,
                mode: CTR,
                padding: NoPadding,
            });
            
            return decrypted.toString(Utf8);
            
        } catch (e) {
            console.error('Decryption failed:', e.message);
            return null;
        }
    },
};

// ============================================================
// HTTP RPC 服务器模式 (供 Python 通过 HTTP 调用)
// ============================================================
function startRPCServer(port) {
    port = port || 8765;
    
    const http = require('http');
    
    const server = http.createServer(function(req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        
        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }
        
        var body = '';
        req.on('data', function(chunk) { body += chunk; });
        req.on('end', function() {
            try {
                var request = JSON.parse(body || '{}');
                var result = {success: false, error: 'Unknown method'};
                
                switch (request.method) {
                    case 'hash':
                        result = {
                            success: true,
                            data: bridge.hash(request.data, request.seed)
                        };
                        break;
                    case 'encrypt':
                        result = {
                            success: true,
                            data: bridge.encrypt(request.data, request.key)
                        };
                        break;
                    case 'decrypt':
                        result = {
                            success: true,
                            data: bridge.decrypt(request.data, request.key)
                        };
                        break;
                    case 'yDecrypt':
                        result = {
                            success: true,
                            data: bridge.yDecrypt(request.data, request.fp)
                        };
                        break;
                    case 'ping':
                        result = {success: true, data: 'pong'};
                        break;
                    default:
                        result = {success: false, error: 'Unknown method: ' + request.method};
                }
                
                res.writeHead(200);
                res.end(JSON.stringify(result));
                
            } catch (e) {
                res.writeHead(500);
                res.end(JSON.stringify({success: false, error: e.message}));
            }
        });
    });
    
    server.listen(port, function() {
        console.log('Verify5 RPC server listening on http://localhost:' + port);
        console.log('Endpoints:');
        console.log('  POST / - {"method":"hash|encrypt|decrypt|yDecrypt|ping", ...}');
    });
    
    return server;
}

// ============================================================
// 主入口
// ============================================================
function main() {
    const args = process.argv.slice(2);
    
    if (args.includes('--server')) {
        const portIdx = args.indexOf('--port');
        const port = portIdx !== -1 ? parseInt(args[portIdx + 1]) : 8765;
        
        if (!bridge.init()) {
            console.error('Failed to initialize bridge');
            process.exit(1);
        }
        
        startRPCServer(port);
        return;
    }
    
    // 测试模式
    console.log('=== Verify5 加密桥接测试 ===\n');
    
    if (!bridge.init()) {
        console.error('Bridge initialization failed');
        process.exit(1);
    }
    
    // 测试 MurmurHash3
    console.log('[MurmurHash3 Test]');
    var hashResult = bridge.hash('test_data_12345');
    console.log('Input: test_data_12345');
    console.log('Hash: ', hashResult);
    console.log('');
    
    // 测试 Y 解密
    console.log('[Y Decrypt Test]');
    var yResult = bridge.yDecrypt('abcdefghijklmnopqrstuv', 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6');
    console.log('Input: abcdefghijklmnopqrstuv');
    console.log('FP:    a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6');
    console.log('Result:', yResult);
    console.log('');
    
    // 测试 AES-CTR 加密/解密
    console.log('[AES-CTR Test]');
    var key = '0123456789abcdef';
    var plaintext = '{"test":"Hello Verify5!"}';
    var encrypted = bridge.encrypt(plaintext, key);
    var decrypted = bridge.decrypt(encrypted, key);
    console.log('Plaintext:', plaintext);
    console.log('Encrypted:', encrypted?.substring(0, 40) + '...');
    console.log('Decrypted:', decrypted);
    console.log('Match:', plaintext === decrypted ? 'PASS' : 'FAIL');
}

// 启动
if (require.main === module) {
    main();
}

module.exports = bridge;
