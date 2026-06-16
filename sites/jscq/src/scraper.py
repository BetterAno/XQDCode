"""
江苏产权市场网 (www.jscq.com.cn) 数据采集脚本

瑞数 6 反爬保护 - 使用 Playwright 通过真实浏览器获取页面
数据从真实渲染的 DOM 中提取

用法:
    cd sites/jscq/src
    ../../../venv/Scripts/python.exe scraper.py [--type TYPE] [--page PAGE]

参数:
    --type  公告类型: cqzr(产权转让), zcjy(资产交易), qyzz(企业增资),
                     fczz(资产租赁), jrzc(金融资产), smgq(私募股权),
                     tyzy(体育资源), zhzs(综合招商), bgzz(并购重组),
                     wmfw(外贸服务), qb(全部)
                     默认: cqzr
    --page  页码, 默认 1
"""

import argparse
import csv
import json
import os
import sys
import time

from playwright.sync_api import sync_playwright

BASE_URL = "https://www.jscq.com.cn"
TYPE_MAP = {
    "qb": "qb",
    "cqzr": "cqzr",
    "zcjy": "zcjy",
    "qyzz": "qyzz",
    "fczz": "fczz",
    "jrzc": "jrzc",
    "smgq": "smgq",
    "tyzy": "tyzy",
    "zhzs": "zhzs",
    "bgzz": "bgzz",
    "wmfw": "wmfw",
}


def build_url(type_code="cqzr", page=1):
    path = f"/jscq/cqjy/jygg/{type_code}/index.shtml"
    if page > 1:
        path = f"/jscq/cqjy/jygg/{type_code}/{page}.shtml"
    return BASE_URL + path


def extract_list_items(page):
    from playwright.sync_api import Error as PwError
    try:
        return page.evaluate("""() => {
            const items = document.querySelectorAll('li.pxitem');
            const results = [];
            for (const li of items) {
                const links = li.querySelectorAll('a[href*="article_"]');
                if (links.length === 0) continue;
                let mainLink = null, typeLink = null;
                for (const a of links) {
                    const t = a.innerText.trim();
                    if (t === '正式公告' || t === '预告') typeLink = a;
                    else if (t.length > 5 && !mainLink) mainLink = a;
                }
                if (!mainLink) mainLink = links[0];
                const title = mainLink.innerText.trim();
                const url = mainLink.getAttribute('href');
                if (!title) continue;
                const allText = li.innerText;
                const statusMatch = allText.match(/^(已截止|已成交|报名中|项目终止|项目中止)/m);
                const priceMatch = allText.match(/挂牌价格[：:]\\s*(.+)/);
                const orgMatch = allText.match(/组织机构[：:]\\s*(.+)/);
                const deadlineMatch = allText.match(/截止日期[：:]\\s*([\\d-]+)/);
                const viewsMatch = allText.match(/浏览[：:]\\s*(\\d+)/);
                results.push({
                    title: title.substring(0, 200),
                    url: url,
                    status: statusMatch ? statusMatch[1] : '',
                    type: typeLink ? typeLink.innerText.trim() : '',
                    price: priceMatch ? priceMatch[1].trim() : '',
                    org: orgMatch ? orgMatch[1].trim() : '',
                    deadline: deadlineMatch ? deadlineMatch[1] : '',
                    views: viewsMatch ? viewsMatch[1] : ''
                });
            }
            return results;
        }""")
    except PwError:
        return []


def wait_for_ruishu(page, timeout=30):
    for i in range(timeout):
        time.sleep(1)
        title = page.title()
        body_len = page.evaluate("document.body ? document.body.innerText.length : 0")
        if ("江苏产权" in title or "产权转让" in title or body_len > 100):
            return True
    return False


def scrape(type_code="cqzr", page=1, headless=False):
    url = build_url(type_code, page)
    print(f"[*] 目标: {url}")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=headless, channel="chrome")
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                      "(KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
        )
        page = context.new_page()

        print("[1] 导航中...")
        page.goto(url, wait_until="domcontentloaded", timeout=30000)

        print("[2] 等待瑞数挑战...")
        ok = wait_for_ruishu(page)
        if not ok:
            print("[WARN] 页面可能未完全加载，尝试继续提取...")

        page.wait_for_timeout(2000)

        print("[3] 提取数据...")
        items = extract_list_items(page)
        print(f"    获取到 {len(items)} 条记录")

        browser.close()

    return items


def main():
    parser = argparse.ArgumentParser(description="江苏产权市场网数据采集")
    parser.add_argument("--type", default="cqzr", choices=TYPE_MAP.keys(), help="公告类型")
    parser.add_argument("--page", type=int, default=1, help="页码")
    parser.add_argument("--output", default=None, help="输出文件路径 (json/csv)")
    parser.add_argument("--headed", action="store_true", help="显示浏览器窗口")
    args = parser.parse_args()

    items = scrape(args.type, args.page, headless=not args.headed)

    if not items:
        print("[WARN] 未提取到数据")
        return

    print(f"\n{'='*60}")
    for i, item in enumerate(items):
        print(f"\n[{i+1}] {item['title'][:80]}")
        print(f"    状态: {item['status']}  类型: {item['type']}")
        print(f"    价格: {item['price']}  机构: {item['org']}")
        print(f"    截止: {item['deadline']}  浏览: {item['views']}")
        print(f"    URL: {item['url']}")

    # 保存
    if args.output:
        outpath = args.output
    else:
        outpath = os.path.join(os.path.dirname(__file__), "..", "output.json")

    if outpath.endswith(".csv"):
        with open(outpath, "w", encoding="utf-8-sig", newline="") as f:
            if items:
                writer = csv.DictWriter(f, fieldnames=items[0].keys())
                writer.writeheader()
                writer.writerows(items)
    else:
        with open(outpath, "w", encoding="utf-8") as f:
            json.dump(items, f, ensure_ascii=False, indent=2)

    print(f"\n[4] 数据已保存: {outpath}")


if __name__ == "__main__":
    main()
