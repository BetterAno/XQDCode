# singlewindow_rs6（瑞数 6 代）Python 纯算逆向 — Phase 3 实施方案

> 目标站：`https://swapp.singlewindow.cn/qspserver/sw/qsp/query/biznew/import`
> 路线：P2（Python 纯算重写 rs6 VM），CLAUDE.md §4.3 强制 Plan 确认门槛

---

## 1. 接口信息（Phase 1 实测）

| 接口 | URL | Method | 状态 | 用途 |
| --- | --- | --- | --- | --- |
| 视图页 | `/qspserver/sw/qsp/query/view/import` | GET | 200 | 下发 O cookie + 嵌入 `$_ts.nsd / $_ts.cd` |
| 数据接口 | `/qspserver/sw/qsp/query/biznew/import` | GET | **412** | 412 体内含独立 `$_ts.cd` + 另一个 vmp JS |
| vmp1 | `/qspserver/ZCQq7Fzuhp12/oQ91zEKu9zN4.44d6eb6.js` | GET | 200 | 263837 bytes，view 页用 |
| vmp2 | `/qspserver/ZCQq7Fzuhp12/BSrw3csEQORp.44d6eb6.js` | GET | 200 | 312610 bytes，biznew 用 |

**实证：**
- 同一 URL 拉 3 次 sha256 不变 → 不是 per-fetch 多态，**仅 per-endpoint 多态**
- 两份 vmp 同源同构：14 个相同函数名、3 个 dispatcher 循环、入口编号 `[21]/[73]`、opcode 树边界完全一致 → **同一份 dispatcher 模板，差别只在末尾 opcode 数组**
- view 页响应头明确下发 `CKvDhNH2GZibO=qapwqCzn...`（**O cookie**，短期），与 [rs6js_code.js:4689](sites/rs6js_code.js#L4689) 监听的 `CKvDhNH2GZibP=` 配对（**P cookie**，需 vmp 生成）

## 2. 请求参数

| 参数 | 来源 | 是否加密 |
| --- | --- | --- |
| `CKvDhNH2GZibO` cookie | 服务端 Set-Cookie | ❌ 直接复用 |
| `CKvDhNH2GZibP` cookie | **客户端 vmp 计算** | ✅ 本任务核心目标，长度 513/492 |
| `enable_CKvDhNH2GZib` cookie | vmp 设置 | ⚠️ 仅标记位 |
| URL 签名参数 | 待验证 — biznew/import 当前未见，需登录后再确认 | — |
| `JSESSIONID` | 服务端 Set-Cookie | ❌ 直接复用 |

## 3. 加密 / vmp 结构（Phase 2 已实证）

### 3.1 五层 dispatcher 拓扑

| dispatcher | offset | 角色 | opcode 数 | 状态 |
| --- | --- | --- | --- | --- |
| D0 boot | 562 | 环境绑定 `window/Math/Date` | 9 | ✅ 已提取 |
| **D1 主 VM** | 1679 | **解释 `$_ts.cd` 字节码** | **72** | ✅ 已提取（[phase2_d1_opcodes.json](assets/phase2_d1_opcodes.json)） |
| D2 `_$a4` | 256742 | 代码生成器（拼 JS 源码） | 57 | ✅ 已映射 |
| D3 `_$ps` | 260348 | 拼 JS 关键字 `while(1){`/`}else` | 41 | ✅ 已映射 |
| D5 `_$iq` | 262835 | LCG `0x3d3f*x+0x269ec3` + 小查表 | 3 | ✅ 已读懂 |

### 3.2 已识别的关键 opcode（D1）

| op | 语义 |
| --- | --- |
| 0/10/26/48/52/74 | `var = _$k7()` 取字节码 token |
| 13/21/38/40/41/44/49/68/76/78/90 | 条件跳转 `!flag?_$lV+=N:0` |
| 22/73/82/86 | 无条件跳转 `_$lV+=±N` |
| 18/20/62/69 | 写入 `$_ts.aebi / cp / nsd` 指纹累积 |
| 30/36/81/89 | 调用 D2 `_$a4()` 生成 JS 源码段 |
| 25/80/92 | **`_$km.call/_$ke.eval/execScript`** — 触发 JS 引擎执行 D2 产物 |
| 53 | `_$j$="ưǰΞΟǰၤ..."` 字节码字符表（BMP 高位字符压缩） |
| 56/70 | 大字符串字面量（指纹特征码本，XOR/ROT 加密） |
| 33 | `_$bH=_$j$.substr(_$ac,_$_S).split(String.fromCharCode(257))` — 从 `_$j$` 切段并按 0x101 分割 |
| 77 | `_$n4.push(_$_C.substr(0, _$bU()%5))` — LCG 模 5 截取 |
| 4 | `_$a2.jf= !_$km` — **反 prettify 标志位** |

### 3.3 反检测点（不能踩）

- D2 op3: 正则 `/\S+\(\)\{\S+['|"].+['|"];\}/` 测试 JS 是否被 prettify
- D2 op4: `$_ts.jf = !格式化检测` → true 时下游进入死循环
- D2 字符串 `"debu" + "gger;"` → 生成代码含 `debugger;` 反调试
- D1 op 80/92: 抓 `window.eval` 与 `execScript` → 用于跑 D2 生成的 specialized JS

### 3.4 cookie 流（推断）

```
view/import 200 → Set-Cookie: CKvDhNH2GZibO=<服务端 challenge>
                      ↓
HTML 内嵌 $_ts.nsd = <integer>, $_ts.cd = "<bytecode-text>"
                      ↓
浏览器加载 oQ91zEKu9zN4.44d6eb6.js：
   D0 boot → D1 解释 _$ts.cd
            → 读字符表 _$j$ → 解码出真实 opcode 序列
            → 累积指纹到 $_ts.aebi
            → 调 D2 生成 specialized JS → eval
            → 拼出最终 cookie 值
                      ↓
document.cookie = "CKvDhNH2GZibP=...(length 513/492)..."
                      ↓
biznew/import 重发请求带 O+P 双 cookie → 200
```

## 4. 实现方案 — 两条子路线（**用户必须二选一**）

### 路线 P2-A — Python 完全自洽（无 JS 引擎）
- 复刻 D0–D5 共 **182 个 opcode** 到 Python
- D2 生成的 JS 字符串**用 Python 解析为 Python AST 并执行**（自建 JS 子集解释器）
- ❌ **不推荐**：等同于实现 V8 子集，工作量 >300h，且 D2 输出的 JS 含变量提升/闭包/Function 构造器，子集很难"够用"

### 路线 P2-B — Python D1 通用解释器，仅 op 25/80/92 用最小化嵌入式 JS（**推荐**）✅
- **核心洞察**：D2 生成的 JS 本质是 D1 的"线性化展开"，**直接 Python 跑 D1 通用解释器就不需要 D2 的 JS 产物**
- 但 D1 中 op 25/80/92 仍会显式触发 eval —— **这部分占总字节码 <5%**，可：
  - **方案 B-1**: 用 `py-mini-racer`（V8）/ `quickjs-python` 仅跑这几个 eval 上下文，传入/取出值
  - **方案 B-2**: 手工分析 D2 生成的 JS 模板（结构有限），把这几种模板**手写成 Python 函数**
- 工作量：约 **80–120h**

**P2-B 是当前唯一务实的"接近纯算"路线**

## 5. P2-B 任务拆分（如确认走这条）

### T1 — 字符表 / 字节码解码（10h）
- 提取 op 53 的 `_$j$` 完整字符串（含 BMP 高位字符）
- 还原 `_$k7()` 解码逻辑（按 LCG 序列从 `_$j$` 取字符 → 转 token int）
- 输入：vmp JS + 入口编号 `[21]`；输出：`bytecode: list[int]`
- **交付物**：`src/decoder.py` + 单元测试（vmp 解码后能 dump 出可读 opcode 序列）

### T2 — D1 主解释器（30–40h）
- 把 72 个 opcode 翻译成 Python 函数（带寄存器字典）
- 实现 `_$aO(N, ...)`（函数表调用 — 入口编号 → 字节码偏移）
- 实现 `_$bU/_$my` LCG（D5 op 全部 3 个）
- 实现 D0 9 个 opcode
- **交付物**：`src/d1_vm.py` + `src/d0_boot.py`

### T3 — 浏览器环境桩（20h）
- `navigator.userAgent / .platform / .languages` 固定值
- `Math.random` → 固定 PRNG（rs6 检测 Math.random 调用次数，需可重放）
- `Date.now / performance.now` 固定基线
- `document.cookie` 读写（管 O cookie 输入 + P cookie 输出捕获）
- `Function.prototype.toString` 模拟 `[native code]`
- **交付物**：`src/env/browser_stubs.py`

### T4 — op 25/80/92 eval 区段处理（15h）
- 在 D1 解释器跑到 op 80 时，捕获 D2 生成的字符串
- 用 `py-mini-racer` 起一个**最小化沙盒**（只暴露环境桩，不补全 DOM）
- 把 eval 结果回填到寄存器
- **回退**：若 `py-mini-racer` 装不上 Windows，改用 `quickjs-python` 或 `subprocess + node -e`（但这违反"不依赖 Node"原则，仅作下下策）
- **交付物**：`src/eval_sandbox.py`

### T5 — Cookie 校验脚本（10h）
- Python 主流程：拉 view → 提 `$_ts.cd` → 跑 P2-B 解释器 → 取 cookie → 拉 biznew → 验证 200
- **交付物**：`src/main.py`
- **验证标准**：5 次会话内 4 次以上 biznew 返回 200 + 有效 JSON

### T6 — 多接口适配（5h）
- 把 oQ91zEKu9zN4 与 BSrw3csEQORp 都跑通
- 若两份 dispatcher 真的同源，**T2 实现一次即可适配**；如有差异，做最小 diff
- **交付物**：通用化的 `src/main.py` 接口参数

**总计：~95h**（中位数）

## 6. 风险与回退

| 风险 | 触发条件 | 回退 |
| --- | --- | --- |
| **R1 vmp 服务端换版本** | 服务端 push 新 `.44d6eb6.js`→`.xxxxx.js` | 重新跑 Phase 2 dump_d1_opcodes，对 diff，**预期 80% opcode 不变** |
| **R2 `_$k7()` 解码细节出错** | 解码出的 opcode 序列含越界值 | 用 Hook 反取浏览器侧 D1 寄存器（需 CDP，违反 P2 纯 Python，仅做对照） |
| **R3 op 80/92 eval 内容超出沙盒能力** | 生成的 JS 用了 Reflect/Proxy/Symbol 之类 | 退化到 P2-B 方案 B-1，扩大 mini-racer 暴露面 |
| **R4 浏览器环境桩值漂移** | rs6 检测 `Math.random` 返回值熵 / `performance.now` 漂移 | 用真实浏览器跑一遍记录 Math.random 序列，回放 |
| **R5 整体工作量超预算** | 80h 没跑通 | **退路 P1**（py-mini-racer + 完整裁剪 vmp，约 20-40h） |

## 7. 待用户确认

1. **走 P2-B（推荐）还是 P2-A？**
2. **op 80/92 处理：mini-racer 嵌入式 JS 引擎可接受吗？**（不接受则路线退化为 P3 AST 抠核心逻辑，工作量 +30h 且不保证成功）
3. **接受 5 阶段交付节奏？** 每个 Tx 完成都做实证验收，发现不可行就立刻退回 P1
4. **是否允许装 `py-mini-racer` / `quickjs`**（pip 包，仅作沙盒用）

---

## 附：Phase 1/2 已产出实物

- [tests/probe_412.py](tests/probe_412.py) — 抓 412 + Set-Cookie 工具
- [tests/fetch_vmp.py](tests/fetch_vmp.py) — 下载 vmp
- [tests/check_polymorphism.py](tests/check_polymorphism.py) — 多态性检测
- [tests/inspect_vmp.py](tests/inspect_vmp.py) — vmp 顶层结构扫描
- [tests/extract_dispatcher.py](tests/extract_dispatcher.py) — dispatcher 切片
- [tests/dump_d1_opcodes.py](tests/dump_d1_opcodes.py) — D1 全 opcode 提取
- [assets/phase1_summary.json](assets/phase1_summary.json) — 412 响应摘要
- [assets/phase2_d1_opcodes.json](assets/phase2_d1_opcodes.json) — **D1 72 个 opcode 完整源码**
- [assets/phase2_dispatcher.json](assets/phase2_dispatcher.json) — 5 dispatcher 索引
- [assets/js/oQ91zEKu9zN4.44d6eb6.js](assets/js/oQ91zEKu9zN4.44d6eb6.js) — view 页 vmp
- [assets/js/BSrw3csEQORp.44d6eb6.js](assets/js/BSrw3csEQORp.44d6eb6.js) — biznew vmp
