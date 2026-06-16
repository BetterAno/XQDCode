"""
Boss直聘 __zp_stoken__ Cookie 生成与请求脚本（登录态模式）

推荐流程（登录态 + Chrome 147 完整 headers）：
  1. 用户浏览器登录 Boss，F12 复制 cookie → 粘贴到 cookie_config.json.raw_cookie
  2. 脚本读配置 → curl_cffi(chrome131) + 完整 headers → 直接 POST joblist.json
  3. 若 code=0：直接解析返回
  4. 若 code=37/38：尝试调用 env.js 补环境生成 __zp_stoken__ 兜底

用法:
    python signer.py                      # 用默认 python 搜索词
    python signer.py 后端                 # 自定义关键词
"""
import os
import sys
import re
import json
import time
import uuid
import random
import subprocess
import logging
from pathlib import Path
from http.cookies import SimpleCookie

from curl_cffi import requests

# curl_cffi TLS 指纹模拟
IMPERSONATE = "chrome131"

# ============ 路径配置 ============
BASE_DIR = Path(__file__).parent
ENV_DIR = BASE_DIR / "env"
JS_ASSETS_DIR = BASE_DIR.parent / "assets" / "js"
COOKIE_CONFIG = BASE_DIR / "cookie_config.json"
NODE_PATH = "node"
ZP_STOKEN_KEY = "__zp_stoken__"

# 本地直连（不使用代理），仅依赖 curl_cffi 的 TLS/JA3 指纹伪装

# 日志
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
logger = logging.getLogger("zhipin")


# ============ 配置加载 ============
def load_config():
    """加载 cookie_config.json"""
    if not COOKIE_CONFIG.exists():
        logger.error(f"配置文件不存在：{COOKIE_CONFIG}")
        logger.error("请按模板创建该文件，填入浏览器登录后复制的 raw_cookie")
        sys.exit(1)
    with open(COOKIE_CONFIG, "r", encoding="utf-8") as f:
        cfg = json.load(f)
    raw = cfg.get("raw_cookie", "").strip()
    if not raw:
        logger.error("cookie_config.json 中 raw_cookie 为空")
        sys.exit(1)
    # 快速校验登录态
    if "wt2=" not in raw or "zp_at=" not in raw:
        logger.warning("⚠️  raw_cookie 中未检测到 wt2/zp_at 登录态 cookie，可能被判定未登录→code=38")
    return cfg


def parse_cookie_string(raw):
    """把 'k1=v1; k2=v2' 字符串解析为 dict（保留原样，不做 URL 解码）"""
    result = {}
    for pair in raw.split(";"):
        pair = pair.strip()
        if not pair or "=" not in pair:
            continue
        k, _, v = pair.partition("=")
        result[k.strip()] = v.strip()
    return result


# ============ 请求构造 ============
def build_chrome147_headers(cfg, raw_cookie):
    """构造 Chrome 147 的完整 headers（复刻成功 curl 请求）"""
    return {
        "accept": "application/json, text/plain, */*",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
        "cache-control": "no-cache",
        "content-type": "application/x-www-form-urlencoded",
        "origin": "https://www.zhipin.com",
        "pragma": "no-cache",
        "priority": "u=1, i",
        "referer": f"https://www.zhipin.com/web/geek/jobs?city={cfg['city_code']}&query={cfg['query_keyword']}",
        "sec-ch-ua": cfg.get("sec_ch_ua", '"Chromium";v="147", "Not.A/Brand";v="8"'),
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": cfg.get("sec_ch_ua_platform", '"Windows"'),
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sec-gpc": "1",
        "traceid": f"F-{uuid.uuid4().hex[:16]}{random.randint(1000, 9999)}",
        "user-agent": cfg["user_agent"],
        "x-requested-with": "XMLHttpRequest",
        "cookie": raw_cookie,
    }


def build_joblist_form(query, city_code, page=1):
    return {
        "page": str(page),
        "pageSize": "15",
        "city": city_code,
        "expectInfo": "",
        "query": query,
        "multiSubway": "",
        "multiBusinessDistrict": "",
        "position": "",
        "jobType": "",
        "salary": "",
        "experience": "",
        "degree": "",
        "industry": "",
        "scale": "",
        "stage": "",
        "scene": "1",
        "encryptExpectId": "",
    }


# ============ 兜底：Node.js 补环境生成 stoken ============
def download_security_js(name):
    JS_ASSETS_DIR.mkdir(parents=True, exist_ok=True)
    filepath = JS_ASSETS_DIR / f"{name}.js"
    if filepath.exists():
        return str(filepath)
    for url in [
        f"https://www.zhipin.com/web/common/security-js/{name}.js",
        f"https://www.zhipin.com/web/passport/zp/security-js/{name}.js",
    ]:
        try:
            logger.info(f"下载 security JS: {url}")
            resp = requests.get(url, timeout=15, impersonate=IMPERSONATE)
            if resp.status_code == 200 and len(resp.text) > 10000:
                filepath.write_text(resp.text, encoding="utf-8")
                return str(filepath)
        except Exception as e:
            logger.warning(f"下载失败 {url}: {e}")
    return None


def generate_stoken(seed, ts, js_file=None):
    env_js = ENV_DIR / "env.js"
    if not env_js.exists():
        logger.error(f"补环境脚本不存在: {env_js}")
        return None
    try:
        cmd = [NODE_PATH, str(env_js), seed, str(ts)]
        if js_file:
            cmd.append(str(js_file))
        result = subprocess.run(
            cmd, capture_output=True, text=True, encoding="utf-8",
            errors="replace", timeout=30, cwd=str(ENV_DIR),
        )
        if result.returncode != 0:
            logger.error(f"Node.js 失败: {result.stderr[:300]}")
            return None
        m = re.search(r"\[RESULT\]\s*__zp_stoken__=(.+)", result.stdout)
        if m:
            return m.group(1).strip()
        m = re.search(r"__zp_stoken__=([^\s]+)", result.stdout)
        return m.group(1).strip() if m else None
    except Exception as e:
        logger.error(f"生成 stoken 异常: {e}")
        return None


def fallback_with_stoken(cfg, raw_cookie_dict, zp_data):
    """code=37/38 兜底：用 env.js 生成新 stoken 后替换"""
    seed = zp_data.get("seed")
    name = zp_data.get("name")
    ts = zp_data.get("ts")
    if not (seed and name and ts):
        return None
    js_file = download_security_js(name)
    if not js_file:
        return None
    stoken = generate_stoken(seed, ts, js_file)
    if not stoken:
        return None
    logger.info(f"兜底生成 __zp_stoken__: {stoken[:60]}...")
    raw_cookie_dict[ZP_STOKEN_KEY] = stoken
    return "; ".join(f"{k}={v}" for k, v in raw_cookie_dict.items())


# ============ 主请求 ============
def request_joblist(cfg, max_retry=2):
    raw_cookie = cfg["raw_cookie"]
    cookie_dict = parse_cookie_string(raw_cookie)
    headers = build_chrome147_headers(cfg, raw_cookie)

    api_url = "https://www.zhipin.com/wapi/zpgeek/search/joblist.json"
    body = build_joblist_form(cfg["query_keyword"], cfg["city_code"])

    for attempt in range(max_retry + 1):
        ts_param = str(int(time.time() * 1000))
        url = f"{api_url}?_={ts_param}"
        logger.info(f"POST {url}  (attempt {attempt + 1}/{max_retry + 1})")

        try:
            resp = requests.post(
                url, data=body, headers=headers,
                impersonate=IMPERSONATE, timeout=15,
            )
        except Exception as e:
            logger.error(f"请求异常: {e}")
            return None

        logger.info(f"HTTP {resp.status_code}, body {len(resp.text)} B")
        try:
            data = resp.json()
        except Exception:
            logger.error(f"响应非 JSON: {resp.text[:200]}")
            return resp

        code = data.get("code")
        msg = data.get("message", "")
        logger.info(f"API code={code}, message={msg}")

        if code == 0:
            return resp

        if code in (37, 38) and attempt < max_retry:
            zp_data = data.get("zpData") or {}
            new_cookie = fallback_with_stoken(cfg, cookie_dict, zp_data)
            if new_cookie:
                raw_cookie = new_cookie
                headers["cookie"] = new_cookie
                logger.info("已替换 __zp_stoken__，重试…")
                continue
            logger.warning("兜底生成 stoken 失败，无法重试")
            return resp

        if code == 35:
            logger.warning(f"code=35 IP 限流，等待 8s 后重试")
            if attempt < max_retry:
                time.sleep(8)
                continue

        return resp

    return None


# ============ 主函数 ============
def main():
    logger.info("=" * 60)
    logger.info("Boss直聘 登录态模式请求")
    logger.info("=" * 60)

    cfg = load_config()

    # 命令行覆盖关键词
    if len(sys.argv) > 1:
        cfg["query_keyword"] = sys.argv[1]
        logger.info(f"关键词覆盖为: {cfg['query_keyword']}")

    cookie_dict = parse_cookie_string(cfg["raw_cookie"])
    logger.info(f"加载 cookie: {len(cookie_dict)} 项")
    for k in ("wt2", "zp_at", "__zp_stoken__"):
        v = cookie_dict.get(k, "")
        logger.info(f"  {k}: {v[:40]}{'...' if len(v) > 40 else ''}")

    resp = request_joblist(cfg)
    if resp is None:
        logger.error("请求失败")
        sys.exit(1)

    try:
        data = resp.json()
        code = data.get("code")
        if code == 0:
            zp_data = data.get("zpData", {})
            jobs = zp_data.get("jobList", [])
            total = zp_data.get("resCount", "?")
            logger.info(f"✅ 成功！共 {total} 条，本页返回 {len(jobs)} 条")
            for i, job in enumerate(jobs[:10]):
                skills = ", ".join((job.get("skills") or [])[:4])
                logger.info(
                    f"  [{i + 1}] {job.get('jobName', 'N/A')} @ {job.get('brandName', 'N/A')} "
                    f"[{job.get('cityName', '')}] ¥{job.get('salaryDesc', '')} | {skills}"
                )
        else:
            logger.warning(f"非 code=0 响应: {json.dumps(data, ensure_ascii=False)[:400]}")
    except Exception as e:
        logger.warning(f"响应解析失败: {e}")

    # 落盘
    output_dir = BASE_DIR / "output"
    output_dir.mkdir(exist_ok=True)
    output_file = output_dir / "api_response.json"
    output_file.write_text(resp.text, encoding="utf-8")
    logger.info(f"响应已保存: {output_file}")


if __name__ == "__main__":
    main()
