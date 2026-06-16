"""
淘宝 MTOP 协议客户端
实现 sign 签名 + Cookie 管理 + MTOP API 请求

纯算部分: sign 公式已验证
AWSC 参数: bx-umidtoken 复用, bx-ua/bx_et 从浏览器获取
"""

import hashlib
import time
import json
import urllib.parse
from typing import Optional, Dict, Any
import requests


class MtopClient:
    """淘宝 MTOP API 客户端"""

    MTOP_BASE = "https://h5api.m.taobao.com/h5"
    APP_KEY = "12574478"

    def __init__(self, cookies: Dict[str, str] = None):
        """
        Args:
            cookies: dict of cookies, must include _m_h5_tk
        """
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
            "Accept": "application/json",
            "Referer": "https://s.taobao.com/search",
            "Origin": "https://s.taobao.com",
        })

        # 设置 cookies
        if cookies:
            for k, v in cookies.items():
                self.session.cookies.set(k, v)

        # AWSC 参数（可选，从浏览器获取）
        self.bx_umidtoken: Optional[str] = None
        self.bx_ua: Optional[str] = None
        self.bx_et: Optional[str] = None

    @property
    def token(self) -> Optional[str]:
        """从 _m_h5_tk cookie 提取 token"""
        tk = self.session.cookies.get("_m_h5_tk", "")
        if "_" in tk:
            return tk.split("_")[0]
        return None

    def _sign(self, t: str, data_json: str) -> str:
        """生成 MTOP sign"""
        token = self.token
        if not token:
            raise ValueError("_m_h5_tk cookie not set")
        sign_input = f"{token}&{t}&{self.APP_KEY}&{data_json}"
        return hashlib.md5(sign_input.encode()).hexdigest()

    def _build_url(self, api: str, v: str, data_json: str,
                   extra_params: Dict[str, str] = None) -> str:
        """构建 MTOP 请求 URL"""
        t = str(int(time.time() * 1000))
        sign = self._sign(t, data_json)

        params = {
            "jsv": "2.7.4",
            "appKey": self.APP_KEY,
            "t": t,
            "sign": sign,
            "api": api,
            "v": v,
            "type": "originaljson",
            "dataType": "jsonp",
        }

        # 添加 AWSC 参数
        if self.bx_umidtoken:
            params["bx-umidtoken"] = self.bx_umidtoken
        if self.bx_ua:
            params["bx-ua"] = self.bx_ua
        if self.bx_et:
            params["bx_et"] = self.bx_et

        # 额外参数
        if extra_params:
            params.update(extra_params)

        # 构建完整 URL
        url = f"{self.MTOP_BASE}/{api}/{v}/"
        url += "?" + urllib.parse.urlencode(params)
        return url

    def get(self, api: str, v: str = "1.0", data_json: str = "{}",
            extra_params: Dict[str, str] = None) -> requests.Response:
        """GET 请求"""
        url = self._build_url(api, v, data_json, extra_params)
        if "data" not in (extra_params or {}):
            # data 作为 URL 参数
            url += "&data=" + urllib.parse.quote(data_json)
        return self.session.get(url, timeout=10)

    def post(self, api: str, v: str = "1.0", data_json: str = "{}",
             extra_params: Dict[str, str] = None) -> requests.Response:
        """POST 请求"""
        url = self._build_url(api, v, data_json, extra_params)
        body = {"data": data_json}
        return self.session.post(url, data=body, timeout=10)

    # ---- 常用 API 快捷方法 ----

    def get_user_info(self) -> Dict[str, Any]:
        """获取用户信息"""
        resp = self.get("mtop.user.getUserSimple", "1.0")
        return resp.json()

    def recommend(self, app_id: str, item_id: str) -> Dict[str, Any]:
        """获取推荐数据"""
        data = json.dumps({
            "appId": app_id,
            "params": json.dumps({"itemId": item_id}),
        })
        resp = self.post("mtop.relationrecommend.wirelessrecommend.recommend", "2.0", data_json=data)
        return resp.json()

    def check_collect(self, item_ids: list) -> Dict[str, Any]:
        """检查收藏状态（script 类型，不需要 AWSC）"""
        data = json.dumps({
            "ids": json.dumps([str(i) for i in item_ids]),
            "type": "1",
        })
        resp = self.get(
            "mtop.taobao.mercury.checkCollect", "1.0",
            data_json=data,
            extra_params={
                "needEcodeSign": "true",
                "bizName": "msoa.taobao.check.collect.h5",
                "sceneName": "main_check_collect_h5",
                "timeout": "10000",
                "type": "jsonp",
                "callback": "mtopjsonp1",
            }
        )
        return resp.json()

    def query_bag_count(self) -> Dict[str, Any]:
        """查询购物车数量（script 类型）"""
        data = json.dumps({"cartFrom": "main_site", "extStatus": 0, "netType": 0})
        resp = self.get(
            "mtop.trade.queryBagCount", "1.0",
            data_json=data,
            extra_params={
                "timeout": "20000",
                "ttid": "1@tbwang_windows_1.0.0#pc",
                "type": "jsonp",
                "callback": "mtopjsonp2",
            }
        )
        return resp.json()


# ---- Cookie 辅助 ----

def parse_cookie_string(cookie_str: str) -> Dict[str, str]:
    """解析浏览器 cookie 字符串为 dict"""
    cookies = {}
    for item in cookie_str.split("; "):
        if "=" in item:
            k, v = item.split("=", 1)
            cookies[k] = v
    return cookies


def extract_token_from_cookie(cookies: Dict[str, str]) -> str:
    """从 cookie dict 提取 _m_h5_tk token"""
    tk = cookies.get("_m_h5_tk", "")
    if "_" in tk:
        return tk.split("_")[0]
    return tk


# ---- 使用示例 ----

if __name__ == "__main__":
    # 从浏览器请求头中复制的完整 cookie（必须含 cookie1/cookie2/uc3/uc4/isg 等）
    cookie_str = "t=97c69a2838d4af9194c9fafedbcafc53; thw=cn; cookie2=1eaa34a9afe18b337c85adbdc413de58; _tb_token_=7163833ee15ed; mtop_partitioned_detect=1; _samesite_flag_=true; xlly_s=1; wk_cookie2=1af4b8452413fa4d328eb62cb64dec79; _m_h5_tk=e04ca966ad7ce6e546c772a1182427d8_1781068241275; _m_h5_tk_enc=8d644505f8316fe673db20ba1169ba6b; mt=ci=0_0; 3PcFlag=1781061396931; cna=tZ6vIub4IRwBASQJiVuQVE/X; wk_unb=UUpjNmHd8gqHJQ5Osg%3D%3D; sgcookie=E100Wv1BOp7qBL6Uu%2FzbV%2F%2BQRC9rHcpsn%2F%2B7gCjMSTvZTOE02sZ2%2F9ypP7yEAFe89QNHbOY4f2knauBZcb61PLpTUfYUWwuuSWrzWkor7iKpdcA%3D; unb=2220202510358; csg=26147c85; lgc=tb478111488935; cancelledSubSites=empty; cookie17=UUpjNmHd8gqHJQ5Osg%3D%3D; dnk=tb478111488935; skt=611e15a862d16c8d; tracknick=tb478111488935; _cc_=WqG3DMC9EA%3D%3D; _l_g_=Ug%3D%3D; sg=584; _nk_=tb478111488935; cookie1=WvYxGSVWxBHfYwoYXNGNFtmN%2BpKFGZlByVNoXIoDk6w%3D; sn=; uc3=id2=UUpjNmHd8gqHJQ5Osg%3D%3D&nk2=F5RBwlksD1YxLEcJpxw%3D&vt3=F8dD1NM37hRlPJoGRDo%3D&lg2=W5iHLLyFOGW7aA%3D%3D; ultraCookieBase=1k6S5%2BcxkgQpZU9erWahspZblGFE1fVBYPhgarJTwMNY5VvEtNUrzFYm6ynqT6c6k4v1XhcGKYuW%2FDlfDafrrCMAM2zNanBVEygiecrUpJgVwoOZTcq7S6fYPNcZHyhcfW0bMmAy4hX2HRRqeQlQRf0Km2O3ba%2BMl%2FH1OywgfFS8wnW4ZkssbgtvvqaTU9Mq%2B4CxBk4Gdlcj5DZWHDiAPFRV7%2BKj9ZdbyT2LkOQw%2F4yHEsS2quNoFdXCcxk5d4Wp4XoSKR710ianf8fae%2F4NUQTQs76iPJxUd%2BQBENQ%3D%3D; existShop=MTc4MTA2MTQxOQ%3D%3D; uc4=id4=0%40U2gp9rIZJ78zNMyzLbJelwQQiSO87Uyo&nk4=0%40FY4Kpz2shHSC8szmm%2FlfPsRICxQ9OiKm0Q%3D%3D; _hvn_lgc_=0; havana_lgc2_0=eyJoaWQiOjIyMjAyMDI1MTAzNTgsInNnIjoiMjU5NjQ2OTc1MWZlZjJiMzhjYTljYTg4YjY3YjJjMzQiLCJzaXRlIjowLCJ0b2tlbiI6IjFnb1RRZnR4eGtnRlVQOHVrbmMyRlJnIn0; bxuab=0; sdkSilent=1781090222427; havana_sdkSilent=1781090222427; havana_lgc_exp=1812165537137; fastSlient=1781061537137; uc1=cookie21=U%2BGCWk%2F7p4mBoUyS50%2FY&cookie16=WqG3DMC9UpAPBHGz5QBErFxlCA%3D%3D&cookie14=UoYWPA6KqpjDJA%3D%3D&existShop=false&pas=0&cookie15=VFC%2FuZ9ayeYq2g%3D%3D; tfstk=hGWSsv2uFI1p-LvUgEp6CW9lmpJLFw8e8MLpVEY-UMLedw_CRURLrLWClMQ_qHzlLLjkKs4INVBSDKK1D3hp24sJE0pL7PyZgmduza7KSJK-MnLDAYH-pwpxDHxepHKJpoTvAhcKywpLciLDx2hJpHexk3xEyppdJiEXvEKJpQQdDotHkeQqttUgbz3Jnn7uYARWWiNiptBxQQY12EGSKtMkNt5LGgIXa6IMsT-7dxvPfspvA9qtOeO19TJAere9iBKeDvlRLpzdH6XcBMluey5fXO7JhxwYP_Qk3aBnyJWOEa1f66emj5VNkMf5_bwu4JbCy__QHoBb1iINsTM0EyUHrKvVID4OtXDCFKyZBAjbVQKDmcrbcflHwnxX7oZjtXAJmn2acoGZt; isg=BNfXwto5cQatYfZ3x5-HC27cZkshHKt-XIYcUikEQqZGWPSaMe72zic-uvjGzYP2"  # 替换为实际值

    cookies = parse_cookie_string(cookie_str)
    token = extract_token_from_cookie(cookies)
    print(f"Token: {token}")

    client = MtopClient(cookies)

    # 测试各 API（全部用 POST）
    print("\n--- recommend ---")
    data = '{"appId":"46853","params":"{\\"itemId\\":\\"1058596676614\\"}"}'
    try:
        result = client.post("mtop.relationrecommend.wirelessrecommend.recommend", "2.0", data_json=data)
        print(json.dumps(result.json(), indent=2, ensure_ascii=False)[:500])
    except Exception as e:
        print(f"Error: {e}")

    print("\n--- getUserSimple ---")
    try:
        result = client.post("mtop.user.getUserSimple", "1.0")
        print(json.dumps(result.json(), indent=2, ensure_ascii=False)[:300])
    except Exception as e:
        print(f"Error: {e}")
