# Web/JS 逆向工作流 Skills Bundle

> 面向跨 IDE、跨模型、跨代理环境的通用迁移包；**在本仓库中**已按 Trae 建议将 6 个技能**扁平**放在 `.trae/skills/<skill-name>/` 下，便于 IDE 收录。

## 本仓库中的实际布局

```text
.trae/skills/
  README-web-reverse-bundle.md    # 本说明
  web-reverse-workflow/
  web-reverse-brainstorming/
  web-reverse-writing-plans/
  web-reverse-executing-plans/
  web-reverse-test-driven-development/
  web-reverse-systematic-debugging/
```

若复制到其他项目或 IDE，亦可继续使用下列「bundle 子目录」结构（整文件夹拷贝）：

```text
reverse-workflow/
  README.md
  web-reverse-workflow/
  web-reverse-brainstorming/
  ...
```

## 包含内容

当前共有 6 个技能目录：

- `web-reverse-workflow`
- `web-reverse-brainstorming`
- `web-reverse-writing-plans`
- `web-reverse-executing-plans`
- `web-reverse-test-driven-development`
- `web-reverse-systematic-debugging`

对应文件均为各目录下的 `SKILL.md`。

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

默认入口始终是：`web-reverse-workflow`

```text
web-reverse-workflow
  -> web-reverse-brainstorming
  -> web-reverse-writing-plans
  -> web-reverse-executing-plans
  -> web-reverse-test-driven-development
  -> web-reverse-systematic-debugging（按需插入）
```

### 各 skill 的角色

| Skill | 角色 |
|--------|------|
| `web-reverse-workflow` | 统一入口，判断阶段并路由 |
| `web-reverse-brainstorming` | 路线设计，比方案、评风险 |
| `web-reverse-writing-plans` | 实施计划，拆成可验证步骤 |
| `web-reverse-executing-plans` | 按计划执行，一步一验收 |
| `web-reverse-test-driven-development` | 样本驱动复现 |
| `web-reverse-systematic-debugging` | 证据链排错 |

## 在其他 IDE / 模型里怎么用

### 方式 A：支持 `.trae/skills/` 扁平目录（推荐，与本仓库一致）

将 6 个目录放到目标项目的 `.trae/skills/` 下，与 `SKILL.md` 同级结构保持不变。

### 方式 B：bundle 目录迁移

把整个 `reverse-workflow/`（含嵌套的 6 个子目录）复制到目标环境，保留目录名与 `SKILL.md` 不变。

### 方式 C：仅支持规则 / 系统提示

在项目规则中加入：收到 Web/JS 逆向任务时，先遵循 `web-reverse-workflow` 的 `SKILL.md`，再按路由加载对应阶段的单个 skill。

## 最佳实践

1. 始终从 `web-reverse-workflow` 开始判断阶段。
2. 一次只强调一个阶段 skill，避免 6 个同时塞进上下文。
3. 把 Skill 当流程约束：何时停、何时验证、何时回退。
4. 样本、证据、结论分开存放（如 `captures/`、`notes/`、`repro/`）。

## 注意事项

- 偏 Web/JS 逆向；Native/Android 等需另配 skill。
- 若与环境系统规则冲突，以合规与安全侧规则为准。
- 若只能保留一个 skill，优先保留 `web-reverse-workflow`。

## 一句话版（给他人复用）

```text
请把这套 Web/JS 逆向 skill 当作阶段化工作流使用：
先读 `web-reverse-workflow/SKILL.md` 判断当前阶段，
再只进入一个具体 skill：
`web-reverse-brainstorming` / `web-reverse-writing-plans` /
`web-reverse-executing-plans` / `web-reverse-test-driven-development` /
`web-reverse-systematic-debugging`。
禁止跳过路线设计、禁止没有样本就写复现器、禁止随机试错。
```
