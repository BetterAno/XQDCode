"""
加速乐(JSL) Cookie 获取模块
三次请求机制：521(AAEncode) → 521(AAEncode/OB+go) → 200(真实页面)
使用 Windows 内置 cscript.exe 执行 JS 表达式
"""

import re
import json
import hashlib
import subprocess
import tempfile
import os
import requests

# cscript.exe 临时文件路径
_CSCRIPT_TMP = os.path.join(tempfile.gettempdir(), 'jsl_eval.js')


def _cscript_eval(js_expr: str) -> str:
    """使用 Windows cscript.exe (JScript) 执行 JS 表达式，返回输出"""
    with open(_CSCRIPT_TMP, 'w', encoding='utf-8') as f:
        f.write('WScript.Echo(' + js_expr + ');')
    r = subprocess.run(
        ['cscript', '//E:JScript', '//Nologo', _CSCRIPT_TMP],
        capture_output=True, text=True, timeout=10
    )
    if r.returncode != 0:
        raise RuntimeError(f"cscript 执行失败: {r.stderr.strip()}")
    return r.stdout.strip()


def _eval_aaencode(html: str) -> str:
    """从 521 响应 HTML 中提取 AAEncode 表达式并用 cscript 求值"""
    m = re.search(r'document\.cookie=(.*?);location', html, re.DOTALL)
    if not m:
        raise ValueError("未找到 AAEncode 表达式")
    return _cscript_eval(m.group(1))


def _set_clearance(session: requests.Session, cookie_str: str):
    """从完整 cookie 字符串中提取 __jsl_clearance_s 并设置到 session"""
    for part in cookie_str.split(';'):
        part = part.strip()
        if part.startswith('__jsl_clearance_s='):
            val = part.split('=', 1)[1]
            session.cookies.set('__jsl_clearance_s', val)
            return val
    raise ValueError(f"cookie 字符串中未找到 __jsl_clearance_s: {cookie_str[:100]}")


def brute_force_jsl(go_params: dict) -> str:
    """
    暴力匹配 OB混淆层 __jsl_clearance_s
    go_params: {bts, chars, ct, ha, tn, vt, wt}
    """
    bts = go_params['bts']
    chars_str = go_params['chars']
    ct = go_params['ct']
    ha = go_params['ha']

    hash_funcs = {
        'md5': lambda d: hashlib.md5(d.encode()).hexdigest(),
        'sha1': lambda d: hashlib.sha1(d.encode()).hexdigest(),
        'sha256': lambda d: hashlib.sha256(d.encode()).hexdigest(),
    }
    hash_func = hash_funcs.get(ha)
    if not hash_func:
        raise ValueError(f"不支持的 hash 算法: {ha}")

    n = len(chars_str)
    for i in range(n):
        for j in range(n):
            candidate = bts[0] + chars_str[i] + chars_str[j] + bts[1]
            if hash_func(candidate) == ct:
                return candidate

    raise RuntimeError("JSL 暴力匹配失败")


def get_jsl_session(url: str = "https://beian.miit.gov.cn/",
                    headers: dict = None,
                    timeout: int = 15) -> requests.Session:
    """
    执行加速乐多次请求，返回携带完整 cookie 的 session
    """
    if headers is None:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                          "AppleWebKit/537.36 (KHTML, like Gecko) "
                          "Chrome/148.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        }

    session = requests.Session()
    max_rounds = 6

    for round_num in range(max_rounds):
        resp = session.get(url, headers=headers, allow_redirects=False, timeout=timeout)

        if resp.status_code != 521:
            # 成功通过 JSL
            return session

        # 判断响应类型：AAEncode / OB+go()
        # 1) 先检查是否有 go() 调用（OB混淆层）
        go_match = re.search(r';go\((.*?)\)</script>', resp.text, re.DOTALL)
        if go_match:
            go_params = json.loads(go_match.group(1))
            final_clearance = brute_force_jsl(go_params)
            session.cookies.set('__jsl_clearance_s', final_clearance)
            continue

        # 2) AAEncode 层 — 用 cscript 执行
        aa_match = re.search(r'document\.cookie=(.*?);location', resp.text, re.DOTALL)
        if aa_match:
            cookie_str = _eval_aaencode(resp.text)
            _set_clearance(session, cookie_str)
            continue

        raise RuntimeError(f"Round {round_num+1}: 未识别的 521 响应格式")

    raise RuntimeError(f"JSL 经过 {max_rounds} 轮仍为 521")


if __name__ == "__main__":
    print("=== 测试加速乐 Cookie 获取 ===")
    session = get_jsl_session()
    print(f"__jsluid_s: {session.cookies.get('__jsluid_s', 'N/A')}")
    print(f"__jsl_clearance_s: {session.cookies.get('__jsl_clearance_s', 'N/A')}")

    r = session.get("https://beian.miit.gov.cn/")
    print(f"验证请求状态: {r.status_code}, 页面长度: {len(r.text)}")
