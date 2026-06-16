"""CloakBrowser + browser-use AI Agent 演示脚本.

演示:
1. 直接模式 - 最简单的使用方式，持久化 profile
2. CDP 模式 - 通过 CDP 连接 stealth 浏览器
3. 上下文管理器模式 - 自动管理浏览器生命周期
4. Stealth 检测验证 - 验证浏览器反检测能力

使用前请设置:
    set OPENAI_API_KEY=your-key-here
    # 或使用其他 LLM provider（修改 ChatOpenAI 调用）

运行:
    python sites/cloak_config/agent_demo.py
    python sites/cloak_config/agent_demo.py --headed  # 有头模式
    python sites/cloak_config/agent_demo.py --stealth-test  # 仅运行 stealth 检测
"""

import sys
from pathlib import Path

# 确保项目根目录在 sys.path 中
_project_root = Path(__file__).resolve().parent.parent.parent
if str(_project_root) not in sys.path:
    sys.path.insert(0, str(_project_root))

import asyncio
import os
import logging

# 启用日志查看详细过程
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(name)s] %(levelname)s: %(message)s",
    datefmt="%H:%M:%S",
)

from cloakbrowser import launch_async, launch
from cloakbrowser.config import get_default_stealth_args

from sites.cloak_config import CloakAgent, CloakConfig, PROFILES_DIR

HEADED = "--headed" in sys.argv
STEALTH_ONLY = "--stealth-test" in sys.argv


# ======================================================================
# Demo 1: Stealth 检测验证（不需要 LLM）
# ======================================================================

async def demo_stealth_test():
    """验证 CloakBrowser 的 stealth 检测通过率."""
    import time

    print("\n" + "=" * 60)
    print("Stealth 检测验证")
    print("=" * 60)

    browser = await launch_async(headless=not HEADED)
    page = await browser.new_page()

    tests = [
        {
            "name": "navigator.webdriver",
            "url": "https://bot.sannysoft.com",
            "check": "navigator.webdriver === false",
        },
        {
            "name": "navigator.plugins",
            "url": "https://bot.sannysoft.com",
            "check": "navigator.plugins.length > 0",
        },
        {
            "name": "window.chrome",
            "url": "https://bot.sannysoft.com",
            "check": "typeof window.chrome === 'object'",
        },
        {
            "name": "BrowserScan",
            "url": "https://www.browserscan.net/bot-detection",
            "check": "document.body.innerText.includes('Normal')",
        },
    ]

    passed = 0
    for i, test in enumerate(tests):
        try:
            await page.goto(test["url"], wait_until="domcontentloaded", timeout=20000)
            time.sleep(3)
            result = await page.evaluate(test["check"])
            status = "PASS" if result else "FAIL"
            if result:
                passed += 1
            print(f"  [{status}] {test['name']}: {result}")
        except Exception as e:
            print(f"  [ERROR] {test['name']}: {e}")

    # 额外：获取指纹详情
    try:
        info = await page.evaluate("""() => {
            const gl = document.createElement('canvas').getContext('webgl');
            const dbg = gl ? gl.getExtension('WEBGL_debug_renderer_info') : null;
            return {
                ua: navigator.userAgent.substring(0, 100),
                webdriver: navigator.webdriver,
                plugins: navigator.plugins.length,
                cores: navigator.hardwareConcurrency,
                platform: navigator.platform,
                gpu: dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : 'N/A',
            };
        }""")
        print(f"\n  指纹信息:")
        print(f"    UA:        {info['ua']}...")
        print(f"    webdriver: {info['webdriver']}")
        print(f"    plugins:   {info['plugins']}")
        print(f"    cores:     {info['cores']}")
        print(f"    GPU:       {info['gpu']}")
    except Exception:
        pass

    await browser.close()
    print(f"\n  {passed}/{len(tests)} 检测通过")
    return passed


# ======================================================================
# Demo 2: 直接模式 - AI Agent 执行简单任务
# ======================================================================

async def demo_direct_mode():
    """直接模式: browser-use 直接使用 CloakBrowser binary + 参数."""
    import os

    if not os.environ.get("OPENAI_API_KEY"):
        print("\n[跳过] 直接模式演示需要 OPENAI_API_KEY")
        return

    print("\n" + "=" * 60)
    print("直接模式 - AI Agent 任务演示")
    print("=" * 60)

    agent = CloakAgent(
        mode="direct",
        profile_name="demo_session",
        headless=not HEADED,
    )

    try:
        result = await agent.run(
            task="打开 https://httpbin.org/ip，获取页面显示的IP地址并返回",
        )
        print(f"\n  任务结果: {result}")
    finally:
        await agent.close()


# ======================================================================
# Demo 3: CDP 模式
# ======================================================================

async def demo_cdp_mode():
    """CDP 模式: CloakBrowser 先启动，browser-use 通过 CDP 连接."""
    import os

    if not os.environ.get("OPENAI_API_KEY"):
        print("\n[跳过] CDP 模式演示需要 OPENAI_API_KEY")
        return

    print("\n" + "=" * 60)
    print("CDP 模式 - AI Agent 任务演示")
    print("=" * 60)

    agent = CloakAgent(
        mode="cdp",
        profile_name="demo_cdp_session",
        headless=not HEADED,
        cdp_port=9243,
    )

    try:
        result = await agent.run(
            task="访问 https://example.com，返回页面标题",
        )
        print(f"\n  任务结果: {result}")
    finally:
        await agent.close()


# ======================================================================
# Demo 4: 使用上下文管理器
# ======================================================================

async def demo_context_manager():
    """使用 async with 自动管理生命周期."""
    import os

    if not os.environ.get("OPENAI_API_KEY"):
        print("\n[跳过] 上下文管理器演示需要 OPENAI_API_KEY")
        return

    print("\n" + "=" * 60)
    print("上下文管理器模式")
    print("=" * 60)

    async with CloakAgent(
        mode="direct",
        profile_name="demo_ctx_session",
        headless=not HEADED,
    ) as agent:
        result = await agent.run(
            task="访问 https://httpbin.org/user-agent，获取返回的User-Agent信息",
        )
        print(f"\n  任务结果: {result}")

    print("\n  浏览器已自动关闭")


# ======================================================================
# Demo 5: 配置信息展示
# ======================================================================

def demo_config_info():
    """展示当前配置信息."""
    print("\n" + "=" * 60)
    print("配置信息")
    print("=" * 60)

    binary = ensure_binary_cached()
    stealth_args = get_default_stealth_args()

    print(f"  Profile 目录:   {PROFILES_DIR}")
    print(f"  Stealth binary: {binary}")
    print(f"  Stealth args:   {stealth_args}")
    print(f"  Headed 模式:    {HEADED}")


def ensure_binary_cached():
    """获取 binary 路径（不触发下载）."""
    from cloakbrowser.config import get_binary_path, get_effective_version
    path = get_binary_path(get_effective_version())
    if path.exists():
        return str(path)
    return "(需要首次下载)"


# ======================================================================
# 主入口
# ======================================================================

async def main():
    print("=" * 60)
    print("  CloakBrowser + browser-use AI Agent 演示")
    print("=" * 60)
    print(f"  Mode: {'headed' if HEADED else 'headless'}")
    print(f"  API Key: {'已设置' if os.environ.get('OPENAI_API_KEY') else '未设置（仅运行 stealth 检测）'}")
    print()

    demo_config_info()

    # Stealth 检测（不需要 API key）
    await demo_stealth_test()

    if STEALTH_ONLY:
        print("\n[--stealth-test] 仅运行 stealth 检测，跳过 AI Agent 演示")
        return

    # AI Agent 演示（需要 API key）
    await demo_direct_mode()
    await demo_cdp_mode()
    await demo_context_manager()

    print("\n" + "=" * 60)
    print("  演示完成！")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())
