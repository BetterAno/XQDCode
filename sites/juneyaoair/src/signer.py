"""
吉祥航空航班查询协议请求脚本
blackBox 由 Node.js signer.js 生成 (同盾设备指纹 SDK)
航班数据由 requests 直接请求 API 获取
"""

import json
import subprocess
import os
import sys
from datetime import datetime, timedelta

# Windows 终端 UTF-8 输出
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

try:
    import requests
except ImportError:
    print("[ERROR] 需要安装 requests: pip install requests")
    sys.exit(1)

# ========== 配置 ==========
SIGNER_JS = os.path.join(os.path.dirname(os.path.abspath(__file__)), "signer.js")
NODE_CMD = "node"  # 如果 node 不在 PATH 中, 改为完整路径

BASE_URL = "https://www.juneyaoair.com"
HEADERS_TEMPLATE = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
    "Content-Type": "application/json",
    "Origin": "https://www.juneyaoair.com",
    "Referer": "https://www.juneyaoair.com/",
    "ChannelNo": "B2C",
    "ClientVersion": "1.0.0",
    "VersionCode": "10000",
}


# ========== blackBox 生成 ==========
def generate_blackbox() -> str:
    """调用 Node.js signer.js 生成 blackBox"""
    try:
        result = subprocess.run(
            [NODE_CMD, SIGNER_JS],
            capture_output=True, text=True, timeout=35,
            cwd=os.path.dirname(SIGNER_JS),
        )
        if result.returncode != 0:
            raise RuntimeError(f"signer.js 执行失败: {result.stderr}")
        blackbox = result.stdout.strip()
        if not blackbox:
            raise RuntimeError("signer.js 返回空值")
        return blackbox
    except subprocess.TimeoutExpired:
        raise RuntimeError("signer.js 执行超时 (35s)")
    except FileNotFoundError:
        raise RuntimeError(f"找不到 Node.js, 请确认 '{NODE_CMD}' 在 PATH 中")


# ========== API 接口 ==========
def query_flights(
    dep_city: str = "SHA",
    arr_city: str = "BJS",
    dep_date: str = None,
    route_type: str = "OW",
    black_box: str = "",
) -> dict:
    """
    查询航班信息

    Args:
        dep_city: 出发城市代码 (SHA=上海, BJS=北京, CAN=广州, SZX=深圳)
        arr_city: 到达城市代码
        dep_date: 出发日期 YYYY-MM-DD, 默认明天
        route_type: OW=单程, RT=往返
        black_box: blackBox 值
    """
    if dep_date is None:
        dep_date = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")

    url = f"{BASE_URL}/api/flightFares/queryFlightSimple"
    headers = {**HEADERS_TEMPLATE, "BlackBox": black_box}
    payload = {
        "channelNo": "B2C",
        "data": {
            "RouteType": route_type,
            "FlightDirection": "G",
            "PassengerType": [],
            "FlightNos": "",
            "CabinClassGo": "",
            "BrandCodeGo": "",
            "SegCondList": [{
                "SegNO": 0,
                "FlightDirection": "G",
                "DepCity": dep_city,
                "ArrCity": arr_city,
                "FlightDate": dep_date,
                "DepAirport": None,
                "ArrAirport": None,
            }],
            "ArrDateTimeGo": "",
            "IsTransferGo": "N",
            "AirlinesFlagGo": "",
        },
        "blackBox": black_box,
    }

    resp = requests.post(url, json=payload, headers=headers, timeout=30)
    return resp.json()


def query_low_price(
    dep_city: str = "SHA",
    arr_city: str = "BJS",
    start_date: str = None,
    end_date: str = None,
    black_box: str = "",
) -> dict:
    """查询低价日历"""
    if start_date is None:
        start_date = datetime.now().strftime("%Y-%m-%d")
    if end_date is None:
        end_date = (datetime.now() + timedelta(days=365)).strftime("%Y-%m-%d")

    url = f"{BASE_URL}/api/flightFares/queryLowPriceInfo"
    headers = {**HEADERS_TEMPLATE, "BlackBox": black_box}
    payload = {
        "channelNo": "B2C",
        "data": {
            "RouteType": "OW",
            "DepCity": dep_city,
            "ArrCity": arr_city,
            "StartFlightDate": start_date,
            "EndFlightDate": end_date,
            "GoFlightDate": "",
            "BackFlightDate": "",
            "FightDirection": "",
            "DayRange": "",
            "CalendarMode": "2",
            "loading": False,
        },
        "blackBox": black_box,
    }

    resp = requests.post(url, json=payload, headers=headers, timeout=30)
    return resp.json()


# ========== 结果格式化 ==========
def format_flights(data: dict):
    """格式化航班查询结果"""
    if data.get("code") != "SUCCESS":
        print(f"[ERROR] API 返回异常: {data.get('code')} - {data.get('message')}")
        return

    flights = data.get("data", {}).get("FlightInfoCombList", [])
    if not flights:
        print("[INFO] 未查询到航班")
        return

    print(f"\n{'='*80}")
    print(f"{'航班号':<10} {'出发':>8} {'到达':>8} {'机场':>12} {'经济最低价':>10} {'商务最低价':>10}")
    print(f"{'='*80}")

    for flight_comb in flights:
        flight_list = flight_comb.get("FlightInfoList", [])
        for fi in flight_list:
            flight_no = fi.get("FlightNo", "")
            dep_time = fi.get("DepDateTime", "")[-5:]
            arr_time = fi.get("ArrDateTime", "")[-5:]
            dep_airport = fi.get("DepAirportName", "")
            arr_airport = fi.get("ArrAirportName", "")
            lowest_economy = fi.get("LowestValueEconomy", 0)
            lowest_first = fi.get("LowestValueFirst", 0)
            aircraft = fi.get("AircraftModel", "")

            print(f"{flight_no:<10} {dep_time:>8} {arr_time:>8} {dep_airport}-{arr_airport:>6} {lowest_economy:>8.0f}元 {lowest_first:>8.0f}元")

        # 舱位详情
        cabin_list = flight_comb.get("CabinFareCombList", [])
        adt_cabins = [c for c in cabin_list if c.get("PassengerType") == "ADT"]
        if adt_cabins:
            print(f"  舱位明细 (成人):")
            for c in adt_cabins[:5]:
                cabin = c.get("CabinComb", "")
                price = c.get("PriceValue", 0)
                cabin_class = "经济" if c.get("CabinClass") == "Y" else "商务"
                print(f"    {cabin_class} {cabin}舱: {price:.0f}元 (税费 {c.get('YQTax',0)+c.get('CNTax',0):.0f}元)")
            if len(adt_cabins) > 5:
                print(f"    ... 共 {len(adt_cabins)} 个舱位")
        print(f"{'-'*80}")

    print(f"共 {len(flights)} 个航班\n")


# ========== 主流程 ==========
def main():
    print("[1/3] 生成 blackBox...")
    black_box = generate_blackbox()
    print(f"  blackBox = {black_box}")

    # 查询参数
    dep_city = "SHA"
    arr_city = "BJS"
    dep_date = (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d")

    print(f"\n[2/3] 查询航班: {dep_city} → {arr_city} ({dep_date})")
    flight_data = query_flights(dep_city, arr_city, dep_date, black_box=black_box)
    format_flights(flight_data)

    print(f"[3/3] 查询低价日历: {dep_city} → {arr_city}")
    price_data = query_low_price(dep_city, arr_city, black_box=black_box)
    if price_data.get("code") == "SUCCESS":
        prices = price_data.get("data", {}).get("QueryLowPriceList", [])
        # 只显示最近 7 天有价格的
        valid_prices = [p for p in prices if p.get("LowPriceValue") is not None][:7]
        if valid_prices:
            print(f"  近 7 天最低价:")
            for p in valid_prices:
                print(f"    {p['FlightDate']}: {p['LowPriceValue']:.0f}元")
        else:
            print("  [INFO] 暂无低价数据")
    else:
        print(f"  [ERROR] {price_data.get('message')}")

    print("\n[完成]")


if __name__ == "__main__":
    main()
