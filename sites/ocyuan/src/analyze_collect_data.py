"""
分析 collectData 接口的加密方式
需要动态分析前端代码
"""

# 请求体分析
request_body = {
    "type": 1,
    "challenge": "s_mrnX0A62pMJXDDIWBjswxZSG2nvAxv4n",
    "verifyId": "v_EVoY1s1iGnAgOLOAuEvDPYjg1ofZE0zt",
    "collectData": "VEJIRzg0WEcyVEtVSjVTWa1wqyARVZ0t...",  # 很长的加密数据
    "key": "XiTNFgrq4YNimY1FnolFWXU/I/OAolPG...",  # RSA 加密的密钥？
    "callback": "verify_1776853725885"
}

print("=" * 80)
print("collectData 接口分析")
print("=" * 80)

print("\n📋 请求体字段:")
for key, value in request_body.items():
    if isinstance(value, str) and len(value) > 50:
        print(f"  {key}: {value[:50]}... (长度: {len(value)})")
    else:
        print(f"  {key}: {value}")

print("\n🔍 需要分析的加密字段:")
print("  1. collectData - 验证码验证数据（可能包含轨迹、位置等）")
print("  2. key - 可能是 RSA 加密的会话密钥")

print("\n💡 分析步骤:")
print("  1. 在浏览器中设置 XHR 断点")
print("  2. 找到 collectData 的加密函数")
print("  3. 分析加密算法和参数")
print("  4. Python 复现")

print("\n📝 请提供以下信息:")
print("  1. 完整的 collectData 值（Base64 解码后的内容）")
print("  2. 完整的 key 值")
print("  3. 验证码完成后的响应数据")
print("  4. 前端加密函数的源码（如果有）")

print("\n" + "=" * 80)
