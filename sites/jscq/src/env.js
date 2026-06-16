/**
 * 瑞数6 浏览器环境补丁
 * 用于 Node.js vm 沙箱中模拟浏览器环境
 * 不依赖 jsdom 等第三方库
 */

function setupEnv(sandbox, config) {
    var vm = require('vm');
    var url = require('url');
    var parsedUrl = new URL(config.url);

    // 保存 inline script 内容（由 gen_cookie.js 注入）
    var inlineScriptText = config.inline_script_text || '';

    // 保存 meta_id
    var metaId = config.meta_id || '';

    // ========== Function.prototype.toString 伪装 (关键!) ==========
    // Ruishu 通过 Function.prototype.toString.call 检测函数是否为浏览器原生
    // vm context 有独立的 Function.prototype, 必须在 sandbox 内部安装 override
    // 关键: override 自身也标记为 native, 防止 toString.toString() 检测
    var _natKey = '__natName';
    vm.runInContext([
        '(function() {',
        '  var _k = "__natName";',
        '  var _orig = Function.prototype.toString;',
        '  var _newToString = function() {',
        '    if (this[_k]) return "function " + this[_k] + "() { [native code] }";',
        '    return _orig.call(this);',
        '  };',
        '  _newToString[_k] = "toString";',
        '  Function.prototype.toString = _newToString;',
        '})();',
    ].join('\n'), sandbox);

    function nativize(name, fn) {
        fn[_natKey] = name || '';
        return fn;
    }
    // 批量标记对象上的所有函数属性
    function markNative(obj, prefix) {
        if (!obj || typeof obj !== 'object') return;
        Object.keys(obj).forEach(function (k) {
            if (typeof obj[k] === 'function') {
                obj[k][_natKey] = (prefix || '') + k;
            }
        });
    }

    // ========== 集合类型工厂 (关键: Ruishu 通过 Object.prototype.toString.call 检测类型) ==========
    function makeHTMLCollection(items) {
        var c = {};
        c.length = items.length;
        c.item = function (i) { return items[i] || null; };
        c.namedItem = function () { return null; };
        for (var i = 0; i < items.length; i++) { c[i] = items[i]; }
        c[Symbol.toStringTag] = 'HTMLCollection';
        return c;
    }
    function makeNodeList(items) {
        var n = {};
        n.length = items.length;
        n.item = function (i) { return items[i] || null; };
        n.entries = function () { var idx = 0; return { next: function () { return idx < items.length ? { value: [idx, items[idx++]], done: false } : { done: true }; } }; };
        n.forEach = function (cb) { for (var i = 0; i < items.length; i++) cb(items[i], i, n); };
        n.keys = function () { var idx = 0; return { next: function () { return idx < items.length ? { value: idx++, done: false } : { done: true }; } }; };
        n.values = function () { var idx = 0; return { next: function () { return idx < items.length ? { value: items[idx++], done: false } : { done: true }; } }; };
        for (var i = 0; i < items.length; i++) { n[i] = items[i]; }
        n[Symbol.toStringTag] = 'NodeList';
        return n;
    }
    function makeNamedNodeMap(pairs) {
        var m = {};
        m.length = pairs.length;
        for (var i = 0; i < pairs.length; i++) { m[i] = pairs[i]; }
        m.item = function (i) { return pairs[i] || null; };
        m.getNamedItem = function (name) { for (var i = 0; i < pairs.length; i++) { if (pairs[i].name === name) return pairs[i]; } return null; };
        m.setNamedItem = function () { return null; };
        m.removeNamedItem = function () { return null; };
        m[Symbol.toStringTag] = 'NamedNodeMap';
        return m;
    }

    // ========== Symbol.toStringTag (关键: Object.prototype.toString.call 检测) ==========
    sandbox[Symbol.toStringTag] = 'Window';

    // ========== Window 构造函数 (Ruishu 检测 window.constructor / instanceof Window) ==========
    var WindowCtor = vm.runInContext('(function Window() {})', sandbox);
    WindowCtor[_natKey] = 'Window';

    // ========== Window ==========
    sandbox.window = sandbox;
    sandbox.self = sandbox;
    sandbox.top = sandbox;
    sandbox.parent = sandbox;
    sandbox.frames = sandbox;
    sandbox.window = sandbox;
    sandbox.constructor = WindowCtor;
    sandbox.Window = WindowCtor;

    // 修复 window instanceof Window: 将全局对象的 __proto__ 指向 Window.prototype
    vm.runInContext('Object.setPrototypeOf(this, Window.prototype)', sandbox);
    sandbox.name = '';
    sandbox.closed = false;
    sandbox.length = 0;
    sandbox.status = '';
    sandbox.devicePixelRatio = 1;
    sandbox.innerWidth = 1920;
    sandbox.innerHeight = 969;
    sandbox.outerWidth = 1920;
    sandbox.outerHeight = 1040;
    sandbox.pageXOffset = 0;
    sandbox.pageYOffset = 0;
    sandbox.scrollX = 0;
    sandbox.scrollY = 0;

    // $_ts - 直接赋值，不使用 Object.defineProperty 保护
    // 让 VM 代码自由操作 $_ts，包括 opcode 0 的 _$ed=_$_1['$_ts']={}
    sandbox.$_ts = {};

    // ========== Cookie 捕获 ==========
    sandbox.__capturedCookie = '';
    sandbox.__allCookies = [];

    // ========== DOM Element 工厂 ==========
    function makeElement(tag) {
        // Element Symbol.toStringTag: HTMLDivElement, HTMLScriptElement, etc.
        var tagToInterface = {
            'div': 'HTMLDivElement', 'span': 'HTMLSpanElement', 'a': 'HTMLAnchorElement',
            'img': 'HTMLImageElement', 'script': 'HTMLScriptElement', 'style': 'HTMLStyleElement',
            'link': 'HTMLLinkElement', 'form': 'HTMLFormElement', 'input': 'HTMLInputElement',
            'button': 'HTMLButtonElement', 'textarea': 'HTMLTextAreaElement', 'select': 'HTMLSelectElement',
            'option': 'HTMLOptionElement', 'table': 'HTMLTableElement', 'tr': 'HTMLTableRowElement',
            'td': 'HTMLTableCellElement', 'th': 'HTMLTableCellElement', 'thead': 'HTMLTableSectionElement',
            'tbody': 'HTMLTableSectionElement', 'tfoot': 'HTMLTableSectionElement',
            'canvas': 'HTMLCanvasElement', 'video': 'HTMLVideoElement', 'audio': 'HTMLAudioElement',
            'iframe': 'HTMLIFrameElement', 'meta': 'HTMLMetaElement', 'head': 'HTMLHeadElement',
            'body': 'HTMLBodyElement', 'html': 'HTMLHtmlElement', 'title': 'HTMLTitleElement',
            'p': 'HTMLParagraphElement', 'br': 'HTMLBRElement', 'hr': 'HTMLHRElement',
            'h1': 'HTMLHeadingElement', 'h2': 'HTMLHeadingElement', 'h3': 'HTMLHeadingElement',
            'h4': 'HTMLHeadingElement', 'h5': 'HTMLHeadingElement', 'h6': 'HTMLHeadingElement',
            'ul': 'HTMLUListElement', 'ol': 'HTMLOListElement', 'li': 'HTMLLIElement',
            'label': 'HTMLLabelElement', 'section': 'HTMLElement', 'article': 'HTMLElement',
            'nav': 'HTMLElement', 'header': 'HTMLElement', 'footer': 'HTMLElement',
            'main': 'HTMLElement', 'aside': 'HTMLElement',
        };
        var interfaceName = tagToInterface[tag] || 'HTMLElement';
        var el = {
            [Symbol.toStringTag]: interfaceName,
            tagName: tag.toUpperCase(),
            nodeName: tag.toUpperCase(),
            nodeType: 1,
            style: {},
            children: [],
            childNodes: [],
            attributes: {},
            ownerDocument: sandbox.document,
            innerHTML: '',
            outerHTML: '',
            textContent: '',
            innerText: '',
            className: '',
            id: '',
            href: '',
            src: '',
            type: '',
            value: '',
            name: '',
            action: '',
            method: '',
        };

        // 通用方法拦截 - 任何未知方法调用返回安全值
        el.getAttribute = function (name) {
            if (name === 'r') return 'm';
            return el.attributes[name] !== undefined ? el.attributes[name] : null;
        };
        el.setAttribute = function (name, val) { el.attributes[name] = String(val); };
        el.removeAttribute = function (name) { delete el.attributes[name]; };
        el.hasAttribute = function (name) { return name in el.attributes; };
        el.getAttributeNode = function (name) { return el.hasAttribute(name) ? { name: name, value: el.getAttribute(name), specified: true } : null; };
        el.setAttributeNode = function (attr) { el.setAttribute(attr.name, attr.value); return attr; };
        el.appendChild = function (child) { el.children.push(child); el.childNodes.push(child); return child; };
        el.removeChild = function (child) { return child; };
        el.insertBefore = function (newChild, refChild) { el.children.push(newChild); return newChild; };
        el.replaceChild = function (newChild, oldChild) { return newChild; };
        el.cloneNode = function (deep) { return makeElement(tag); };
        el.getElementsByTagName = function () { return makeHTMLCollection([]); };
        el.getElementsByClassName = function () { return makeHTMLCollection([]); };
        el.querySelectorAll = function () { return makeNodeList([]); };
        el.querySelector = function () { return null; };
        el.getElementsByName = function () { return makeHTMLCollection([]); };
        el.addEventListener = function () { };
        el.removeEventListener = function () { };
        el.dispatchEvent = function () { return true; };
        el.contains = function () { return false; };
        el.getBoundingClientRect = function () {
            return { top: 0, left: 0, bottom: 0, right: 0, width: 0, height: 0, x: 0, y: 0 };
        };
        el.getClientRects = function () { return makeNodeList([]); };
        el.matches = function () { return false; };
        el.closest = function () { return null; };
        el.focus = function () { };
        el.blur = function () { };
        el.click = function () { };

        // 布局属性 (瑞数可能检测)
        el.offsetWidth = 0;
        el.offsetHeight = 0;
        el.clientWidth = 0;
        el.clientHeight = 0;
        el.scrollWidth = 0;
        el.scrollHeight = 0;
        el.scrollTop = 0;
        el.scrollLeft = 0;
        el.clientTop = 0;
        el.clientLeft = 0;
        el.offsetParent = null;
        el.offsetLeft = 0;
        el.offsetTop = 0;

        el.hasChildNodes = function () { return el.childNodes.length > 0; };
        el.normalize = function () { };
        el.isEqualNode = function () { return false; };
        el.isSameNode = function () { return false; };
        el.compareDocumentPosition = function () { return 0; };
        el.lookupPrefix = function () { return null; };
        el.lookupNamespaceURI = function () { return null; };
        el.isDefaultNamespace = function () { return false; };
        el.insertBefore = function (n, r) { el.children.push(n); el.childNodes.push(n); return n; };
        el.replaceChild = function (n, o) { return o; };
        el.cloneNode = function () { return makeElement(tag); };
        el.getTextContent = function () { return el.textContent; };
        el.setTextContent = function (v) { el.textContent = v; };

        // 父节点自引用
        el.parentElement = { removeChild: function () { } };
        el.parentNode = { removeChild: function () { } };

        // Canvas
        if (tag === 'canvas') {
            el.width = 300;
            el.height = 150;
            // 模拟真实 Canvas 指纹的 toDataURL
            // 使用一个固定的但看起来真实的 PNG base64
            var realCanvasData = 'data:image/png;base64,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';
            el.toDataURL = function (type) {
                return realCanvasData;
            };
            el.toBlob = function (cb) { cb(new (sandbox.Blob || function () { })()); };
            var ctx2d = {
                fillRect: function () { },
                strokeRect: function () { },
                clearRect: function () { },
                fillText: function () { },
                strokeText: function () { },
                measureText: function () { return { width: 10 }; },
                arc: function () { },
                arcTo: function () { },
                beginPath: function () { },
                closePath: function () { },
                fill: function () { },
                stroke: function () { },
                clip: function () { },
                moveTo: function () { },
                lineTo: function () { },
                rect: function () { },
                bezierCurveTo: function () { },
                quadraticCurveTo: function () { },
                save: function () { },
                restore: function () { },
                rotate: function () { },
                scale: function () { },
                translate: function () { },
                transform: function () { },
                setTransform: function () { },
                resetTransform: function () { },
                createLinearGradient: function () { return { addColorStop: function () { } }; },
                createRadialGradient: function () { return { addColorStop: function () { } }; },
                createPattern: function () { return {}; },
                drawImage: function () { },
                getImageData: function () { return { data: new Uint8ClampedArray(4) }; },
                putImageData: function () { },
                canvas: el,
                fillStyle: '',
                strokeStyle: '',
                lineWidth: 1,
                font: '10px sans-serif',
                textBaseline: 'alphabetic',
                globalAlpha: 1,
                globalCompositeOperation: 'source-over',
                shadowBlur: 0,
                shadowColor: 'rgba(0, 0, 0, 0)',
                shadowOffsetX: 0,
                shadowOffsetY: 0,
                textAlign: 'start',
            };
            var webglParams = {
                7937: 'WebKit WebGL',
                7938: 'WebGL 1.0 (OpenGL ES 2.0 Chromium)',
                35724: 'WebGL GLSL ES 1.0 (OpenGL ES GLSL ES 1.0 Chromium)',
                3379: 16384,
                7936: 'WebKit',
                3386: 16384,
                34921: 16,
                34930: 16,
                35071: 16384,
                35660: 256,
                36347: 1024,
                36348: 1024,
                36349: 4096,
                3414: 16384,
                7935: 16384,
                34076: 16384,
                34024: 16384,
            };
            el.getContext = function (type) {
                if (type === '2d') return ctx2d;
                if (type === 'webgl' || type === 'experimental-webgl') {
                    return {
                        getParameter: function (pname) {
                            if (pname === 37445) return 'Google Inc. (NVIDIA)';
                            if (pname === 37446) return 'ANGLE (NVIDIA, NVIDIA GeForce RTX 4060 Ti Direct3D11 vs_5_0 ps_5_0, D3D11)';
                            if (typeof pname === 'number' && webglParams[pname] !== undefined) return webglParams[pname];
                            return null;
                        },
                        getExtension: function (name) {
                            if (name === 'WEBGL_debug_renderer_info') return { UNMASKED_VENDOR_WEBGL: 37445, UNMASKED_RENDERER_WEBGL: 37446 };
                            return null;
                        },
                        createBuffer: function () { return {}; },
                        bindBuffer: function () { },
                        bufferData: function () { },
                        createProgram: function () { return {}; },
                        createShader: function () { return {}; },
                        shaderSource: function () { },
                        compileShader: function () { },
                        attachShader: function () { },
                        linkProgram: function () { },
                        getAttribLocation: function () { return 0; },
                        getUniformLocation: function () { return {}; },
                        enableVertexAttribArray: function () { },
                        vertexAttribPointer: function () { },
                        uniform1f: function () { },
                        drawArrays: function () { },
                        getShaderPrecisionFormat: function () { return { precision: 23, rangeMin: 127, rangeMax: 127 }; },
                        getSupportedExtensions: function () { return ['ANGLE_instanced_arrays', 'EXT_blend_minmax', 'EXT_color_buffer_half_float', 'EXT_float_blend', 'EXT_texture_compression_bptc', 'EXT_texture_filter_anisotropic', 'OES_element_index_uint', 'OES_standard_derivatives', 'OES_texture_float', 'OES_texture_float_linear', 'OES_texture_half_float', 'OES_texture_half_float_linear', 'OES_vertex_array_object', 'WEBGL_color_buffer_float', 'WEBGL_compressed_texture_s3tc', 'WEBGL_debug_renderer_info', 'WEBGL_depth_texture', 'WEBGL_lose_context']; },
                        getContextAttributes: function () { return { antialias: true, depth: true, failIfMajorPerformanceCaveat: false, powerPreference: 'default', premultipliedAlpha: true, preserveDrawingBuffer: false, stencil: false, xrCompatible: false }; },
                        createTexture: function () { return {}; },
                        bindTexture: function () { },
                        texParameteri: function () { },
                        texImage2D: function () { },
                        readPixels: function () { return new Uint8Array(4); },
                        getError: function () { return 0; },
                        canvas: el,
                        drawingBufferWidth: 300,
                        drawingBufferHeight: 150,
                    };
                }
                return null;
            };
            el.toDataURL = function () {
                return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
            };
            el.toBlob = function (cb) { cb(new (sandbox.Blob || function () { })()); };
        }

        // Anchor (<a>) - URL parsing
        if (tag === 'a' || tag === 'area') {
            var _href = '';
            var _urlParsed = null;
            function parseHref() {
                try { _urlParsed = new URL(_href); } catch (e) { _urlParsed = null; }
            }
            Object.defineProperty(el, 'href', {
                get: function () { return _href; },
                set: function (v) { _href = String(v); parseHref(); },
                configurable: true, enumerable: true,
            });
            Object.defineProperty(el, 'protocol', { get: function () { return _urlParsed ? _urlParsed.protocol : ':'; }, configurable: true, enumerable: true });
            Object.defineProperty(el, 'host', { get: function () { return _urlParsed ? _urlParsed.host : ''; }, configurable: true, enumerable: true });
            Object.defineProperty(el, 'hostname', { get: function () { return _urlParsed ? _urlParsed.hostname : ''; }, configurable: true, enumerable: true });
            Object.defineProperty(el, 'port', { get: function () { return _urlParsed ? _urlParsed.port : ''; }, configurable: true, enumerable: true });
            Object.defineProperty(el, 'pathname', { get: function () { return _urlParsed ? _urlParsed.pathname : ''; }, configurable: true, enumerable: true });
            Object.defineProperty(el, 'search', { get: function () { return _urlParsed ? _urlParsed.search : ''; }, configurable: true, enumerable: true });
            Object.defineProperty(el, 'hash', { get: function () { return _urlParsed ? _urlParsed.hash : ''; }, configurable: true, enumerable: true });
            Object.defineProperty(el, 'origin', { get: function () { return _urlParsed ? _urlParsed.origin : ''; }, configurable: true, enumerable: true });
            Object.defineProperty(el, 'username', { get: function () { return _urlParsed ? _urlParsed.username : ''; }, configurable: true, enumerable: true });
            Object.defineProperty(el, 'password', { get: function () { return _urlParsed ? _urlParsed.password : ''; }, configurable: true, enumerable: true });
        }

        // Iframe
        if (tag === 'iframe') {
            el.contentWindow = {
                document: { createElement: function (t) { return makeElement(t); }, body: makeElement('body') },
                location: sandbox.location,
                navigator: sandbox.navigator,
                setTimeout: function (fn) { return 1; },
                eval: function () { return undefined; },
                postMessage: function () { },
                addEventListener: function () { },
                removeEventListener: function () { },
            };
            el.contentDocument = el.contentWindow.document;
        }

        // Form
        if (tag === 'form') {
            el.elements = [];
            el.length = 0;
            el.submit = function () { };
            el.reset = function () { };
        }

        // Input
        if (tag === 'input' || tag === 'textarea') {
            el.checked = false;
            el.disabled = false;
            el.readOnly = false;
            el.placeholder = '';
        }

        // Image
        if (tag === 'img') {
            el.naturalWidth = 0;
            el.naturalHeight = 0;
            el.complete = true;
            el.alt = '';
        }

        return el;
    }



    sandbox.__makeElement = makeElement;

    // ========== Document ==========
    var docEl = makeElement('html');
    var headEl = makeElement('head');
    var bodyEl = makeElement('body');
    docEl.appendChild(headEl);
    docEl.appendChild(bodyEl);

    sandbox.document = {
        nodeType: 9,
        nodeName: '#document',
        toString: function () { return '[object HTMLDocument]'; },
        documentElement: docEl,
        head: headEl,
        body: bodyEl,
        defaultView: sandbox,
        title: '',
        domain: parsedUrl.hostname,
        URL: config.url,
        documentURI: config.url,
        referrer: '',
        readyState: 'complete',
        characterSet: 'UTF-8',
        charset: 'UTF-8',
        inputEncoding: 'UTF-8',
        compatMode: 'CSS1Compat',
        // document.all: 真实浏览器中 typeof document.all === "undefined" (spec 特殊行为)
        // 在标准 JS 中无法复制此行为，因此完全删除该属性使 typeof 返回 "undefined"
        // (不设置 all 属性，后续通过 delete 删除)
        documentMode: undefined, // IE 专有，Chrome 中为 undefined
        hidden: false,
        visibilityState: 'visible',
        contentType: 'text/html',
        designMode: 'off',

        createElement: function (tag) { return makeElement(tag.toLowerCase()); },
        createDocumentFragment: function () {
            return { nodeType: 11, childNodes: [], children: [], appendChild: function (c) { return c; }, removeChild: function (c) { return c; } };
        },
        createComment: function (data) { return { nodeType: 8, data: data }; },
        createTextNode: function (data) { return { nodeType: 3, data: data, textContent: data }; },
        createEvent: function (type) {
            return { initEvent: function () { }, preventDefault: function () { }, stopPropagation: function () { } };
        },

        getElementById: function (id) {
            if (id === metaId) {
                var el = makeElement('meta');
                el.id = metaId;
                el.setAttribute('id', metaId);
                el.setAttribute('content', config.meta_content);
                el.setAttribute('r', 'm');
                // IDL property mirror (瑞数可能直接读 .content 而非 getAttribute)
                el.content = config.meta_content;
                return el;
            }
            return null;
        },
        getElementsByName: function () { return makeHTMLCollection([]); },

        // document.scripts - 返回页面上所有 script 元素
        get scripts() {
            var s1 = makeElement('script');
            s1.setAttribute('r', 'm');
            s1.setAttribute('type', 'text/javascript');
            s1.text = inlineScriptText;
            s1.textContent = inlineScriptText;
            s1.innerHTML = inlineScriptText;
            var s2 = makeElement('script');
            s2.setAttribute('r', 'm');
            s2.setAttribute('type', 'text/javascript');
            s2.setAttribute('charset', 'utf-8');
            s2.src = config.js_url;
            s2.text = '';
            return makeHTMLCollection([s1, s2]);
        },

        // document.styleSheets
        styleSheets: (function() { var s = []; s[Symbol.toStringTag] = 'StyleSheetList'; s.item = function() { return null; }; return s; })(),

        // document.fonts
        fonts: { ready: Promise.resolve(), check: function() { return true; }, load: function() { return Promise.resolve([]); } },

        getElementsByTagName: function (tag) {
            tag = (tag || '').toLowerCase();
            if (tag === 'script') {
                var s1 = makeElement('script');
                s1.setAttribute('r', 'm');
                s1.setAttribute('type', 'text/javascript');
                s1.text = inlineScriptText;
                s1.textContent = inlineScriptText;
                s1.innerHTML = inlineScriptText;
                var s2 = makeElement('script');
                s2.setAttribute('r', 'm');
                s2.setAttribute('type', 'text/javascript');
                s2.setAttribute('charset', 'utf-8');
                s2.src = config.js_url;
                s2.text = '';
                return makeHTMLCollection([s1, s2]);
            }
            if (tag === 'meta') {
                var m1 = makeElement('meta');
                if (metaId) {
                    m1.id = metaId;
                    m1.setAttribute('id', metaId);
                }
                m1.setAttribute('content', config.meta_content);
                m1.setAttribute('r', 'm');
                m1.content = config.meta_content;  // 真实浏览器 meta.content 反射 content attribute
                var m2 = makeElement('meta');
                m2.setAttribute('content', config.meta_content);
                m2.content = config.meta_content;
                return makeHTMLCollection([m1, m2]);
            }
            if (tag === 'head') return makeHTMLCollection([headEl]);
            if (tag === 'body') return makeHTMLCollection([bodyEl]);
            if (tag === 'html') return makeHTMLCollection([docEl]);
            return makeHTMLCollection([]);
        },

        getElementsByClassName: function () { return makeHTMLCollection([]); },
        querySelectorAll: function () { return makeNodeList([]); },
        querySelector: function () { return null; },

        appendChild: function (c) { return c; },
        removeChild: function (c) { return c; },
        insertBefore: function (n, r) { return n; },
        replaceChild: function (n, o) { return o; },

        addEventListener: function () { },
        removeEventListener: function () { },
        dispatchEvent: function () { return true; },
        hasFocus: function () { return true; },

        cookie: '',
    };
    sandbox.document[Symbol.toStringTag] = 'HTMLDocument';
    // document.constructor 需要返回 HTMLDocument
    var HTMLDocumentCtor = vm.runInContext('(function HTMLDocument() {})', sandbox);
    HTMLDocumentCtor[_natKey] = 'HTMLDocument';
    sandbox.document.constructor = HTMLDocumentCtor;

    sandbox.window.document = sandbox.document;

    // 冻结 document 上的关键方法，防止 Ruishu 通过覆写检测非浏览器环境
    ['createElement', 'getElementById', 'getElementsByTagName', 'getElementsByClassName',
     'querySelector', 'querySelectorAll', 'createDocumentFragment', 'createComment',
     'createTextNode', 'createEvent', 'createRange', 'write', 'writeln',
     'addEventListener', 'removeEventListener', 'dispatchEvent', 'hasFocus',
     'getElementsByName', 'createElementNS'].forEach(function (prop) {
        var desc = Object.getOwnPropertyDescriptor(sandbox.document, prop);
        if (desc && desc.value) {
            Object.defineProperty(sandbox.document, prop, {
                value: desc.value,
                writable: false,
                configurable: false,
                enumerable: true,
            });
        }
    });

    // Cookie Hook
    Object.defineProperty(sandbox.document, 'cookie', {
        get: function () {
            return sandbox.__allCookies.join('; ');
        },
        set: function (val) {
            var cookiePart = String(val).split(';')[0];
            sandbox.__allCookies.push(cookiePart);
            var eqIdx = cookiePart.indexOf('=');
            if (eqIdx !== -1) {
                var value = cookiePart.substring(eqIdx + 1);
                if (value.length > 100) {
                    sandbox.__capturedCookie = cookiePart;
                }
            }
        },
        configurable: true,
        enumerable: true,
    });

    // ========== document 补充属性 ==========

    // document.all: 设为 undefined 使 typeof === "undefined" 且 'all' in document === true
    // 真实浏览器中 document.all 是 spec-level 特殊对象，typeof 返回 "undefined"
    // 设置为 undefined 而非 delete，保持 'all' in document 为 true
    sandbox.document.all = undefined;

    // document.implementation (DOMImplementation)
    sandbox.document.implementation = {
        [Symbol.toStringTag]: 'DOMImplementation',
        hasFeature: function () { return true; },
        createHTMLDocument: function (title) {
            return {
                nodeType: 9, title: title || '', body: makeElement('body'),
                documentElement: makeElement('html'),
                querySelectorAll: function () { return makeNodeList([]); },
                getElementById: function () { return null; },
            };
        },
        createDocument: function (ns, name, doctype) {
            return { nodeType: 9, documentElement: null, childNodes: [] };
        },
        createDocumentType: function (name, pubId, sysId) {
            return { nodeType: 10, name: name, publicId: pubId, systemId: sysId };
        },
    };

    // document.createRange
    sandbox.document.createRange = function () {
        return {
            [Symbol.toStringTag]: 'Range',
            setStart: function () { }, setEnd: function () { },
            setStartBefore: function () { }, setEndAfter: function () { },
            selectNode: function () { }, selectNodeContents: function () { },
            collapse: function () { }, cloneRange: function () { return this; },
            detach: function () { },
            createContextualFragment: function (html) {
                var el = makeElement('div'); el.innerHTML = html;
                return { childNodes: [el], firstChild: el };
            },
            commonAncestorContainer: sandbox.document.body,
            startContainer: sandbox.document.body, startOffset: 0,
            endContainer: sandbox.document.body, endOffset: 0,
            collapsed: true,
        };
    };

    // document.write / document.writeln
    sandbox.document.write = function () { };
    sandbox.document.writeln = function () { };

    // ========== Navigator ==========
    sandbox.navigator = {
        [Symbol.toStringTag]: 'Navigator',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        appName: 'Netscape',
        appCodeName: 'Mozilla',
        appVersion: '5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        platform: 'Win32',
        product: 'Gecko',
        productSub: '20030107',
        vendor: 'Google Inc.',
        vendorSub: '',
        language: 'zh-CN',
        languages: ['zh-CN', 'zh', 'en-US', 'en'],
        onLine: true,
        cookieEnabled: true,
        webdriver: false,
        hardwareConcurrency: 24,
        deviceMemory: 32,
        maxTouchPoints: 0,
        connection: { effectiveType: '4g', rtt: 50, downlink: 10, saveData: false },
        plugins: Object.assign({ length: 5, item: function (i) { return null; }, namedItem: function () { return null; }, refresh: function () { }, 0: { name: 'PDF Viewer', filename: 'internal-pdf-viewer', description: 'Portable Document Format', length: 1 }, 1: { name: 'Chrome PDF Viewer', filename: 'internal-pdf-viewer', description: 'Portable Document Format', length: 1 }, 2: { name: 'Chromium PDF Viewer', filename: 'internal-pdf-viewer', description: 'Portable Document Format', length: 1 }, 3: { name: 'Microsoft Edge PDF Viewer', filename: 'internal-pdf-viewer', description: 'Portable Document Format', length: 1 }, 4: { name: 'WebKit built-in PDF', filename: 'internal-pdf-viewer', description: 'Portable Document Format', length: 1 } }, { [Symbol.toStringTag]: 'PluginArray' }),
        mimeTypes: Object.assign({ length: 2, item: function (i) { return null; }, namedItem: function () { return null; }, 0: { type: 'application/pdf', suffixes: 'pdf', description: 'Portable Document Format' }, 1: { type: 'text/pdf', suffixes: 'pdf', description: 'Portable Document Format' } }, { [Symbol.toStringTag]: 'MimeTypeArray' }),
        getGamepads: function () { return []; },
        getBattery: function () { return sandbox.Promise.resolve({ charging: true, level: 1, chargingTime: 0, dischargingTime: Infinity }); },
        sendBeacon: function () { return true; },
        mediaDevices: { enumerateDevices: function () { return sandbox.Promise.resolve([]); }, addEventListener: function () { } },
        permissions: { query: function () { return sandbox.Promise.resolve({ state: 'granted' }); } },
        toString: function () { return '[object Navigator]'; },
        hasOwnProperty: function (name) { return name in this; },
    };
    // 冻结 navigator 上的方法属性，防止 Ruishu 通过覆写检测非浏览器环境
    ['getGamepads', 'getBattery', 'sendBeacon', 'toString', 'hasOwnProperty'].forEach(function (prop) {
        var desc = Object.getOwnPropertyDescriptor(sandbox.navigator, prop);
        if (desc) {
            Object.defineProperty(sandbox.navigator, prop, {
                value: desc.value,
                writable: false,
                configurable: false,
                enumerable: true,
            });
        }
    });
    sandbox.window.navigator = sandbox.navigator;

    // ========== Location ==========
    sandbox.location = {
        [Symbol.toStringTag]: 'Location',
        href: config.url,
        protocol: parsedUrl.protocol,
        host: parsedUrl.host,
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || '',
        pathname: parsedUrl.pathname,
        search: parsedUrl.search,
        hash: parsedUrl.hash,
        origin: parsedUrl.origin,
        ancestorOrigins: {},
        assign: function () { },
        replace: function () { },
        reload: function () { },
        toString: function () { return this.href; },
    };
    sandbox.window.location = sandbox.location;

    // ========== Screen ==========
    sandbox.screen = {
        [Symbol.toStringTag]: 'Screen',
        width: 2560,
        height: 1440,
        toString: function () { return '[object Screen]'; },
        availWidth: 2560,
        availHeight: 1392,
        availLeft: 0,
        availTop: 0,
        colorDepth: 32,
        pixelDepth: 32,
        orientation: { angle: 0, type: 'landscape-primary', addEventListener: function () { } },
    };
    sandbox.window.screen = sandbox.screen;

    // ========== History ==========
    sandbox.history = {
        [Symbol.toStringTag]: 'History',
        length: 2,
        toString: function () { return '[object History]'; },
        pushState: function () { },
        replaceState: function () { },
        back: function () { },
        forward: function () { },
        go: function () { },
    };
    sandbox.window.history = sandbox.history;

    // ========== Window 方法 ==========
    sandbox.setTimeout = function (fn, delay) {
        if (typeof fn === 'function') return fn();
        return 0;
    };
    sandbox.setInterval = function (fn, delay) {
        return 1;
    };
    sandbox.clearTimeout = function () { };
    sandbox.clearInterval = function () { };
    sandbox.requestAnimationFrame = function (fn) { if (typeof fn === 'function') fn(performance.now()); return 0; };
    sandbox.cancelAnimationFrame = function () { };

    sandbox.addEventListener = function () { };
    sandbox.removeEventListener = function () { };
    sandbox.dispatchEvent = function () { return true; };

    // ========== Window 补充方法 (Ruishu 检测) ==========
    sandbox.getComputedStyle = function (el) {
        return new Proxy({}, { get: function(t, p) { if (p === 'length') return 0; if (p === 'getPropertyValue') return function() { return ''; }; return ''; } });
    };
    sandbox.matchMedia = function (query) {
        return { matches: false, media: query, addListener: function() {}, removeListener: function() {}, addEventListener: function() {}, removeEventListener: function() {}, dispatchEvent: function() { return true; } };
    };
    sandbox.postMessage = function () {};
    sandbox.open = function () { return null; };
    sandbox.close = function () {};
    sandbox.print = function () {};
    sandbox.focus = function () {};
    sandbox.blur = function () {};
    sandbox.scroll = function () {};
    sandbox.scrollTo = function () {};
    sandbox.scrollBy = function () {};
    sandbox.alert = function () {};
    sandbox.confirm = function () { return true; };
    sandbox.prompt = function () { return null; };
    sandbox.origin = parsedUrl.origin;
    sandbox.crossOriginIsolated = false;
    sandbox.isSecureContext = true;

    // CustomElementRegistry
    sandbox.customElements = {
        define: function() {}, get: function() { return undefined; }, upgrade: function() {}, whenDefined: function() { return sandbox.Promise.resolve(undefined); },
        [Symbol.toStringTag]: 'CustomElementRegistry',
    };

    sandbox.XMLHttpRequest = function () {
        return {
            open: function () { }, send: function () { }, setRequestHeader: function () { },
            abort: function () { }, overrideMimeType: function () { },
            readyState: 4, status: 200, responseText: '', responseURL: '',
            getAllResponseHeaders: function () { return ''; }, getResponseHeader: function () { return null; },
        };
    };
    sandbox.ActiveXObject = undefined;
    sandbox.HTMLFormElement = function () { };
    sandbox.Image = function () { return makeElement('img'); };
    sandbox.Option = function () { return makeElement('option'); };
    sandbox.Event = function () { };
    sandbox.CustomEvent = function () { };
    sandbox.MouseEvent = function () { };
    sandbox.KeyboardEvent = function () { };
    sandbox.MessageEvent = function () { };
    sandbox.ErrorEvent = function () { };
    sandbox.ProgressEvent = function () { };
    sandbox.DOMParser = function () {
        return {
            parseFromString: function () {
                return { getElementsByTagName: function () { return []; }, querySelectorAll: function () { return []; } };
            }
        };
    };

    // ========== Performance ==========
    var _perfBase = Date.now();
    var _perfOffset = 0;
    sandbox.performance = {
        [Symbol.toStringTag]: 'Performance',
        now: function () { _perfOffset += 0.1 + Math.random() * 0.9; return (Date.now() - _perfBase) + (_perfOffset % 1); },
        timing: {
            navigationStart: Date.now() - 5000,
            unloadEventStart: 0,
            unloadEventEnd: 0,
            redirectStart: 0,
            redirectEnd: 0,
            fetchStart: Date.now() - 4900,
            domainLookupStart: Date.now() - 4800,
            domainLookupEnd: Date.now() - 4700,
            connectStart: Date.now() - 4600,
            connectEnd: Date.now() - 4500,
            secureConnectionStart: Date.now() - 4550,
            requestStart: Date.now() - 4400,
            responseStart: Date.now() - 4200,
            responseEnd: Date.now() - 4100,
            domLoading: Date.now() - 4000,
            domInteractive: Date.now() - 3000,
            domContentLoadedEventStart: Date.now() - 2500,
            domContentLoadedEventEnd: Date.now() - 2400,
            domComplete: Date.now() - 1000,
            loadEventStart: Date.now() - 800,
            loadEventEnd: Date.now() - 500,
        },
        getEntries: function () { return []; },
        getEntriesByType: function () { return []; },
        getEntriesByName: function () { return []; },
        mark: function () { },
        measure: function () { },
    };

    // ========== Crypto ==========
    sandbox.crypto = {
        [Symbol.toStringTag]: 'Crypto',
        getRandomValues: function (arr) {
            for (var i = 0; i < arr.length; i++) arr[i] = Math.floor(Math.random() * 256);
            return arr;
        },
        randomUUID: function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0;
                return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
        },
        subtle: {
            digest: function () { return sandbox.Promise.resolve(new ArrayBuffer(32)); },
            encrypt: function () { return sandbox.Promise.resolve(new ArrayBuffer(0)); },
            decrypt: function () { return sandbox.Promise.resolve(new ArrayBuffer(0)); },
        },
    };

    // ========== AudioContext / OfflineAudioContext ==========
    sandbox.AudioContext = function AudioContext() {
        this.sampleRate = 48000;
        this.state = 'suspended';
        this.baseLatency = 0.01;
        this.currentTime = 0;
        this.destination = { numberOfInputs: 1, numberOfOutputs: 0, channelCount: 2, channelCountMode: 'explicit' };
        this.listener = { positionX: { value: 0 }, positionY: { value: 0 }, positionZ: { value: 0 } };
    };
    sandbox.AudioContext.prototype.createOscillator = function () { return { type: 'sine', frequency: { value: 440 }, connect: function () { return arguments[0]; }, start: function () { }, stop: function () { }, disconnect: function () { } }; };
    sandbox.AudioContext.prototype.createAnalyser = function () { return { fftSize: 2048, frequencyBinCount: 1024, connect: function () { }, getFloatFrequencyData: function (arr) { for (var i = 0; i < arr.length; i++) arr[i] = -100 + Math.random() * 50; } }; };
    sandbox.AudioContext.prototype.createGain = function () { return { gain: { value: 1, setValueAtTime: function () { } }, connect: function () { return arguments[0]; }, disconnect: function () { } }; };
    sandbox.AudioContext.prototype.createScriptProcessor = function (bufSize, inCh, outCh) { return { connect: function () { }, disconnect: function () { }, onaudioprocess: null }; };
    sandbox.AudioContext.prototype.createBiquadFilter = function () { return { type: 'lowpass', frequency: { value: 350 }, Q: { value: 1 }, connect: function () { return arguments[0]; }, disconnect: function () { } }; };
    sandbox.AudioContext.prototype.createDynamicsCompressor = function () { return { threshold: { value: -24 }, knee: { value: 30 }, ratio: { value: 12 }, attack: { value: 0.003 }, release: { value: 0.25 }, connect: function () { return arguments[0]; }, disconnect: function () { } }; };
    sandbox.AudioContext.prototype.close = function () { this.state = 'closed'; return sandbox.Promise.resolve(); };
    sandbox.AudioContext.prototype.resume = function () { this.state = 'running'; return sandbox.Promise.resolve(); };
    sandbox.AudioContext.prototype.createBuffer = function (ch, len, sr) { return { numberOfChannels: ch, length: len, sampleRate: sr, duration: len / sr, getChannelData: function () { return new Float32Array(len); } }; };
    sandbox.AudioContext.prototype.createBufferSource = function () { return { buffer: null, connect: function () { return arguments[0]; }, start: function () { }, stop: function () { }, disconnect: function () { } }; };

    sandbox.webkitAudioContext = sandbox.AudioContext;

    sandbox.OfflineAudioContext = function OfflineAudioContext(ch, len, sr) {
        this.sampleRate = sr || 44100;
        this.length = len || 44100;
        this.state = 'suspended';
        this.destination = { numberOfInputs: 1, numberOfOutputs: 0, channelCount: ch || 1 };
        this._channelCount = ch || 1;
        this._length = len || 44100;
        this._sampleRate = sr || 44100;
    };
    sandbox.OfflineAudioContext.prototype.createOscillator = sandbox.AudioContext.prototype.createOscillator;
    sandbox.OfflineAudioContext.prototype.createGain = sandbox.AudioContext.prototype.createGain;
    sandbox.OfflineAudioContext.prototype.createBiquadFilter = sandbox.AudioContext.prototype.createBiquadFilter;
    sandbox.OfflineAudioContext.prototype.createDynamicsCompressor = sandbox.AudioContext.prototype.createDynamicsCompressor;
    sandbox.OfflineAudioContext.prototype.createBuffer = sandbox.AudioContext.prototype.createBuffer;
    sandbox.OfflineAudioContext.prototype.createBufferSource = sandbox.AudioContext.prototype.createBufferSource;
    sandbox.OfflineAudioContext.prototype.createScriptProcessor = sandbox.AudioContext.prototype.createScriptProcessor;
    sandbox.OfflineAudioContext.prototype.startRendering = function () {
        var self = this;
        this.state = 'running';
        var bufLen = this._length || 44100;
        return sandbox.Promise.resolve({
            numberOfChannels: self._channelCount || 1,
            length: bufLen,
            sampleRate: self._sampleRate || 44100,
            duration: bufLen / (self._sampleRate || 44100),
            getChannelData: function () { return new Float32Array(bufLen); },
        });
    };

    // ========== Storage ==========
    function makeStorage() {
        var data = {};
        var storage = {
            [Symbol.toStringTag]: 'Storage',
            getItem: function (key) { return data[key] !== undefined ? data[key] : null; },
            setItem: function (key, val) { data[key] = String(val); },
            removeItem: function (key) { delete data[key]; },
            clear: function () { data = {}; },
            key: function (i) { return Object.keys(data)[i] || null; },
            get length() { return Object.keys(data).length; },
        };
        return storage;
    }
    sandbox.localStorage = makeStorage();
    sandbox.sessionStorage = makeStorage();
    sandbox.window.localStorage = sandbox.localStorage;
    sandbox.window.sessionStorage = sandbox.sessionStorage;

    // ========== Blob / File / FileReader ==========
    sandbox.Blob = function (parts, opts) { this.size = 0; this.type = (opts && opts.type) || ''; };
    sandbox.File = function (parts, name, opts) { this.name = name; this.size = 0; };
    sandbox.FileReader = function () {
        this.readAsText = function () { };
        this.readAsDataURL = function () { };
        this.readAsArrayBuffer = function () { };
        this.addEventListener = function () { };
    };
    sandbox.URL = function URL(url) { this.href = url || ''; this.protocol = ''; this.pathname = ''; };
    sandbox.URL.createObjectURL = function () { return 'blob:null/00000000-0000-0000-0000-000000000000'; };
    sandbox.URL.revokeObjectURL = function () { };

    // ========== WebSocket ==========
    sandbox.WebSocket = function () {
        return { send: function () { }, close: function () { }, addEventListener: function () { } };
    };
    sandbox.Worker = function () {
        return { postMessage: function () { }, terminate: function () { }, addEventListener: function () { } };
    };
    sandbox.SharedWorker = function () {
        return { port: { start: function () { }, postMessage: function () { }, addEventListener: function () { } } };
    };
    sandbox.BroadcastChannel = function () {
        return { postMessage: function () { }, close: function () { }, addEventListener: function () { } };
    };

    // ========== Missing globals ==========
    sandbox.fetch = function () { return sandbox.Promise.resolve({ ok: true, status: 200, json: function () { return sandbox.Promise.resolve({}); }, text: function () { return sandbox.Promise.resolve(''); } }); };
    sandbox.indexedDB = { open: function () { return { result: null, onsuccess: null, onerror: null }; } };
    sandbox.caches = { open: function () { return sandbox.Promise.resolve({ match: function () { return sandbox.Promise.resolve(null); } }); }, has: function () { return sandbox.Promise.resolve(false); } };
    sandbox.URLSearchParams = function (init) { this.params = {}; this.get = function (k) { return null; }; this.set = function () { }; this.has = function () { return false; }; this.toString = function () { return ''; }; };
    sandbox.Headers = function (init) { this._h = {}; this.get = function (n) { return null; }; this.set = function () { }; this.has = function () { return false; }; };
    sandbox.Request = function (url, opts) { this.url = url; this.method = (opts && opts.method) || 'GET'; };
    sandbox.Response = function (body, opts) { this.ok = true; this.status = 200; this.body = body; };
    sandbox.Notification = function (title, opts) { this.title = title; };
    sandbox.Notification.permission = 'default';
    sandbox.Notification.requestPermission = function () { return sandbox.Promise.resolve('default'); };
    sandbox.ServiceWorker = function () { };
    sandbox.queueMicrotask = function (fn) { sandbox.Promise.resolve().then(fn); };

    // ========== atob / btoa ==========
    var _Buffer = Buffer;
    sandbox.atob = function (s) { return _Buffer.from(s, 'base64').toString('binary'); };
    sandbox.btoa = function (s) { return _Buffer.from(s, 'binary').toString('base64'); };

    // ========== MutationObserver ==========
    sandbox.MutationObserver = function () {
        return { observe: function () { }, disconnect: function () { }, takeRecords: function () { return []; } };
    };
    sandbox.IntersectionObserver = function () {
        return { observe: function () { }, disconnect: function () { }, takeRecords: function () { return []; } };
    };
    sandbox.ResizeObserver = function () {
        return { observe: function () { }, disconnect: function () { } };
    };

    // ========== console (调试用) ==========
    sandbox.console = console;

    // ========== Ruishu 6 补丁 (逐步添加) ==========

    // chrome 对象
    sandbox.chrome = {
        runtime: {},
        loadTimes: function () { return { firstPaintTime: 0.1, startLoadTime: Date.now() / 1000 - 2, commitLoadTime: Date.now() / 1000 - 1.5, finishDocumentLoadTime: Date.now() / 1000 - 1, finishLoadTime: Date.now() / 1000 - 0.5, firstMeaningfulPaintTime: 0.2, navigationStart: Date.now() / 1000 - 2 }; },
        csi: function () { return { onloadT: Date.now(), startE: Date.now() - 2000, pageT: 1500, tran: 15 }; },
    };

    // 反自动化检测
    sandbox._phantom = undefined;
    sandbox.__nightmare = undefined;
    sandbox.callPhantom = undefined;
    sandbox._selenium = undefined;
    sandbox.__webdriver_evaluate = undefined;
    sandbox.__selenium_evaluate = undefined;
    sandbox.__webdriver_script_function = undefined;
    sandbox.__webdriver_script_func = undefined;
    sandbox.__webdriver_script_fn = undefined;
    sandbox.__fxdriver_evaluate = undefined;
    sandbox.domAutomation = undefined;
    sandbox.domAutomationController = undefined;
    sandbox.webdriver = undefined;
    sandbox.frameElement = null;
    sandbox.opener = null;

    // clientInformation
    sandbox.clientInformation = sandbox.navigator;

    // SpeechSynthesis
    sandbox.speechSynthesis = {
        speaking: false, pending: false, paused: false,
        getVoices: function () { return []; },
    };

    // PerformanceObserver
    sandbox.PerformanceObserver = function () {
        return { observe: function () { }, disconnect: function () { } };
    };

    // TextEncoder / TextDecoder
    sandbox.TextEncoder = function () {
        this.encode = function (str) {
            var arr = [];
            for (var i = 0; i < str.length; i++) arr.push(str.charCodeAt(i));
            return new Uint8Array(arr);
        };
    };
    sandbox.TextDecoder = function () {
        this.decode = function (arr) {
            return String.fromCharCode.apply(null, new Uint8Array(arr.buffer || arr));
        };
    };

    // ========== 批量标记所有环境函数为 native ==========
    markNative(sandbox.document, 'HTMLDocument.prototype.');
    markNative(sandbox.navigator, 'Navigator.prototype.');
    markNative(sandbox.location, 'Location.prototype.');
    markNative(sandbox.screen, 'Screen.prototype.');
    markNative(sandbox.history, 'History.prototype.');
    markNative(sandbox.performance, 'Performance.prototype.');
    markNative(sandbox.crypto, 'Crypto.prototype.');
    markNative(sandbox, '');
    // 标记 makeElement 创建的元素上的方法 (通过 __makeElement 工厂)
    // 也标记已创建的 head/body/html 元素
    if (sandbox.__makeElement) {
        var _origMakeElement = sandbox.__makeElement;
        sandbox.__makeElement = function(tag) {
            var el = _origMakeElement(tag);
            markNative(el, 'HTMLElement.prototype.');
            return el;
        };
    }
    // 标记已创建的 docEl, headEl, bodyEl
    if (sandbox.document && sandbox.document.documentElement) markNative(sandbox.document.documentElement, 'HTMLElement.prototype.');
    if (sandbox.document && sandbox.document.head) markNative(sandbox.document.head, 'HTMLElement.prototype.');
    if (sandbox.document && sandbox.document.body) markNative(sandbox.document.body, 'HTMLElement.prototype.');
}

module.exports = setupEnv;
