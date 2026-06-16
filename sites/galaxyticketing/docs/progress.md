# 银河票务逆向 - 工作进度与阻塞记录

> 最后更新: 2026-05-21
> 状态: **BLOCKED** - WASM 图片解密产出零像素

---

## 1. 已完成的工作

### 1.1 流量分析 (Phase 1)
- 完整登录流程抓包, 确认验证码系统为阿里百川 Baxia Grid Click
- 梳理出完整请求链路: 登录 → RGV587_ERROR → x5secdata → gridClickGet → gridClickReplace
- 确认关键接口:
  - `POST /api/user/userLogin` - 登录 (触发风控)
  - `GET /_____tmd_____/gridClickGet` - 获取九宫格图片
  - `GET /_____tmd_____/gridClickReplace` - 提交选择
- 确认所有必要 Headers: `_r`, `epeius`, `hecate`, `coeus`, `x-xsrf-token`, `x-mz-session`

### 1.2 加密定位 (Phase 2)
- 从 `scratch-captcha.js` 提取了 WASM dispatch table 完整定义
- 确认 WASM 初始化序列: `_initialize()` → `pc(1)` → `pc(2)` → 安装 `document.__update_img`
- 确认 opcodes 映射:
  - `uc` (0-27): Canvas/Image 操作
  - `mc` (10001-30000): 通用 VM 操作
  - 导入名: `{a: mc}` (ac="a")
- 确认运行时变量映射: `W=gc, X=dc, G=bc, j=qc, K=lc, Z=fc, J=kc, $=mc, Q=hc, B=pc, H=rc`

### 1.3 代码编写 (Phase 4 部分)
- `src/main.py` - 主流程脚本 (登录 + 验证码触发 + 图片获取)
- `src/captcha_solver.py` - 云码 OCR 模块 (type=30008, merge_grid_images)
- `src/node_bridge.py` - Python ↔ Node.js stdio JSON-RPC 桥接
- `node/baxia_env.js` - Node.js 补环境 WASM 脚本 (stdio 模式)
- `node/program.wasm` - Baxia WASM 模块
- `node/scratch-captcha.js` - Baxia SDK 原始源码 (含完整 opcodes 定义)

---

## 2. 核心阻塞问题: WASM __update_img 解密产出零像素

### 2.1 现象
- `__update_img(index, canvas, {token, data})` 返回 0 (表示成功)
- 但 Canvas 上的像素数据全部为零 (nonZero=0/180000)
- 在浏览器中同样调用正常工作, Canvas 有实际图像数据

### 2.2 已确认的事实

**API 返回的图片格式:**
- `gridClickGet` API 返回 9 张图片, 每张的 `content` 字段是 **raw base64** (不是 data URL)
- base64 解码后前 4 字节为 `00 00 00 03` (加密类型标记)
- 后面是加密二进制数据
- `encryptToken` 字段为 hex 字符串 (2049 字符, 解码为 1536 字节二进制)

**WASM __update_img 执行流程 (通过 opcode trace 确认):**
```
1. op10010 ×2: 读取 gc[70]."data" 和 gc[70]."token"
2. op10060 ×2: 将 data(860字符) 写入 hc[79032], token(2049字符) 写入 hc[79904]
3. [WASM 内部处理] — 无任何 import 函数调用, 纯 WASM 内部执行
4. op10063: 创建 Uint8ClampedArray view (hc.buffer, 81976, 180000) — 输出缓冲区
5. op14: 创建 ImageData(300×150) — 从输出缓冲区读取
6. 返回 0
```

**关键发现:**
- 步骤 3 的 WASM 内部解密产生零输出 (输出缓冲区全零)
- WASM 仅访问 `gc[70]."data"` 和 `gc[70]."token"` 两个属性, **不访问 gc[6] (self/window)**
- `__update_info` 函数未安装 (WASM 初始化后不存在), 所以不是缺少调用 __update_info
- op27 (requestAnimationFrame) 被设为 stub `return bc(1)` — 原始代码是 `window.requestAnimationFrame(qc(c))`, 但 rAF 会造成无限循环所以被 stub

### 2.3 已尝试的方法及失败原因

| 方法 | 结果 | 原因 |
|------|------|------|
| 直接 PIL 解码 content | ❌ | content 是加密数据 (00000003 前缀), 不是有效图片格式 |
| WASM __update_img 解密 | ❌ | 内部解密产出零像素 (见上) |
| 修改 gc[6] 从 null 改为 window 对象 | 未尝试 | trace 确认 __update_img 不访问 gc[6] |
| 尝试调用 __update_info 预初始化 | ❌ | __update_info 不存在于 WASM exports 中 |
| 将 op27 改为 setTimeout | ❌ | 导致 30s 超时 |
| 将 op27 改为同步调用回调 | ❌ | rAF 回调递归注册自身导致无限循环 |

### 2.4 可能的原因分析

1. **WASM 内部状态依赖**: pc(2) 初始化期间可能设置了某些内部状态, 解密算法依赖这些状态。我们的补环境可能遗漏了某个关键的环境 API 调用。
2. **op27 (rAF) 的副作用**: 浏览器中 rAF 回调会在每帧执行, 可能在 pc(2) 之后的动画帧中完成了某些解密所需的状态初始化。我们 stub 了 op27 导致这些初始化被跳过。
3. **Canvas/Image 环境不完整**: op8 (new Image) 在浏览器中是真正的 HTMLImageElement, 支持异步加载。我们的 fake Image 可能缺少某些属性/行为。
4. **加密算法本身**: WASM 内部的解密可能使用了某种依赖于时间/随机数/状态的算法, 而我们的环境没有正确提供这些。

---

## 3. 两种不同的数据格式 (重要线索)

### 3.1 格式 A: 加密格式 (当前 API 返回)
```
content: "AAAAA4OwT+5BcPFEEd3CbmKejYWvzy..."  (raw base64)
解码后: 00 00 00 03 83 b0 4f ee ... (加密数据, 644-1796 字节不等)
```
- 这是我们直接调用 API 时获得的格式
- 需要 WASM 解密

### 3.2 格式 B: Data URL 格式 (trace_input.json 中记录)
```
content: "data:image/webp;base64,UklGRh4DAABXRUJQVlA4..."  (data URL)
```
- 这是在某次测试中记录的格式
- 可以直接 PIL 解码为有效 WebP 图片
- **不需要 WASM 解密**

### 3.3 格式差异的原因
- trace_input.json 中的数据可能来自不同的 API 状态、不同的 captcha 配置、或经过了浏览器端预处理
- 也可能与 `ua` 参数 (Baxia SDK 生成的设备指纹) 有关 — 不同的 ua 可能导致服务器返回不同格式
- 也可能与 `appKey` 参数有关

---

## 4. scratch-captcha.js 中的关键代码

### 4.1 WASM 初始化
```js
// 位置: scratch-captcha.js char 1037969+
WebAssembly.compile(wasmBuffer).then(function(c) {
    var a;
    return WebAssembly.instantiate(c, ((a={})[ac]=mc, a))  // ac="a", mc=dispatch table
}).then(function(a) {
    var n = a.exports;
    n._initialize();
    Q = new Uint8Array(n.memory.buffer);  // hc = WASM memory view
    B = n[0];  // pc = entry function (export name "0")
});

// 回调:
H = B(1);           // rc = pc(1) = 10688
var n = W.length;    // n = gc.length after pc(1) = 68
B(2);               // pc(2) - installs __update_img etc
X = n;              // dc = 68 (reset to before pc(2))
```

### 4.2 gc 初始化 (位置: char 1035176)
```js
gc = [undefined, null, true, false, 0, function(){}, self, self.document]
// gc[0]=undefined, gc[1]=null, gc[2]=true, gc[3]=false
// gc[4]=0 (this slot), gc[5]=function(){}, gc[6]=self(window), gc[7]=document
dc = gc.length  // = 8
```

### 4.3 op10070 (回调创建, 与原版完全一致)
```js
10070: function(c) {
    return W[X] = function(c) {
        return function() {
            J = arguments;  // kc = arguments (重赋值!)
            W[4] = this;    // gc[4] = this
            var a = X, n = B(0, c, 0);  // pc(0, funcIdx, 0)
            return X = a, n;  // dc = saved_dc; return wasm_result
        };
    }(c), X++;
}
```
**注意**: `kc` 必须是 `let` 不能是 `const`, 因为 op10070 会 `kc = arguments` 重赋值。

### 4.4 op27 (requestAnimationFrame, 原始版)
```js
27: function(c) { return bc(window.requestAnimationFrame(qc(c))) }
```
- 在 Node.js 中改为 stub `return bc(1)` (因为 rAF 回调会递归注册自身导致无限循环)

### 4.5 updateImgGrid (九宫格图片更新, 位置: char 975674)
```js
this.updateImgGrid = function(c, n) {
    if ("infopurchase" === t[a.options.type]) {
        // 格式 B 路径: 直接 Image 加载 (data URL)
        var e = gridList[n.index].children[0],
            o = e.getContext("2d"),
            i = new Image;
        i.src = n.content;  // content 是 data URL
        i.onload = function() {
            o.clearRect(0,0,e.width,e.height);
            o.drawImage(i,0,0,e.width,e.height);
        }
    } else {
        // 格式 A 路径: WASM 解密
        a.options.SecCaptcha.updateImg(
            gridList[n.index].children[0],
            {token: c.data.encryptToken, data: n.content}
        );
    }
}
```

### 4.6 updateImg → __update_img
```js
updateImg: function(c, a) {
    var n = Cc.indexOf(c);
    -1 === n && (-1 === (n = Cc.indexOf(null)) && (n = Cc.length), Cc[n] = c);
    var t = document.__update_img(n, c, a);  // n=index, c=canvas, a={token,data}
    if (t > 0) throw Error(Sc[t-1] || "ERROR_UNKNOWN");
}
```

---

## 5. 文件清单与作用

### 核心文件 (保留)
| 文件 | 作用 | 状态 |
|------|------|------|
| `src/main.py` | Python 主流程: 登录+验证码触发+图片获取 | 图片解码部分需重写 |
| `src/captcha_solver.py` | 云码 OCR: 九宫格识别+图片合并 | 完成, 可用 |
| `src/node_bridge.py` | Python↔Node.js stdio 桥接 | 完成, 但 WASM 解密不工作 |
| `node/baxia_env.js` | Node.js 补环境 + stdio 服务 | WASM 加载成功, 解密失败 |
| `node/program.wasm` | Baxia WASM 模块 | 正常加载, 解密不工作 |
| `node/scratch-captcha.js` | Baxia SDK 原始源码 | 参考用, 不执行 |

### 测试文件 (参考)
| 文件 | 作用 |
|------|------|
| `node/test_fresh_trace.js` | 用最新 API 数据 trace __update_img |
| `node/test_wasm_decrypt.js` | 完整解密测试 (stdin pipe) |
| `node/test_trace.js` | 详细 opcode trace |
| `node/test_rAF.js` | rAF 回调测试 (确认无限循环) |
| `tests/fresh_data.json` | 最新 API 返回数据 (2026-05-21) |
| `tests/trace_input.json` | 旧测试数据 (content 为 data URL 格式) |
| `tests/test_real_decrypt.py` | Python 端到端测试脚本 |

---

## 6. 下一步建议 (按优先级排序)

### 方案 A: 继续调试 WASM 解密 (难度: ⭐⭐⭐⭐⭐)
1. **对比浏览器执行**: 用 AdsPower 打开验证码页面, 通过 evaluate-script 或 CDP 注入, 在 __update_img 调用前后 dump WASM 内存, 对比 Node.js 的内存状态
2. **检查 pc(2) 后的 gc 状态**: pc(2) 从 dc=68 扩展到 gc.length=75, 添加了 7 个 gc 项。检查这些项是否包含了解密所需的密钥/状态
3. **rAF 回调问题**: 研究 op27 在 pc(2) 期间注册的回调是否执行了必要的初始化。在浏览器中, rAF 回调在下一帧执行, 可能在 __update_img 被调用前完成了状态设置
4. **使用 IDA/WASM 反编译**: 用 ida-pro-mcp 或 wasm2wat 反编译 program.wasm, 找到 __update_img 内部的解密算法

### 方案 B: 浏览器辅助解密 (难度: ⭐⭐)
1. 用 AdsPower 浏览器打开 galaxyticketing.com
2. 触发验证码, 让浏览器端 WASM 解密图片
3. 通过 evaluate-script 提取已解密的 Canvas 内容
4. 传给 Python 进行 OCR + 提交
- 缺点: 每次解密需要浏览器, 不够 "协议优先"

### 方案 C: 寻找明文图片接口 (难度: ⭐⭐⭐)
1. 研究 `ua` 参数对 API 返回格式的影响
2. 尝试不同的 `ua` / `appKey` 参数组合, 看是否能获得 data URL 格式 (格式 B) 的图片
3. 如果能获得格式 B, 则不需要 WASM 解密, 直接 PIL 解码

### 方案 D: 替代验证码方案 (难度: ⭐⭐)
1. 研究是否有其他验证码类型可用 (非 grid click)
2. 或者研究是否可以跳过验证码 (例如通过 cookie 复用)

---

## 7. 运行环境要求

- Python: `./venv/Scripts/python.exe` (项目内虚拟环境)
- Node.js: 20+ (需安装 `canvas` 模块: `npm install canvas`)
- 云码 API Token: `tR5pqscPQ0EI8n7thn38hAIyyakstNb6-DFUuT9pGwI`
- AdsPower Profile ID: `k1bhfp97`

### 快速测试命令
```bash
# 获取最新验证码数据
cd /e/PythonCodeObject1/Qoder_ObjectProdemo2
./venv/Scripts/python.exe sites/galaxyticketing/tests/test_real_decrypt.py

# 测试 WASM 解密
cd sites/galaxyticketing
echo '{"id":1,"action":"ping"}' | node node/baxia_env.js --stdio

# 带 trace 的 WASM 解密
node node/test_fresh_trace.js
```
