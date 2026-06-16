# Web/JS 逆向工作流 Skills Bundle

> 面向跨 IDE、跨模型、跨代理环境的通用迁移包。

这不是当前项目专属目录，而是一套可以**整体复制**到其他项目、其他 IDE、其他模型环境里的 Web/JS 逆向工作流 bundle。

如果目标环境支持“本地 skills / agents / prompts”机制，可以直接复制本目录使用；如果不支持，也可以把各个 `SKILL.md` 当作系统提示词、项目规则或任务前置说明直接喂给模型。

## 包含内容

当前共有 6 个文件夹/技能：

- `web-reverse-workflow`
- `web-reverse-brainstorming`
- `web-reverse-writing-plans`
- `web-reverse-executing-plans`
- `web-reverse-test-driven-development`
- `web-reverse-systematic-debugging`

对应文件：

- `web-reverse-workflow/SKILL.md`
- `web-reverse-brainstorming/SKILL.md`
- `web-reverse-writing-plans/SKILL.md`
- `web-reverse-executing-plans/SKILL.md`
- `web-reverse-test-driven-development/SKILL.md`
- `web-reverse-systematic-debugging/SKILL.md`

## 这套 Skills 是干什么的

它们解决的不是“逆向技巧不够多”，而是“逆向工作容易乱、证据链容易断、实现容易跑偏”。

核心目标：

- 先定路线，再开工
- 先拆步骤，再执行
- 先写样本校验，再写复现实现
- 结果不一致时先找根因，不随机试错

适用任务：

- Web/JS 参数签名还原
- 请求体加密 / 响应解密
- Hook `fetch` / `XHR` / `CryptoJS` / `SubtleCrypto`
- AST 反混淆后的链路梳理
- 补环境与浏览器指纹问题
- WASM / WebSocket / Protobuf 相关逆向

## 推荐工作流

默认入口始终是：

`web-reverse-workflow`

它会在这 5 个具体 skill 之间做阶段路由：

```text
web-reverse-workflow
  -> web-reverse-brainstorming
  -> web-reverse-writing-plans
  -> web-reverse-executing-plans
  -> web-reverse-test-driven-development
  -> web-reverse-systematic-debugging（按需插入）
```

### 各 skill 的角色

#### 1. `web-reverse-workflow`

统一入口。  
先判断当前任务处于哪个阶段，再决定调用哪个 skill。

#### 2. `web-reverse-brainstorming`

逆向路线设计。  
用于先列路线、比方案、评估风险，防止一上来就乱试。

#### 3. `web-reverse-writing-plans`

逆向实施计划。  
把目标拆成一串可执行、可验证、带证据产物的动作。

#### 4. `web-reverse-executing-plans`

逆向按计划执行。  
强调一步一验证，不允许边做边漂移。

#### 5. `web-reverse-test-driven-development`

样本驱动复现。  
把传统 TDD 改造成“先写样本校验，再写最小复现实现”。

#### 6. `web-reverse-systematic-debugging`

逆向证据链排错。  
按 `Observe -> Hypothesize -> Test -> Fix` 处理不一致问题。

## 在其他 IDE / 模型里怎么用

### 方式 A：目标环境支持本地 skill / agent / prompt 目录

直接把整个 `reverse-workflow/` 目录复制过去，保留目录名与 `SKILL.md` 文件名不变。

最小迁移单元：

```text
reverse-workflow/
  README.md
  web-reverse-workflow/
    SKILL.md
  web-reverse-brainstorming/
    SKILL.md
  web-reverse-writing-plans/
    SKILL.md
  web-reverse-executing-plans/
    SKILL.md
  web-reverse-test-driven-development/
    SKILL.md
  web-reverse-systematic-debugging/
    SKILL.md
```

建议：

- 不改 `name:` 字段
- 不改目录名
- 不拆分 `SKILL.md`
- 如果平台支持标签/元数据，可把“Web/JS 逆向、签名、补环境、调试”作为关键词补进去

### 方式 B：目标环境不支持原生 skill，但支持项目规则/系统提示

把它们当作“项目级提示词文档”来用。

推荐做法：

1. 把这 6 个目录复制到项目里，例如：

```text
.skills/
  reverse-workflow/
    README.md
    web-reverse-workflow/
    web-reverse-brainstorming/
    web-reverse-writing-plans/
    web-reverse-executing-plans/
    web-reverse-test-driven-development/
    web-reverse-systematic-debugging/
```

2. 在项目总规则或系统提示中加入一句：

```text
收到 Web/JS 逆向任务时，先阅读并遵循 `web-reverse-workflow/SKILL.md`，再按其中路由使用其他 5 个 skill。
```

3. 每次具体任务时，只把当前阶段对应的 `SKILL.md` 再喂给模型，不要 6 个一起塞。

### 方式 C：目标环境什么都不支持，只能手动对话

用“入口 skill + 当前阶段 skill”两段式手动驱动。

#### 手动触发模板

先发：

```text
你现在按 `web-reverse-workflow` 这套 Web/JS 逆向工作流工作。
先判断当前任务处于哪个阶段，再只使用一个对应 skill。
禁止跳过阶段判断直接开始实现。
```

再贴任务。

模型判断完阶段后，再追加当前阶段 skill 内容，或者直接用一句指令切换：

```text
当前阶段进入 `web-reverse-brainstorming`，请只做路线设计，不进入实现。
```

## 推荐复制位置

如果你想在别的环境里复用，建议优先采用下面两种结构之一。

### 结构 1：作为独立 bundle 引入

```text
skills/
  reverse-workflow/
    README.md
    web-reverse-workflow/
    web-reverse-brainstorming/
    web-reverse-writing-plans/
    web-reverse-executing-plans/
    web-reverse-test-driven-development/
    web-reverse-systematic-debugging/
```

### 结构 2：合并进目标平台的 skills 根目录

```text
skills/
  web-reverse-workflow/
    SKILL.md
  web-reverse-brainstorming/
    SKILL.md
  web-reverse-writing-plans/
    SKILL.md
  web-reverse-executing-plans/
    SKILL.md
  web-reverse-test-driven-development/
    SKILL.md
  web-reverse-systematic-debugging/
    SKILL.md
```

## 最佳实践

### 1. 始终从入口 skill 开始

不要直接跳到某个 skill，除非你百分之百确定当前阶段。

### 2. 一次只加载一个阶段 skill

不要把 6 个 skill 一起塞给模型。  
正确方式是：

- 先 `web-reverse-workflow`
- 再按判断结果只进入一个 skill

### 3. 把 Skill 当“流程约束”，不是“知识百科”

这些 skill 不是为了讲很多理论，而是为了约束模型：

- 什么时候停
- 什么时候验证
- 什么时候回退
- 什么时候切换阶段

### 4. 样本、证据、结论分开存

即使换 IDE 或模型，也建议保留这种目录习惯：

```text
captures/
hooks/
notes/
repro/
tests/
docs/reverse/
```

这样不同环境切换时，证据链不会断。

## 常见使用姿势

### 场景 1：刚拿到一个站点，不知道怎么开始

用：

```text
请先按 `web-reverse-workflow` 判断当前阶段，并进入 `web-reverse-brainstorming`。
任务：帮我分析这个站点的 sign 参数，还原可离线生成的逻辑。
```

### 场景 2：已经拿到 HAR，想拆步骤

用：

```text
请按 `web-reverse-workflow` 判断阶段。
我已经有 HAR 和两组样本，请进入 `web-reverse-writing-plans`，把任务拆成可执行、可验证的小步骤。
```

### 场景 3：已经开始写复现器

用：

```text
请进入 `web-reverse-test-driven-development`。
我准备根据 3 组真实样本复现 sign，请先定义 parity 校验，再写最小实现。
```

### 场景 4：结果总是差一点

用：

```text
请进入 `web-reverse-systematic-debugging`。
现象：浏览器 sign 与本地 sign 只有部分字符不同。请按证据链方式排查，不要随机试错。
```

## 不同模型的使用建议

### 推理强、上下文长的模型

适合：

- `web-reverse-brainstorming`
- `web-reverse-writing-plans`
- `web-reverse-systematic-debugging`

### 执行快、成本低的模型

适合：

- `web-reverse-executing-plans`
- `web-reverse-test-driven-development`

### 混合用法

推荐：

- 用强模型做路线设计、计划和排错
- 用快模型做执行和样本驱动复现

## 注意事项

- 这套 workflow 偏 `Web/JS 逆向`
- 如果任务转向 `Android Native / JNI / SO / 脱壳`，应另配移动端 skill
- 如果目标环境有自己的系统规则，优先保证它们不与本 workflow 冲突
- 如果只能保留一个 skill，优先保留 `web-reverse-workflow`

## 最小可复制说明

如果你只想给别人一句话，让他在别的环境里直接开始：

```text
请把这套 Web/JS 逆向 skill 当作阶段化工作流使用：
先读 `web-reverse-workflow/SKILL.md` 判断当前阶段，
再只进入一个具体 skill：
`web-reverse-brainstorming` / `web-reverse-writing-plans` /
`web-reverse-executing-plans` / `web-reverse-test-driven-development` /
`web-reverse-systematic-debugging`。
禁止跳过路线设计、禁止没有样本就写复现器、禁止随机试错。
```
