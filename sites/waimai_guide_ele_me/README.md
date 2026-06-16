# waimai-guide.ele.me

目标接口：

```text
https://waimai-guide.ele.me/h5/mtop.relationrecommend.elemetinyapprecommend.recommend/1.0/5.0/
```

当前产出是本地诊断方案：

- `src/main.py`：解析 HAR 或 Hook JSON，提取目标请求，验证 mtop `sign` 构成。
- `src/cookie_pipeline.py`：Cookie 驱动的本地离线主入口，自动完成解析、`sign` 计算、时效检查和脱敏报告。
- `src/signer.js`：Node.js signer 插槽，默认只实现 mtop MD5 sign 诊断；`bx_et`、`x-ele-check`、`bx-umidtoken` 需要授权 provider 注入。
- `docs/api.md`：接口参数说明。
- `docs/dynamic-params.md`：动态参数、假值、过期样本校验和替换规则说明。
- `docs/cookie-pipeline.md`：Cookie 主入口使用说明。
- `docs/crypto.md`：动态参数构成与证据。
- `docs/js-analysis.md`：页面 JS 定位和本地下载清单。
- `docs/deobf-report.md`：反混淆测试结果与 AST skill 问题记录。
- `docs/notes.md`：调试记录摘要。

本地自检：

```powershell
.\venv\Scripts\python.exe .\sites\waimai_guide_ele_me\src\main.py --self-test
node .\sites\waimai_guide_ele_me\src\signer.js --self-test
.\venv\Scripts\python.exe .\sites\waimai_guide_ele_me\src\cookie_pipeline.py --help
```

解析样本：

```powershell
.\venv\Scripts\python.exe .\sites\waimai_guide_ele_me\src\main.py --har .\sample.har
.\venv\Scripts\python.exe .\sites\waimai_guide_ele_me\src\main.py --sample-json .\hook_logs.json
.\venv\Scripts\python.exe .\sites\waimai_guide_ele_me\src\main.py --requests-py .\request_sample.py
.\venv\Scripts\python.exe .\sites\waimai_guide_ele_me\src\cookie_pipeline.py --cookie-file .\runtime\eleme_cookie.txt
```

如果样本中没有 Cookie header，可以额外传入 `_m_h5_tk` 所在 Cookie 或 token 前缀：

```powershell
.\venv\Scripts\python.exe .\sites\waimai_guide_ele_me\src\main.py --har .\sample.har --cookie "_m_h5_tk=TOKEN_EXPIRE; _m_h5_tk_enc=..."
.\venv\Scripts\python.exe .\sites\waimai_guide_ele_me\src\main.py --har .\sample.har --token TOKEN
```

`--requests-py` 只通过 Python AST 读取字面量，不会执行样本代码，也不会发送请求。
