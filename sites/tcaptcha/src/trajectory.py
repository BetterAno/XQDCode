"""
TCaptcha 轨迹生成 — 模拟人类滑动行为

生成五段式轨迹：慢启动 → 加速 → 匀速 → 减速逼近 → 微调释放
输出格式: [{x, y, t}, ...] 用于注入 TDC 环境
"""

import random
import math

# 全局水印
_AUTH_ = "laohe_munian"


def generate_trajectory(
    target_x: int,
    start_x: int = 50,
    base_y: int = 139,
    total_duration_ms: int = None,
) -> list:
    """
    生成模拟人类滑动的轨迹点
    Args:
        target_x: 目标 x 坐标 (云码返回)
        start_x: 起始 x 坐标 (默认为滑块的初始位置)
        base_y: 基准 y 坐标
        total_duration_ms: 总时长(ms), None 则自动计算 (200-600ms)
    Returns:
        [{x, y, t}, ...] 轨迹点数组, t 为相对时间(ms)
    """
    distance = target_x - start_x
    if distance <= 0:
        distance = 100

    # 自动计算总时长: 100-300px → 200-400ms, >300px → 400-800ms
    if total_duration_ms is None:
        total_duration_ms = int(200 + distance * 1.5 + random.uniform(-50, 100))
        total_duration_ms = max(150, min(800, total_duration_ms))

    # 五段式轨迹参数
    # 阶段1: 慢启动 (0-15%)     — 从静止开始移动
    # 阶段2: 加速段 (15-50%)    — 快速滑动
    # 阶段3: 匀速段 (50-80%)    — 稳定速度
    # 阶段4: 减速段 (80-95%)    — 接近目标时减速
    # 阶段5: 微调段 (95-100%)   — 微小调整后释放

    phases = [
        (0.00, 0.15, 0.20),   # 慢启动, 占总时长 20%
        (0.15, 0.50, 0.30),   # 加速, 30%
        (0.50, 0.80, 0.25),   # 匀速, 25%
        (0.80, 0.95, 0.15),   # 减速, 15%
        (0.95, 1.00, 0.10),   # 微调, 10%
    ]

    # 生成时间点
    points = []
    current_time = 0

    # 起始点
    points.append({"x": float(start_x), "y": float(base_y), "t": 0.0})
    current_time += random.randint(30, 80)  # 初始反应时间

    for phase_start, phase_end, time_ratio in phases:
        phase_duration = total_duration_ms * time_ratio
        phase_distance = distance * (phase_end - phase_start)

        # 该阶段采样点数 (每 5-15ms 一个点)
        sample_count = max(3, int(phase_duration / random.uniform(5, 15)))

        for i in range(1, sample_count + 1):
            progress = i / sample_count

            if phase_start < 0.15 or phase_start > 0.95:  # 慢启动和微调段
                # 使用缓入缓出曲线
                eased = _ease_in_out(progress)
            elif phase_start < 0.50:  # 加速段
                eased = _ease_in(progress)
            elif phase_start < 0.80:  # 匀速段
                eased = progress  # 线性
            else:  # 减速段
                eased = _ease_out(progress)

            x = start_x + distance * (phase_start + (phase_end - phase_start) * eased)
            # y 轴带微小抖动
            y = base_y + random.uniform(-2, 2)
            t = current_time + phase_duration * progress / sample_count

            points.append({"x": round(x, 1), "y": round(y, 1), "t": round(t, 1)})

        current_time += phase_duration

    # 最终停顿 (释放前微停顿)
    last = points[-1]
    points.append({
        "x": float(target_x),
        "y": float(base_y) + random.uniform(-0.5, 0.5),
        "t": round(last["t"] + random.randint(50, 150), 1),
    })

    return points


def _ease_out(t: float) -> float:
    """缓出曲线: 快速开始，缓慢结束"""
    return 1 - math.pow(1 - t, 3)


def _ease_in(t: float) -> float:
    """缓入曲线: 缓慢开始，快速结束"""
    return math.pow(t, 3)


def _ease_in_out(t: float) -> float:
    """缓入缓出曲线"""
    if t < 0.5:
        return 2 * t * t
    else:
        return 1 - math.pow(-2 * t + 2, 2) / 2
