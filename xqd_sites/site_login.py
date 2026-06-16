"""
统一站点登录脚本
================
使用共享 Chrome Profile 打开指定站点的登录页，手动登录后关闭浏览器即可，
下次使用 --auto 采集时自动携带登录态。

用法:
  python site_login.py bilibili           # 打开B站登录页
  python site_login.py douyin             # 打开抖音首页
  python site_login.py taobao             # 打开淘宝登录页
  python site_login.py xianyu             # 打开闲鱼首页
  python site_login.py --all              # 依次打开所有站点（一个登完关闭后开下一个）

支持的站点后缀:
  bilibili  / bili / bz     → B站 (passport.bilibili.com)
  douyin    / dy            → 抖音 (douyin.com)
  taobao    / tb            → 淘宝 (login.taobao.com)
  xianyu    / xy / goofish  → 闲鱼 (goofish.com)

浏览器:
  标准 Chrome + ChromeDebug 独立缓存目录（所有采集脚本共享同一 Profile）
"""

import os
import sys
import time
import traceback

# ╔══════════════════════════════════════════════════════════════════╗
# ║                       0. 配置                                    ║
# ╚══════════════════════════════════════════════════════════════════╝

CHROME_EXE = r"C:\Users\Administrator\AppData\Local\Google\Chrome\Application\chrome.exe"
CHROME_PROFILE = r"C:\Users\Administrator\Desktop\XQDCode\ChromeDebug"

# 站点配置: { 后缀: (显示名称, 登录页URL, 是否需要额外说明) }
SITES = {
    "bilibili":   ("B站",    "https://passport.bilibili.com/login",      "扫码或账号登录即可"),
    "bili":       ("B站",    "https://passport.bilibili.com/login",      "扫码或账号登录即可"),
    "bz":         ("B站",    "https://passport.bilibili.com/login",      "扫码或账号登录即可"),
    "douyin":     ("抖音",   "https://www.douyin.com/",                  "打开后点击右上角「登录」"),
    "dy":         ("抖音",   "https://www.douyin.com/",                  "打开后点击右上角「登录」"),
    "taobao":     ("淘宝",   "https://login.taobao.com/member/login.jhtml", "扫码或账号登录即可"),
    "tb":         ("淘宝",   "https://login.taobao.com/member/login.jhtml", "扫码或账号登录即可"),
    "xianyu":     ("闲鱼",   "https://www.goofish.com/",                 "打开后点击右上角「登录」"),
    "xy":         ("闲鱼",   "https://www.goofish.com/",                 "打开后点击右上角「登录」"),
    "goofish":    ("闲鱼",   "https://www.goofish.com/",                 "打开后点击右上角「登录」"),
}

VALID_SITES = "\n".join(
    f"    {k:<12} → {v[0]}  {v[1]}"
    for k, v in SITES.items()
    if len(k) >= 4 or k in ("bz", "dy", "tb", "xy")
)


# ╔══════════════════════════════════════════════════════════════════╗
# ║                       1. 工具函数                                ║
# ╚══════════════════════════════════════════════════════════════════╝

def log(msg: str, emoji: str = "  "):
    print(f"{emoji} {msg}", flush=True)


def find_chrome():
    if os.path.exists(CHROME_EXE):
        return CHROME_EXE
    alt = r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
    if os.path.exists(alt):
        return alt
    alt2 = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
    if os.path.exists(alt2):
        return alt2
    return None


# ╔══════════════════════════════════════════════════════════════════╗
# ║                       2. 核心逻辑                                ║
# ╚══════════════════════════════════════════════════════════════════╝

def login_site(site_key: str) -> bool:
    """为指定站点打开浏览器并导航到登录页。返回是否成功。"""
    if site_key not in SITES:
        log(f"未知站点: {site_key}", "❌")
        print(f"\n  支持的站点后缀:\n{VALID_SITES}")
        return False

    name, url, tip = SITES[site_key]

    try:
        from playwright.sync_api import sync_playwright
    except ImportError:
        log("缺少 playwright，请执行: pip install playwright", "❌")
        sys.exit(1)

    exe_path = find_chrome()
    if not exe_path:
        log(f"Chrome 未找到", "❌")
        return False

    log(f"站点: {name}", "📌")
    log(f"浏览器: {exe_path}", "✅")
    log(f"Profile: {CHROME_PROFILE}", "✅")
    log(f"登录页: {url}", "🔗")
    log(f"提示: {tip}", "💡")
    print()
    log("正在启动浏览器...", "🚀")

    with sync_playwright() as p:
        try:
            context = p.chromium.launch_persistent_context(
                user_data_dir=CHROME_PROFILE,
                executable_path=exe_path,
                headless=False,
                viewport={"width": 1280, "height": 900},
                args=["--disable-blink-features=AutomationControlled"],
            )
        except Exception:
            log("浏览器启动失败！请关闭所有 Chrome 窗口后重试", "❌")
            log(f"原始错误: {traceback.format_exc().splitlines()[-1]}")
            return False

        page = context.pages[0] if context.pages else context.new_page()

        # 导航到登录页
        page.goto(url, timeout=30000, wait_until="domcontentloaded")
        log("浏览器已就绪，请完成登录操作", "✅")
        print()
        print("  ╔══════════════════════════════════════════════╗")
        print(f"  ║  请在浏览器中完成 {name} 登录                  ║")
        print(f"  ║  登录成功后，回到此处按 Enter 关闭浏览器       ║")
        print("  ╚══════════════════════════════════════════════╝")
        print()
        input("  >>> 按 Enter 关闭浏览器...")

        context.close()
        log(f"{name} 登录完成！Cookies 已保存到 Profile", "✅")
        print()
        return True


def login_all_sites():
    """依次打开所有站点的登录页。"""
    main_sites = ["bilibili", "douyin", "taobao", "xianyu"]
    total = len(main_sites)
    success = 0

    for i, key in enumerate(main_sites, 1):
        name = SITES[key][0]
        print("=" * 56)
        log(f"[{i}/{total}] 正在处理: {name}", "📌")
        print("=" * 56)

        if login_site(key):
            success += 1

        if i < total:
            log("等待 2 秒后打开下一个站点...", "⏳")
            time.sleep(2)

    print()
    print("=" * 56)
    log(f"全部完成: {success}/{total} 个站点已登录", "✅")
    print("=" * 56)


# ╔══════════════════════════════════════════════════════════════════╗
# ║                         主入口                                   ║
# ╚══════════════════════════════════════════════════════════════════╝

def main():
    print("=" * 56)
    print("       统一站点登录工具")
    print("=" * 56)
    print()
    print(f"  Profile 目录: {CHROME_PROFILE}")
    print(f"  已配置站点: B站 / 抖音 / 淘宝 / 闲鱼")
    print()

    args = sys.argv[1:]

    if not args:
        print("用法:")
        print(f"  python site_login.py bilibili    # B站登录")
        print(f"  python site_login.py douyin      # 抖音登录")
        print(f"  python site_login.py taobao      # 淘宝登录")
        print(f"  python site_login.py xianyu      # 闲鱼登录")
        print(f"  python site_login.py --all       # 依次登录全部")
        print()
        print(f"支持的后缀简写: bili/bz, dy, tb, xy/goofish")
        print()
        log("请指定要登录的站点", "⚠️")
        sys.exit(1)

    if "--all" in args:
        login_all_sites()
        return

    # 取第一个非 flag 参数作为站点
    site_key = None
    for arg in args:
        if not arg.startswith("--"):
            site_key = arg.lower()
            break

    if not site_key:
        log("请指定站点后缀，例如: python site_login.py douyin", "⚠️")
        sys.exit(1)

    login_site(site_key)


if __name__ == "__main__":
    main()
