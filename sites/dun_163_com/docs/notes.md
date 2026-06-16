# 调试笔记

> 更新日期：2026-05-22

## 当前阶段

项目已完成 Phase 4。核心协议链路已真实跑通到 `check` 成功，并返回 `validate`。

## 本轮关键证据

1. `js-reverse-mcp` 当前可接管 Chrome，页面为 `https://dun.163.com/trial/jigsaw`。
2. 页面内隐藏初始化实例可访问 store 与 slider 组件方法。
3. `FETCH_CAPTCHA` action 证明 get 请求 `cb` 来自内部 `_0x62692()`。
4. `VERIFY_CAPTCHA` action 证明 check 请求 `cb` 同样来自 `_0x62692()`，`data` 由滑块组件提交前构造。
5. `onMouseUp` 动态源码确认 `d/p/f/ext` 的生成公式。

## 本轮本地验证

```powershell
node --check sites\dun_163_com\src\signer.js
node --check sites\dun_163_com\src\env\browser.js
E:\PythonCodeObject1\Qoder_ObjectProdemo2\venv\Scripts\python.exe -m py_compile sites\dun_163_com\src\main.py
```

补充验证：

- `signer.js fp` 可生成 92 位 `cb`。
- `signer.js check` 可生成 `d/p/f/ext`。
- Python `_generate_cb()` 与 `_generate_check_data()` 可正常调用 Node signer。
- `ddddocr.slide_match` 可返回 `target_x`，但存在候选漂移。
- OpenCV alpha mask 模板匹配可稳定得到滑块 `style.left` 像素值，已作为默认本地识别方案。

## 真实接口验证

已验证链路：

```text
getconf -> IR upload -> get -> check
```

结论：

- getconf 返回 `dt` 和 `zoneId`。
- IR upload 返回 `irToken`。
- get 返回滑块图片和 `token`。
- check 使用早期固定测试距离时返回失败，但响应结构正常且包含下一轮 token。
- 改用 OpenCV masked match 距离后，真实接口已返回 `result=true`。

最终成功样本：

```text
[recognize] opencv_masked distance=188 confidence=0.942086398601532
[check] SUCCESS! validate=8gxMgwjCs36ABQyKiWXApPYj4qmeePZtNacdk+33...
```

## 下一步

1. 若 SDK 升级，更新 `src/env/sdk/` 内的 `load/core/ir` 文件。
2. 若 OpenCV 匹配置信度低于 `0.8`，刷新验证码后重试。
3. 当前临时 `assets/` 与测试脚本已清理，仅保留核心产物。
