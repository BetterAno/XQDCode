/**
 * Baxia 验证码图片解密 - Node.js 桥接脚本
 *
 * Baxia 图片 content 格式:
 *   Base64 解码后为 WASM 加密二进制 (前缀 00000003 cafeb08f)
 *   解密函数: SecCaptcha.updateImg (WASM 导出的 document.__update_img)
 *
 * 使用方式:
 *   echo '{"encryptToken":"xxx","images":[{"content":"base64...","imageId":"xxx","index":0}]}' | node decrypt_images.js
 *
 * 输出:
 *   {"success":true,"images":["base64_png_0","base64_png_1",...]}
 */

const { execSync } = require("child_process");

// Baxia 图片解密核心
// 由于解密逻辑在 WASM 中 (program.wasm), 纯 Node.js 无法直接调用
// 这里提供两种方案:

// 方案 A: 使用 puppeteer/chromium 加载 Baxia SDK 解密 (需要浏览器环境)
// 方案 B: 直接加载 WASM 模块导出 __update_img 函数 (需要逆向 WASM 接口)

async function decryptImages(encryptToken, images) {
  // 当前实现: 占位 - 需要 WASM 逆向完成
  //
  // Baxia WASM 解密流程:
  // 1. 加载 program.wasm
  // 2. 调用初始化函数 (传入 encryptToken)
  // 3. 对每张图片 content 调用 __update_img(index, canvas, {token, data})
  // 4. 从 Canvas 导出 PNG
  //
  // 替代方案: 使用 CDP 桥接 (参见 cdp_bridge.py)

  console.error("WARN: Baxia WASM 解密尚未实现");
  console.error("请使用 CDP 桥接方案 (cdp_bridge.py) 通过浏览器端解密");

  // 返回空结果表示解密失败
  return { success: false, error: "WASM decrypt not implemented", images: [] };
}

// 主入口
async function main() {
  const input = await new Promise((resolve) => {
    let data = "";
    process.stdin.on("data", (chunk) => (data += chunk));
    process.stdin.on("end", () => resolve(data));
  });

  let parsed;
  try {
    parsed = JSON.parse(input);
  } catch (e) {
    console.log(JSON.stringify({ success: false, error: "Invalid JSON input" }));
    process.exit(1);
  }

  const result = await decryptImages(parsed.encryptToken, parsed.images);
  console.log(JSON.stringify(result));
}

main().catch((e) => {
  console.log(JSON.stringify({ success: false, error: e.message }));
});
