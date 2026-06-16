"""
Verify5 滑块验证码求解器 - 命令行入口

用法:
    python -m src.main [options]

选项:
    --config <path>     配置文件路径 (默认: config/config.json)
    --url <url>         目标页面 URL (默认: https://www.verify5.com/demo)
    --verbose           详细输出
    --test-crypto       测试加密算法
    --test-track        测试轨迹生成
    --compare-modes     对比 Node.js 补环境 vs 纯算法方案
"""

import argparse
import json
import logging
import sys
import os
import time

# 添加项目根目录到路径
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.captcha import Verify5Captcha


def main():
    parser = argparse.ArgumentParser(
        description="Verify5 滑块验证码纯协议求解器",
        formatter_class=argparse.RawDescriptionHelpFormatter
    )
    
    parser.add_argument("--config", default="config/config.json",
        help="配置文件路径")
    parser.add_argument("--url", default="https://www.verify5.com/demo",
        help="目标页面 URL")
    parser.add_argument("--verbose", "-v", action="store_true",
        help="详细输出")
    parser.add_argument("--test-crypto", action="store_true",
        help="测试加密算法")
    parser.add_argument("--test-track", action="store_true",
        help="测试轨迹生成")
    parser.add_argument("--compare-modes", action="store_true",
        help="对比 Node.js 补环境 vs 纯算法方案")
    
    args = parser.parse_args()
    
    # 设置日志级别
    log_level = logging.DEBUG if args.verbose else logging.INFO
    logging.basicConfig(
        level=log_level,
        format='%(asctime)s [%(levelname)s] %(name)s: %(message)s',
        datefmt='%H:%M:%S'
    )
    
    logger = logging.getLogger("Verify5")
    
    # 加载配置
    config = {}
    config_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), args.config)
    if os.path.exists(config_path):
        with open(config_path, 'r', encoding='utf-8') as f:
            config = json.load(f)
    
    if args.test_crypto:
        run_crypto_test()
        return
    
    if args.test_track:
        run_track_test()
        return
    
    if args.compare_modes:
        run_comparison()
        return
    
    # 执行验证
    logger.info("=" * 60)
    logger.info("Verify5 滑块验证码纯协议求解器")
    logger.info(f"目标: {args.url}")
    logger.info(f"SDK 版本: {Verify5Captcha.SDK_VERSION}")
    logger.info("=" * 60)
    
    solver = Verify5Captcha(config)
    
    try:
        # 加载页面
        logger.info("Step 1/7: 加载页面...")
        if not solver.load_page():
            logger.error("页面加载失败")
            return 1
        
        # 获取验证码配置
        logger.info("Step 2/7: 获取验证码配置...")
        if not solver.get_captcha_config():
            logger.error("无法获取验证码配置")
            return 1
        
        # 下载图片
        logger.info("Step 3/7: 下载验证码图片...")
        from core.slider_solver import detect_gap_multi_canny
        import requests
        
        bg_resp = requests.get(solver.bg_url, timeout=15)
        slice_resp = requests.get(solver.slice_url, timeout=15)
        
        # 检测缺口
        logger.info("Step 4/7: 识别缺口位置...")
        distance, debug = detect_gap_multi_canny(solver.bg_url, solver.slice_url)
        
        if distance is None:
            logger.error("缺口识别失败")
            return 1
        
        logger.info(f"缺口距离: {distance}px (置信度: {debug.get('confidence', 0):.3f})")
        
        # 生成轨迹
        logger.info("Step 5/7: 生成滑动轨迹...")
        from core.slider_solver import generate_track, compute_track_string
        
        track_raw = generate_track(distance)
        track_string = compute_track_string(track_raw)
        
        # 提交验证
        logger.info("Step 6/7: 提交验证...")
        result = solver.solve()
        
        # 输出结果
        logger.info("Step 7/7: 验证结果")
        if result:
            print("\n" + "=" * 60)
            print("验证成功!")
            print(f"Token: {result}")
            print("=" * 60)
        else:
            print("\n" + "=" * 60)
            print("验证失败!")
            print("=" * 60)
            return 1
        
    except KeyboardInterrupt:
        logger.info("用户中断")
    except Exception as e:
        logger.error(f"执行出错: {e}", exc_info=args.verbose)
        return 1
    finally:
        solver.close()
    
    return 0


def run_crypto_test():
    """测试加密算法"""
    print("=" * 60)
    print("加密算法测试")
    print("=" * 60)
    
    from core.crypto import murmur_hash_128, y_decrypt, verify5_encrypt, verify5_decrypt
    
    # Test 1: MurmurHash3
    data = "test_fingerprint_data_12345"
    h = murmur_hash_128(data)
    print(f"\n[MurmurHash3]")
    print(f"  Input:  {data}")
    print(f"  Hash:   {h}")
    print(f"  Length: {len(h)} chars")
    
    # Test 2: Y decrypt
    encrypted = "abcdefghijklmnopqrstuvwxyz"
    fp = "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6"
    result = y_decrypt(encrypted, fp)
    print(f"\n[Y Decrypt]")
    print(f"  Encrypted: {encrypted}")
    print(f"  FP hash:   {fp}")
    print(f"  Result:    {result}")
    
    # Test 3: Verify5 AES-CTR
    plaintext = '{"test": "Hello Verify5", "number": 12345}'
    key = "0123456789abcdef"  # 16 char hex key
    encrypted = verify5_encrypt(plaintext, key)
    decrypted = verify5_decrypt(encrypted, key)
    print(f"\n[Verify5 AES-CTR]")
    print(f"  Plaintext:  {plaintext}")
    print(f"  Encrypted:  {encrypted[:50]}...")
    print(f"  Decrypted:  {decrypted}")
    print(f"  Match:      {plaintext == decrypted}")


def run_track_test():
    """测试轨迹生成"""
    print("=" * 60)
    print("轨迹生成测试")
    print("=" * 60)
    
    from core.slider_solver import generate_track, compute_track_string, generate_track_v2
    
    for dist in [50, 120, 200, 280]:
        print(f"\n[Distance: {dist}px]")
        track = generate_track(dist)
        track_str = compute_track_string(track)
        print(f"  Points: {len(track)}")
        print(f"  Track:  {track_str[:80]}...")
        print(f"  Total:  {sum(p[1] for p in track if p[0]==2)}px")


def run_comparison():
    """对比两种实现方案"""
    print("=" * 60)
    print("Node.js 补环境 vs 纯算法方案对比")
    print("=" * 60)
    
    comparison = """
方案对比分析总结
================

1. Node.js 补环境方案 (web-reverse-env)
   原理: 在 Node.js 中模拟浏览器环境, 直接执行原始 v5.js 加密函数
   优点:
   - 不需要逆向和重写加密算法
   - 与原始 SDK 行为 100% 一致
   - 指纹采集可通过 Node.js 环境模拟 (canvas, webgl 等)
   - 开发时间短: 仅需补环境和 Node.js 调用封装
   缺点:
   - 依赖 Node.js 运行时 (~50MB)
   - 需要 websocket/dom 等模块的补全
   - 指纹报告可能不准确 (canvas/webgl 在 Node 中无真实硬件)
   - 调试复杂: Node.js 与浏览器行为差异难排查
   - 首次调用需 JIT 预热 (~200ms)
   
2. 纯算法方案 (Python 实现)
   原理: 完全重写 AES-CTR, MurmurHash3 等算法, 在 Python 中实现
   优点:
   - 无外部运行时依赖 (仅 Python 标准库 + websocket-client)
   - 可精确控制每个加密步骤
   - 指纹数据可控: 可自由组合/调整
   - 易于调试和性能分析
   - 部署轻量: 单个 Python 脚本
   缺点:
   - 需要深入逆向理解加密算法
   - 算法实现需要严格对齐 (S-box, padding等)
   - 如果 SDK 升级, 需要重新分析

3. 推荐方案: 纯算法方案 (Python)
   理由:
   a. 部署简单: 不需要 Node.js 运行时
   b. 可控性强: 每个字节的加密都可追溯
   c. 性能稳定: 无 JIT 预热延迟
   d. 维护性好: Python 代码可读性远高于混淆 JS
   e. 安全合规: 不执行不明来源的混淆代码
   
   但建议同时保留 Node.js 补环境方案作为 fallback:
   - 用于反向验证纯算法的正确性
   - 在 SDK 升级时快速恢复可用性
   - 为其他 Verify5 实例提供通用解决方案

4. 性能对比 (估算)
   指标                  Node.js 补环境     Python 纯算法
   -------------------------------------------------
   首次调用耗时          300-500ms          50-100ms
   后续调用耗时          50-150ms           10-30ms
   内存占用              ~80MB              ~15MB
   并发能力              受限于V8单线程     可多进程
   环境依赖复杂度        高 (npm包)         低 (pip包)
"""
    
    print(comparison)


if __name__ == "__main__":
    sys.exit(main())
