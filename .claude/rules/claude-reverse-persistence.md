---
description: Claude Code 逆向留痕与节流规范（省 token、阶段快照、恢复入口、命名与落盘约定）
alwaysApply: false
---

# Claude Code 逆向留痕与节流规范

> 本文件是 `claude-reverse.md` 的配套留痕规范。
> 当需要控制 token 消耗、管理上下文、恢复现场或初始化文档模板时再读取。
> 若与主规则冲突，始终以 `claude-reverse.md` 为准。

## 1. 目标

默认追求：

- 短输出
- 短读取
- 短命令
- 长证据落盘
- 会话可恢复

## 2. 省 token 原则

- **短输出优先**：对话里只保留结论、证据路径、差异点、下一步
- **短读取优先**：优先按目标段落、关键字、行段读取，避免反复整文件读取
- **短命令优先**：长命令、复杂转义、多步管道先写成 `.py` / `.js`
- **避免重复回显**：已确认的接口、参数、样本结论，后续只引用文件路径和结论
- **结果文件优先**：长日志、大输出、对照结果优先写入文件，再在对话里做摘要

## 3. 固定文档职责

| 文件 | 唯一职责 |
|------|----------|
| `plan.md` | 方案、准入门槛、待验证项 |
| `docs/api.md` | 接口、真实样本、响应、Cookie 传递链 |
| `docs/crypto.md` | 函数定位、Hook 命中、输入输出对照 |
| `docs/notes.md` | 阶段快照、失败尝试、差异、下一步 |

规则：

- 能落到上述文件的内容，就不要堆在对话里
- 能复用旧文件，就不要重复生成同类新文件

## 4. 新站点初始化

建议目录：

```text
sites/
├── _templates/
│   ├── notes.md
│   └── phase_snapshot.md
└── {domain}/
    ├── README.md
    ├── plan.md
    ├── src/
    └── docs/
        ├── api.md
        ├── crypto.md
        └── notes.md
```

初始化要求：

- 开工前至少创建 `README.md`、`plan.md`、`docs/api.md`、`docs/crypto.md`、`docs/notes.md`
- 若存在 `sites/_templates/notes.md` 与 `sites/_templates/phase_snapshot.md`，优先按模板初始化
- 不要把关键上下文只留在聊天里

## 5. 阶段快照规范

每完成一个关键节点，必须在 `sites/{domain}/docs/notes.md` 追加一条简短快照。

建议固定包含：

1. 时间
2. 当前调试路线
3. 当前页面 / 接口 / 样本锚点
4. 已确认结论
5. 未解决差异
6. 下一步动作

要求：

- 单条快照尽量控制在 6-12 行
- 只写可恢复现场的事实，不写冗长思维过程
- 对话被压缩后，应能仅靠 `docs/notes.md` 恢复工作上下文

推荐模板：

```markdown
## Snapshot
- Time: `<时间>`
- Route: `<A/B/C>`
- Scope: `<页面/接口/样本锚点>`
- Confirmed: `<已确认结论>`
- Gap: `<未解决差异>`
- Next: `<下一步动作>`
```

## 6. 恢复现场入口

上下文压缩、会话中断或切换窗口后，默认按以下顺序恢复：

1. `sites/{domain}/plan.md`
2. `sites/{domain}/docs/notes.md`
3. `sites/{domain}/docs/api.md`
4. `sites/{domain}/docs/crypto.md`

恢复要求：

- 先读最新阶段快照，再决定是否补读 `api.md` / `crypto.md`
- 若文件已能恢复上下文，不要重复要求用户重述整个背景
- 恢复后在对话里只汇报：当前阶段、已确认结论、未解决问题、下一步

## 7. 命名与落盘约定

固定命名建议：

- 样本摘录：`sample_request_01.md`、`sample_response_01.md`
- 对照结果：`compare_sign_01.md`、`compare_e2e_01.md`
- 临时校验脚本：`check_<topic>.py`、`check_<topic>.js`

落盘优先级：

1. `plan.md`
2. `docs/api.md`
3. `docs/crypto.md`
4. `docs/notes.md`
5. 必要时再新增独立结果文件

## 8. 任务完成后的清理

保留核心文件：

- `README.md`
- `plan.md`
- `src/`
- `docs/api.md`
- `docs/crypto.md`
- `docs/notes.md`

删除临时资源：

- `assets/js/`
- `assets/har/`
- `assets/screenshots/`
- `tests/`
- 临时日志
- 中间产物

示例：

```bash
rm -rf sites/{domain}/assets sites/{domain}/tests
```
