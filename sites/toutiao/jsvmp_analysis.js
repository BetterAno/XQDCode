/**
 * 今日头条 a_bogus - JSVMP 插桩调试与补环境实现
 * 
 * 核心思路：
 * 1. JSVMP (JavaScript Virtual Machine Protection) 将加密算法编译成字节码
 * 2. 通过插桩法记录虚拟机每条指令的执行
 * 3. 根据虚拟机依赖补全浏览器环境
 * 4. 最终还原加密算法
 * 
 * 参考：
 * - https://blog.csdn.net/honey/article/details/152070796
 * - https://blog.csdn.net/weixin_54390416/article/details/151362915
 */

// ========== 第1步：JSVMP 虚拟机插桩调试 ==========

/**
 * 在浏览器中执行此代码，Hook JSVMP 虚拟机的关键操作
 */
const jsvmpInstrumentation = `
(function() {
  console.log('=== JSVMP 插桩调试启动 ===');
  
  // 1. Hook Array 相关操作 (JSVMP 大量使用数组操作)
  const origArrayPush = Array.prototype.push;
  Array.prototype.push = function(...items) {
    if (this.length > 1000) {
      console.log('[Array.push] 大型数组，长度:', this.length, '新增:', items.length);
    }
    return origArrayPush.apply(this, items);
  };
  
  // 2. Hook String.fromCharCode (常用于字符串构造)
  const origFromCharCode = String.fromCharCode;
  String.fromCharCode = function(...codes) {
    const result = origFromCharCode.apply(this, codes);
    if (result.length > 10 && result.length < 200) {
      console.log('[fromCharCode] 输入:', codes.slice(0, 10), '输出:', result.substring(0, 50));
    }
    return result;
  };
  
  // 3. Hook 位运算相关的 Number 方法
  const origNumberToString = Number.prototype.toString;
  Number.prototype.toString = function(radix) {
    const result = origNumberToString.call(this, radix);
    if (radix === 16 && result.length > 8) {
      console.log('[Number.toString(16)]', this, '->', result);
    }
    return result;
  };
  
  // 4. Hook apply 和 call (JSVMP 常用调用方式)
  const origApply = Function.prototype.apply;
  Function.prototype.apply = function(thisArg, argsArray) {
    if (this.name && this.name.length > 20) {
      console.log('[Function.apply]', this.name.substring(0, 30), '参数数量:', argsArray ? argsArray.length : 0);
    }
    return origApply.call(this, thisArg, argsArray);
  };
  
  // 5. Hook XMLHttpRequest (捕获 a_bogus 生成时机)
  const origXHROpen = XMLHttpRequest.prototype.open;
  const origXHRSend = XMLHttpRequest.prototype.send;
  
  XMLHttpRequest.prototype.open = function(method, url) {
    this._requestMethod = method;
    this._requestUrl = url;
    return origXHROpen.apply(this, arguments);
  };
  
  XMLHttpRequest.prototype.send = function(body) {
    if (this._requestUrl && this._requestUrl.includes('a_bogus')) {
      console.log('\\n=== 捕获到 a_bogus 请求 ===');
      console.log('URL:', this._requestUrl);
      
      const match = this._requestUrl.match(/a_bogus=([^&]+)/);
      if (match) {
        console.log('a_bogus 值:', decodeURIComponent(match[1]));
        console.log('调用栈:');
        console.trace();
      }
    }
    return origXHRSend.apply(this, arguments);
  };
  
  // 6. Hook fetch
  const origFetch = window.fetch;
  window.fetch = function(url, options) {
    if (typeof url === 'string' && url.includes('a_bogus')) {
      console.log('\\n=== 捕获到 a_bogus 请求 (fetch) ===');
      console.log('URL:', url);
      
      const match = url.match(/a_bogus=([^&]+)/);
      if (match) {
        console.log('a_bogus 值:', decodeURIComponent(match[1]));
        console.log('调用栈:');
        console.trace();
      }
    }
    return origFetch.apply(this, arguments);
  };
  
  console.log('✅ JSVMP 插桩已完成，请触发请求查看日志');
})();
`;

// ========== 第2步：浏览器环境补全 (基于 JSVMP 需求) ==========

/**
 * 根据 JSVMP 虚拟机的特点补全环境
 * JSVMP 通常依赖以下浏览器 API：
 */

// 1. 基础对象
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

// Window 对象
window = globalThis;
window.self = window;
window.top = window;
window.innerWidth = 1535;
window.innerHeight = 743;
window.outerWidth = 1536;
window.outerHeight = 864;

// Navigator (JSVMP 会读取)
navigator = {
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
    platform: "Win32",
    language: "zh-CN",
    languages: ["zh-CN"],
    cookieEnabled: true,
    hardwareConcurrency: 20,
    deviceMemory: 8,
    appVersion: "5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    appName: "Netscape",
    product: "Gecko",
    productSub: "20030107",
    vendor: "Google Inc.",
    vendorSub: "",
    onLine: true,
    webdriver: false
};

// Screen (JSVMP 会读取屏幕信息)
screen = {
    width: 1280,
    height: 800,
    availWidth: 1280,
    availHeight: 760,
    colorDepth: 24,
    pixelDepth: 24
};

// Location
location = {
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

// Document
function HTMLDocument() {
    this.cookie = 'ttwid=xxx; msToken=8ylJ54lgeSMBtd8YK4kS7JZMxAeO3wjuSZWNcOS-YHJlNwqjbc9_iMCCHOOdihuNpM-ZIALIo4DoVKlx-QPOSq_JGQ6ZAkJEL8qZ9mkkoAWvAmynVMehfaC-ehelMPc=';
    this.referrer = '';
    this.hidden = false;
}

HTMLDocument.prototype.createElement = managerNative(function(tagName) {
    console.log(`[createElement] ${tagName}`);
    return {
        tagName: tagName.toUpperCase(),
        getContext: function() { return null; },
        toDataURL: function() { return ''; }
    };
}, 'createElement');

HTMLDocument.prototype.querySelector = managerNative(function(selector) {
    return null;
}, 'querySelector');

document = new HTMLDocument();

// Canvas (JSVMP 会检测 Canvas 指纹)
function CanvasRenderingContext2D() {
    this.font = "10px sans-serif";
    this.fillStyle = "#000000";
}

CanvasRenderingContext2D.prototype.fillText = managerNative(function() {}, 'fillText');
CanvasRenderingContext2D.prototype.measureText = managerNative(function(text) {
    return { width: text.length * 10 };
}, 'measureText');

function HTMLCanvasElement() {
    this.width = 300;
    this.height = 150;
}

HTMLCanvasElement.prototype.getContext = managerNative(function(type) {
    if (type === '2d') return new CanvasRenderingContext2D();
    return null;
}, 'getContext');

HTMLCanvasElement.prototype.toDataURL = managerNative(function() {
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
}, 'toDataURL');

// Time 函数
const _originalDateNow = Date.now;
const _fixedTimestamp = Date.now();

Date.now = managerNative(function() {
    return _fixedTimestamp;
}, 'now');

// ========== 第3步：JSVMP 字节码分析 ==========

/**
 * 根据逆向分析，头条 JSVMP 的关键特征：
 * 
 * 1. 虚拟机启动器：
 *    - 通常在 bdms_1.0.1.x.js 或 collect.js 中
 *    - 使用 Function.prototype.apply 执行字节码
 * 
 * 2. 字节码格式：
 *    - 数组形式存储指令
 *    - 包含操作码 (opcode) 和操作数 (operand)
 *    - 常见操作：XOR、ADD、SUB、位运算、数组操作
 * 
 * 3. 加密流程：
 *    a. 收集输入数据 (URL参数、时间戳、UserAgent)
 *    b. 初始化虚拟机状态
 *    c. 逐条执行字节码指令
 *    d. 输出加密结果 (a_bogus)
 * 
 * 4. 环境检测点：
 *    - navigator.userAgent
 *    - navigator.platform
 *    - screen.width/height
 *    - Date.now()
 *    - Canvas 指纹
 *    - localStorage/sessionStorage
 */

// ========== 第4步：a_bogus 生成算法还原 (框架) ==========

/**
 * a_bogus 生成器 (需要根据插桩日志完善)
 * 
 * @param {Object} params - 请求参数
 * @returns {String} a_bogus 签名
 */
function generateABogus(params) {
    console.log('\n========== 开始生成 a_bogus ==========');
    
    // 1. 收集输入数据
    const inputData = {
        url: '/api/pc/list/feed',
        params: params,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
        random: Math.random()
    };
    
    console.log('输入数据:', inputData);
    
    // 2. JSVMP 虚拟机模拟 (需要根据插桩日志实现)
    // 这里是框架，实际需要根据逆向结果填充
    const bogus = simulateJSVMP(inputData);
    
    console.log('生成的 a_bogus:', bogus);
    console.log('========== 生成完成 ==========\n');
    
    return bogus;
}

/**
 * 模拟 JSVMP 虚拟机执行
 * (需要根据实际插桩日志还原字节码逻辑)
 */
function simulateJSVMP(inputData) {
    /**
     * 根据插桩调试，JSVMP 的核心逻辑可能是：
     * 
     * 1. 数据预处理
     *    - 拼接 URL + 参数 + UserAgent
     *    - 转换为字节数组
     * 
     * 2. 虚拟机初始化
     *    - 加载字节码指令
     *    - 初始化寄存器
     * 
     * 3. 执行字节码
     *    - 循环读取指令
     *    - 执行对应操作 (XOR、ADD、移位等)
     *    - 更新寄存器状态
     * 
     * 4. 输出结果
     *    - 从寄存器读取最终值
     *    - Base64 编码
     * 
     * 示例伪代码：
     * 
     * const bytecode = [...]; // 字节码指令
     * const registers = new Array(256).fill(0);
     * 
     * for (let i = 0; i < bytecode.length; i += 3) {
     *     const opcode = bytecode[i];
     *     const op1 = bytecode[i + 1];
     *     const op2 = bytecode[i + 2];
     *     
     *     switch(opcode) {
     *         case 0x01: // XOR
     *             registers[op1] ^= registers[op2];
     *             break;
     *         case 0x02: // ADD
     *             registers[op1] += registers[op2];
     *             break;
     *         // ... 其他指令
     *     }
     * }
     * 
     * return btoa(String.fromCharCode(...registers.slice(0, 64)));
     */
    
    // 占位实现 (需要替换为真实逻辑)
    console.warn('⚠️ JSVMP 虚拟机逻辑需要根据插桩日志还原');
    return 'placeholder_bogus_value==';
}

// ========== 第5步：使用示例 ==========

console.log('========== 头条 a_bogus JSVMP 补环境框架 ==========');
console.log('✅ 环境补全完成');
console.log('📝 下一步：在浏览器中执行插桩代码，收集字节码执行日志\n');

// 打印插桩代码，供用户在浏览器中执行
console.log('=== 请在浏览器控制台执行以下代码 ===');
console.log(jsvmpInstrumentation);
console.log('===================================\n');

// 测试生成
const testParams = {
    offset: 0,
    channel_id: 94349549395,
    max_behot_time: 0,
    category: 'pc_profile_channel',
    disable_raw_data: true,
    aid: 24,
    app_name: 'toutiao_web',
    msToken: '8ylJ54lgeSMBtd8YK4kS7JZMxAeO3wjuSZWNcOS-YHJlNwqjbc9_iMCCHOOdihuNpM-ZIALIo4DoVKlx-QPOSq_JGQ6ZAkJEL8qZ9mkkoAWvAmynVMehfaC-ehelMPc='
};

const aBogus = generateABogus(testParams);

console.log('💡 完整使用流程:');
console.log('1. 在浏览器中执行插桩代码 (上面已打印)');
console.log('2. 触发头条请求，观察控制台日志');
console.log('3. 记录字节码指令和执行过程');
console.log('4. 根据日志还原 simulateJSVMP 函数');
console.log('5. 测试生成的 a_bogus 是否有效');
