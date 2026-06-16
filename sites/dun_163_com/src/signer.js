/**
 * 网易易盾验证码 - Node.js 补环境加密签名器
 * 通过 vm 沙盒加载原始 SDK JS，拦截 XHR 捕获加密参数
 * 只负责生成加密数据，不发送实际 HTTP 请求
 */
const vm = require('vm');
const fs = require('fs');
const path = require('path');
const { createSandbox } = require('./env/browser');

const JS_DIR = path.resolve(__dirname, 'env/sdk');
const _captures = [];  // 模块级捕获队列

function wait(ms) {
    return new Promise(r => setTimeout(r, ms));
}

function parseUrlParams(url) {
    const parsed = new URL(url, 'https://dun.163.com');
    const params = {};
    for (const [key, value] of parsed.searchParams.entries()) {
        params[key] = value;
    }
    return params;
}

// XHR 捕获器 - 只记录请求，不发送
class CaptureXHR {
    constructor() {
        this.readyState = 0;
        this.status = 0;
        this.responseText = '';
        this.response = '';
        this._method = '';
        this._url = '';
        this._headers = {};
        this._events = {};
    }
    open(method, url) { this._method = method; this._url = url; this.readyState = 1; }
    setRequestHeader(k, v) { this._headers[k] = v; }
    send(body) {
        _captures.push({ url: this._url, body, method: this._method });
        this.status = 200;
        this.responseText = '{"code":200,"data":{"tk":"placeholder"}}';
        this.response = this.responseText;
        this.readyState = 4;
        this._fire('load');
        this._fire('readystatechange');
    }
    abort() {}
    getAllResponseHeaders() { return 'content-type: text/plain'; }
    getResponseHeader() { return null; }
    addEventListener(t, h) { (this._events[t] = this._events[t] || []).push(h); }
    removeEventListener() {}
    _fire(t) {
        (this._events[t] || []).forEach(h => { try { h.call(this); } catch(e) {} });
        if (typeof this['on' + t] === 'function') try { this['on' + t](); } catch(e) {}
    }
    overrideMimeType() {}
}

function installScriptCapture(sandbox, options = {}) {
    const captures = [];
    const originalAppend = new Map();
    const targets = [
        sandbox.document && sandbox.document.head,
        sandbox.document && sandbox.document.body,
        sandbox.document && sandbox.document.documentElement,
    ].filter(Boolean);

    function fireScriptLoad(script) {
        try {
            if (typeof script.onload === 'function') script.onload.call(script);
            if (typeof script.onreadystatechange === 'function') {
                script.readyState = 'complete';
                script.onreadystatechange.call(script);
            }
            if (typeof script.dispatchEvent === 'function') script.dispatchEvent({ type: 'load' });
        } catch (e) {}
    }

    function emitJsonp(url) {
        let parsed;
        try { parsed = new URL(url, 'https://dun.163.com'); } catch (e) { return; }
        const callback = parsed.searchParams.get('callback');
        if (!callback || typeof sandbox[callback] !== 'function') return;

        let payload = null;
        if (url.includes('/api/v3/get')) {
            payload = {
                data: {
                    bg: ['https://necaptcha.nosdn.127.net/mock-bg.jpg'],
                    front: ['https://necaptcha.nosdn.127.net/mock-front.png'],
                    token: options.token || parsed.searchParams.get('token') || 'mock_token',
                    type: 2,
                    waitTime: 300,
                    zoneId: options.zoneId || parsed.searchParams.get('zoneId') || 'CN31',
                },
                error: 0,
                msg: 'ok',
            };
        } else if (url.includes('/api/v3/check')) {
            payload = {
                data: {
                    result: false,
                    token: options.token || parsed.searchParams.get('token') || 'mock_token',
                    validate: '',
                    zoneId: options.zoneId || parsed.searchParams.get('zoneId') || 'CN31',
                },
                error: 0,
                msg: 'ok',
            };
        } else if (url.includes('/api/v2/getconf')) {
            payload = {
                data: {
                    dt: options.dt || '',
                    zoneId: options.zoneId || 'CN31',
                    ac: {},
                    ir: { enable: 0 },
                },
                error: 0,
                msg: 'ok',
            };
        }
        if (payload) {
            try { sandbox[callback](payload); } catch (e) {}
        }
    }

    for (const target of targets) {
        if (!target || typeof target.appendChild !== 'function') continue;
        originalAppend.set(target, target.appendChild.bind(target));
        target.appendChild = function(child) {
            const result = originalAppend.get(target)(child);
            if (child && String(child.tagName || '').toUpperCase() === 'SCRIPT' && child.src) {
                captures.push({ type: 'script', url: child.src });
                sandbox.setTimeout(() => {
                    emitJsonp(child.src);
                    fireScriptLoad(child);
                }, 0);
            }
            return result;
        };
    }

    sandbox.__scriptCaptures = captures;
    return captures;
}

function loadCoreContext(config = {}) {
    const sandbox = createSandbox({ baseUrl: config.referer || 'https://dun.163.com/trial/jigsaw' });
    sandbox.XMLHttpRequest = function() { return new CaptureXHR(); };
    sandbox.Bun = undefined;
    sandbox.Deno = undefined;
    sandbox.process = { versions: {}, env: {}, nextTick: process.nextTick, browser: true };
    sandbox.__dirname = '/';
    sandbox.__filename = '';
    sandbox.global = sandbox;
    sandbox.__clearCaptured && sandbox.__clearCaptured();
    const scriptCaptures = installScriptCapture(sandbox, config);

    const context = vm.createContext(sandbox);
    for (const file of ['load.min.js', 'core_v2.28.5.min.js']) {
        const fullPath = path.join(JS_DIR, file);
        if (!fs.existsSync(fullPath)) return { error: `${file} not found` };
        let code = fs.readFileSync(fullPath, 'utf-8');
        if (file === 'core_v2.28.5.min.js') {
            code = code.replace(
                "window['NECaptcha']=function",
                "window.__a0_0x1e60=a0_0x1e60;window['NECaptcha']=function"
            );
            code = code.replace(
                "return _0x8fe10e['m']=_0x4e9920",
                "window.__NERequire=_0x8fe10e;return _0x8fe10e['m']=_0x4e9920"
            );
        }
        vm.runInContext(code, context, { filename: file, timeout: 20000 });
    }
    return { sandbox, context, scriptCaptures };
}

function generateCoreCb(context) {
    return vm.runInContext(`
    (function() {
        var req = window.__NERequire;
        var dec = window.__a0_0x1e60;
        if (!req || !dec) return null;
        var cryptoMod = req(0xa);
        var util = req(0x3);
        var spec = {};
        spec.suffix = dec(0x56b);
        spec.code = dec(0x56c);
        spec[dec(0x56d)] = [0x1, 0xa, 0xc, 0xd, 0x1a, 0x1f];
        var code = spec[dec(0x32c)];
        var positions = spec[dec(0x56d)];
        var randomFn = util[dec(0x1f0)];
        var raw = typeof randomFn === 'function'
            ? randomFn(0x20)
            : Math.random().toString(36).slice(2).padEnd(32, '0').slice(0, 32);
        if (code && positions && Array.isArray(positions)) {
            var chars = raw.split('');
            for (var i = 0; i < positions.length; i++) chars[positions[i]] = code.charAt(i);
            raw = chars.join('');
        }
        return cryptoMod.aes(raw);
    })()
    `, context, { timeout: 5000 });
}

function generateCoreFingerprint(context) {
    return vm.runInContext(`
    (function() {
        var dec = window.__a0_0x1e60;
        if (!dec) return null;
        var key = dec(0x326);
        var value = window[key];
        return value ? { key: key, fp: value } : { key: key, fp: '' };
    })()
    `, context, { timeout: 5000 });
}

async function createCoreCaptcha(config = {}) {
    const loaded = loadCoreContext(config);
    if (loaded.error) return loaded;
    const { sandbox, context, scriptCaptures } = loaded;

    const initConfig = {
        apiVersion: 1,
        elementId: '__codex_captcha_probe',
        captchaId: config.captchaId || '07e2387ab53a4d6f930b8d9a9be71bdf',
        mode: config.mode || 'float',
        captchaType: 'JIGSAW',
        size: 'small',
        width: String(config.width || 320) + 'px',
        startLeft: '0px',
        protocol: 'https',
        lang: 'zh-CN',
        ipv6: false,
        enableClose: false,
        hideCloseBtn: false,
        disableMaskClose: false,
        enableAutoFocus: false,
        disableFocusVisible: false,
        refreshInterval: 300,
        customStyles: {
            imagePanel: { align: 'top', borderRadius: '2px' },
            controlBar: { height: '40px', borderRadius: '2px' },
            gap: '15px',
            icon: { intellisenseLogo: '', slider: '' },
            primaryColor: '',
        },
        customTexts: {
            loading: '加载中...',
            loadfail: '加载失败',
            verifySuccess: '验证成功',
            verifyError: '验证失败，请重试',
            verifyOutOfLimit: '失败过多，点此重试',
            clickButton: '点此进行验证',
            slideTip: '向右拖动滑块填充拼图',
            popupTitle: '请完成安全验证',
            refresh: '刷新',
            feedback: '提交使用问题反馈',
            switchToVoice: '切换至语音验证码',
            playVoice: '播放语音验证码',
            back: '返回',
            enterCode: '请输入听到的内容',
            check: '验证',
            close: '关闭',
            intellisense: { normal: '点击完成验证', checking: '安全检测中', loading: '正在加载验证', loadfail: '加载失败', loaddone: '请完成安全验证' },
            sms: {},
        },
        feedbackEnable: true,
        feedbackUrl: 'https://support.dun.163.com/feedback/captcha',
        runEnv: 10,
        group: '',
        scene: '',
        maxVerification: 5,
        disableValidateInput: false,
        timeout: 6000,
        loadVersion: '2.5.4',
        apiServer: ['c.dun.163.com', 'c.dun.163yun.com'],
        staticServer: ['cstaticdun.126.net', 'cstaticdun1.126.net'],
        theme: 'light',
        zoneId: config.zoneId || 'CN31',
        preferIRisk: false,
        acConfig: { enable: 0 },
        irConfig: { enable: 0 },
        __serverConfig__: {
            dt: config.dt || '',
            ac: { enable: 0 },
            imageServer: ['necaptcha.nosdn.127.net', 'necaptcha-nosdn.126.net'],
            zoneId: config.zoneId || 'CN31',
            resources: ['/2.28.5/core-optimi.m25b40.v2.28.5.min.js'],
            ir: { enable: 0 },
            apiServer: ['c.dun.163.com', 'c.dun.163yun.com'],
            theme: 'light',
            audio: true,
            customStyles: false,
            smart: false,
            staticServers: ['cstaticdun.126.net', 'cstaticdun1.126.net'],
        },
        __lang__: {},
    };

    const initCode = `
    (function() {
        var el = document.getElementById(${JSON.stringify(initConfig.elementId)});
        if (!el) {
            el = document.createElement('div');
            el.id = ${JSON.stringify(initConfig.elementId)};
            document.body.appendChild(el);
        }
        window.__coreCaptcha = null;
        window.__coreInitError = null;
        try {
            var config = ${JSON.stringify(initConfig)};
            config.element = el;
            delete config.elementId;
            config.onVerify = function(err, data) { window.__coreVerify = { err: err && String(err), data: data || null }; };
            config.__anticheat__ = {
                instance: {
                    getToken: function() {
                        var token = ${JSON.stringify(config.irToken || '')};
                        return Promise.resolve(token ? { irToken: token } : {});
                    }
                }
            };
            try {
                Object.defineProperty(Object.prototype, 'initEvents', {
                    value: function(){ return function(){}; },
                    configurable: true,
                    writable: true
                });
            } catch (e) {}
            try {
                var directConfig = Object.assign({}, config);
                delete directConfig.customStyles;
                delete directConfig.customTexts;
                window.__coreCaptcha = new NECaptcha(directConfig, function(){});
                window.__coreInitReturn = window.__coreCaptcha;
            } catch (directErr) {
                window.__coreDirectError = directErr && (directErr.stack || directErr.message || String(directErr));
                window.__coreInitReturn = initNECaptcha(config, function(ins) {
                    window.__coreCaptcha = ins;
                }, function(err) {
                    window.__coreInitError = err && (err.message || String(err));
                });
            }
        } catch (e) {
            window.__coreInitError = e && (e.stack || e.message || String(e));
        }
        return {
            hasInit: typeof initNECaptcha === 'function',
            hasNECaptcha: typeof NECaptcha === 'function'
        };
    })()
    `;

    vm.runInContext(initCode, context, { timeout: 10000 });
    const start = Date.now();
    while (Date.now() - start < 5000) {
        const status = vm.runInContext(`({
            hasCaptcha: !!window.__coreCaptcha,
            error: window.__coreInitError || null
        })`, context, { timeout: 1000 });
        if (status.hasCaptcha) return { sandbox, context, scriptCaptures };
        if (status.error) return { error: status.error };
        await wait(100);
    }
    const debug = vm.runInContext(`({
        hasInit: typeof initNECaptcha === 'function',
        hasNECaptcha: typeof NECaptcha === 'function',
        hasCaptcha: !!window.__coreCaptcha,
        error: window.__coreInitError || null,
        directError: window.__coreDirectError || null,
        initReturnType: typeof window.__coreInitReturn,
        initReturnKeys: window.__coreInitReturn && (typeof window.__coreInitReturn === 'object' || typeof window.__coreInitReturn === 'function') ? Object.getOwnPropertyNames(window.__coreInitReturn).slice(0,30) : null,
        scripts: (window.__scriptCaptures || []).slice(-10),
        requests: (window.__capturedRequests || []).slice(-10)
    })`, context, { timeout: 1000 });
    return { error: 'core captcha init timeout: ' + JSON.stringify(debug) };
}

async function generateGetParams(config = {}) {
    const loaded = loadCoreContext(config);
    if (loaded.error) return { ok: false, error: loaded.error };
    const cb = generateCoreCb(loaded.context);
    const fpInfo = generateCoreFingerprint(loaded.context);
    if (!cb) return { ok: false, error: 'core cb generation failed' };
    return { ok: true, data: { cb, fp: fpInfo && fpInfo.fp || '', fpKey: fpInfo && fpInfo.key || '' } };
}

async function generateCheckData(distance, config = {}) {
    const loaded = loadCoreContext(config);
    if (loaded.error) return { ok: false, error: loaded.error };
    const { context } = loaded;
    const dist = Number(distance || config.distance || 0);
    const width = Number(config.width || 320);
    const token = config.token || 'mock_token';
    const finalLeft = Number(config.left != null ? config.left : dist);
    const inputTracks = Array.isArray(config.tracks) ? config.tracks.map((point) => {
        const item = Array.isArray(point) ? point : [];
        return [
            Math.round(Number(item[0] || 0)),
            Math.round(Number(item[1] || 0)),
            Math.round(Number(item[2] || 0)),
            item[3] == null ? 1 : Number(item[3] ? 1 : 0)
        ];
    }) : null;
    const runCode = `
    (function() {
        var req = window.__NERequire;
        if (!req) return { error: 'core require unavailable' };
        var util = req(0x3);
        var cryptoMod = req(0xa);
        var constants = req(0x5);
        var normalize = req(0x38);
        var sampleNum = constants.SAMPLE_NUM || 50;
        var traceData = [];
        var atomTraceData = ${JSON.stringify(inputTracks)} || [];
        if (!atomTraceData.length) {
            var steps = 42;
            var duration = 1180;
            for (var i = 1; i <= steps; i++) {
                var ratio = i / steps;
                var x = Math.round(${JSON.stringify(dist)} * (1 - Math.pow(1 - ratio, 3)));
                var y = Math.round(Math.sin(i / 4) * 2);
                atomTraceData.push([x, y, Math.round(duration * ratio), 1]);
            }
            atomTraceData.push([Math.round(${JSON.stringify(dist)}), 0, duration + 45, 1]);
        }
        for (var j = 0; j < atomTraceData.length; j++) {
            traceData.push(cryptoMod.xorEncode(${JSON.stringify(token)}, atomTraceData[j] + ''));
        }
        var sampledTrace = util.sample(traceData, sampleNum);
        var atomSample = util.sample(atomTraceData, 0x2);
        var atomNormalized = typeof normalize === 'function' ? normalize(atomSample) : atomSample.reduce(function(acc, item) { return acc.concat(item); }, []);
        var debug = ${JSON.stringify(!!config.debug)} ? {
            sampleNum: sampleNum,
            traceLen: traceData.length,
            sampledTraceLen: sampledTrace.length,
            atomSampleLen: atomSample.length,
            atomNormalizedType: Object.prototype.toString.call(atomNormalized),
            atomNormalizedLen: atomNormalized && atomNormalized.length,
            dInputLen: sampledTrace.join(':').length,
            fInputLen: atomNormalized.join(',').length
        } : null;
        var output = {
            d: cryptoMod.aes(sampledTrace.join(':')),
            m: '',
            p: cryptoMod.aes(cryptoMod.xorEncode(${JSON.stringify(token)}, (${JSON.stringify(finalLeft)} / ${JSON.stringify(width)} * 100) + '')),
            f: cryptoMod.aes(cryptoMod.xorEncode(${JSON.stringify(token)}, atomNormalized.join(','))),
            ext: cryptoMod.aes(cryptoMod.xorEncode(${JSON.stringify(token)}, '1,' + traceData.length))
        };
        if (debug) output._debug = debug;
        return output;
    })()
    `;
    const result = vm.runInContext(runCode, context, { timeout: 10000 });
    if (!result || result.error) return { ok: false, error: result && result.error || 'check data generation failed' };
    return { ok: true, data: result };
}

/**
 * 加载 IR SDK 并等待异步完成以捕获加密数据
 */
async function loadIrSdk(config) {
    const sandbox = createSandbox({ baseUrl: config.referer || 'https://dun.163.com/trial/jigsaw' });
    if (config.fixedFp) {
        sandbox.gdxidpyhxde = config.fixedFp;
        if (sandbox.window) sandbox.window.gdxidpyhxde = config.fixedFp;
    }
    sandbox.XMLHttpRequest = function() { return new CaptureXHR(); };
    sandbox.Bun = undefined;
    sandbox.Deno = undefined;
    sandbox.process = { versions: {}, env: {}, nextTick: process.nextTick, browser: true };
    sandbox.__dirname = '/';
    sandbox.__filename = '';
    sandbox.global = sandbox;
    _captures.length = 0;  // 清空捕获队列

    const context = vm.createContext(sandbox);

    const irFile = path.join(JS_DIR, 'ir.2.0.13.min.js');
    if (!fs.existsSync(irFile)) return { error: 'IR SDK file not found' };

    try {
        const irCode = fs.readFileSync(irFile, 'utf-8');
        vm.runInContext(irCode, context, { filename: 'ir.2.0.13.min.js', timeout: 15000 });
    } catch (e) { /* non-fatal */ }

    const guardianConfig = {
        preferIRisk: true, timeout: 10000, protocol: 'https:', ipv6: false,
        staticServer: 'cstaticdun.126.net',
        irConfig: {
            pn: config.pn || 'YD00192283058223',
            enable: 1,
            apiServer: ['ir-sdk.dun.163.com'],
            token: '',
        },
        apiServer: ['c.dun.163.com'],
        zoneId: config.zoneId || 'CN31',
        dt: config.dt || '',
        productId: config.pn || 'YD00192283058223',
        businessId: config.captchaId || '07e2387ab53a4d6f930b8d9a9be71bdf',
    };

    // 初始化 guardian 并触发 getToken（异步操作）
    const initCode = `
    (function() {
        var config = ${JSON.stringify(guardianConfig)};
        try {
            var g = window.createNECaptchaGuardian(config);
            if (typeof g.getToken === 'function') {
                g.getToken(function(err, token) {});
            }
        } catch(e) {}
    })()
    `;
    try {
        vm.runInContext(initCode, context, { timeout: 10000 });
    } catch (e) { /* continue */ }

    // 等待异步操作完成（fingerprint collection + XHR）
    const maxWait = 6000;
    const start = Date.now();
    while (Date.now() - start < maxWait) {
        await new Promise(r => setTimeout(r, 200));
        if (_captures.length > 0) {
            const last = _captures[_captures.length - 1];
            const bodyStr = typeof last.body === 'string' ? last.body : JSON.stringify(last.body);
            try {
                return { ok: true, data: JSON.parse(bodyStr) };
            } catch(e) {
                return { ok: true, data: { d: bodyStr } };
            }
        }
    }

    return { ok: false, error: 'No IR data captured (timeout)' };
}

async function main() {
    const args = process.argv.slice(2);
    const command = args[0];
    if (!command) {
        console.error('Usage: node signer.js <ir|probe> [config_json]');
        process.exit(1);
    }

    let config = {};
    try {
        const last = args[args.length - 1];
        if (last && last.startsWith('{')) config = JSON.parse(last);
    } catch (e) {}

    switch (command) {
        case 'ir': {
            const result = await loadIrSdk(config);
            if (result.ok) {
                console.log(JSON.stringify({ ok: true, data: result.data }));
            } else {
                console.log(JSON.stringify({ ok: false, error: result.error }));
            }
            break;
        }
        case 'fp':
        case 'get': {
            const result = await generateGetParams(config);
            if (result.ok) {
                console.log(JSON.stringify({ ok: true, data: result.data }));
            } else {
                console.log(JSON.stringify({ ok: false, error: result.error }));
            }
            break;
        }
        case 'check': {
            const distance = args[1];
            const result = await generateCheckData(distance, config);
            if (result.ok) {
                console.log(JSON.stringify({ ok: true, data: result.data }));
            } else {
                console.log(JSON.stringify({ ok: false, error: result.error }));
            }
            break;
        }
        case 'probe': {
            const sandbox = createSandbox({ baseUrl: config.referer || 'https://dun.163.com/trial/jigsaw' });
            sandbox.XMLHttpRequest = function() { return new CaptureXHR(); };
            sandbox.Bun = undefined;
            sandbox.Deno = undefined;
            const context = vm.createContext(sandbox);
            try {
                const irCode = fs.readFileSync(path.join(JS_DIR, 'ir.2.0.13.min.js'), 'utf-8');
                vm.runInContext(irCode, context, { filename: 'ir.2.0.13.min.js', timeout: 15000 });
            } catch(e) {}
            try {
                const check = vm.runInContext(`({hasCreate: typeof window.createNECaptchaGuardian === 'function'})`, context, { timeout: 5000 });
                console.log(JSON.stringify({ ok: true, data: check }));
            } catch(e) {
                console.log(JSON.stringify({ ok: false, error: e.message }));
            }
            break;
        }
        case 'decode': {
            const loaded = loadCoreContext(config);
            if (loaded.error) {
                console.log(JSON.stringify({ ok: false, error: loaded.error }));
                break;
            }
            const indexes = args.slice(1).filter(x => !x.startsWith('{'));
            const data = {};
            for (const raw of indexes) {
                const n = Number(raw);
                data[raw] = vm.runInContext(`window.__a0_0x1e60(${JSON.stringify(n)})`, loaded.context, { timeout: 1000 });
            }
            console.log(JSON.stringify({ ok: true, data }));
            break;
        }
        default:
            console.error('Unknown command:', command);
            process.exit(1);
    }

    setTimeout(() => process.exit(0), 0);
}

main().catch(e => {
    console.error(JSON.stringify({ ok: false, error: e.message }));
    process.exit(1);
});
