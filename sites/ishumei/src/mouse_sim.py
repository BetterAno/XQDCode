"""
鼠标轨迹模拟模块

生成仿真的鼠标移动轨迹, 格式: [[x, y, t], ...]
- x: 相对起始点的X偏移
- y: 相对起始点的Y偏移
- t: 距起始时间的毫秒数
- 100ms采样间隔, 最多100个点
"""

import random
import math


def generate_trajectory(target_x: int, css_width: int = 300,
                        duration_ms: int = None) -> list:
    """
    生成从起点到目标X的鼠标轨迹

    Args:
        target_x: 目标X位置 (图片坐标系, 0-600)
        css_width: CSS渲染宽度 (300)
        duration_ms: 总耗时(ms), 默认随机800-1500

    Returns:
        [[x, y, t], ...] 轨迹数组
    """
    # 将目标从图片坐标转换为CSS坐标
    target_css_x = target_x * (css_width / 600)

    if duration_ms is None:
        duration_ms = random.randint(800, 1500)

    # 采样点数量 (100ms间隔)
    num_points = min(duration_ms // 100, 100)
    if num_points < 3:
        num_points = 3

    trajectory = []
    for i in range(num_points):
        t = (i + 1) * 100
        if t > duration_ms:
            t = duration_ms

        # 进度: 使用 ease-out 曲线
        progress = _ease_out_cubic(i / max(num_points - 1, 1))

        # X: 沿贝塞尔曲线移动
        x = target_css_x * progress
        x += random.uniform(-1.5, 1.5) if i < num_points - 1 else 0

        # Y: 轻微随机抖动 (±3px)
        y = random.uniform(-3, 3) if i < num_points - 1 else 0

        trajectory.append([
            round(x, 1),
            round(y, 1),
            t
        ])

    # 确保最后一个点精确
    trajectory[-1][0] = round(target_css_x, 1)
    trajectory[-1][1] = 0
    trajectory[-1][2] = duration_ms

    return trajectory, duration_ms


def _ease_out_cubic(t: float) -> float:
    """缓出三次曲线"""
    return 1 - (1 - t) ** 3


def generate_mouse_data(target_x: int, bg_width: int = 600,
                        css_width: int = 300):
    """
    生成完整鼠标数据 (与SDK saveMouseData对应)

    Returns:
        (mouse_data, duration_ms, wi_ratio)
        - mouse_data: [[x,y,t], ...]
        - duration_ms: 拖动耗时
        - wi_ratio: mouseEndX / trueWidth (用于wi参数)
    """
    mouse_data, duration_ms = generate_trajectory(target_x, css_width)

    # 最终X位置 (CSS坐标)
    mouse_end_x = target_x * (css_width / bg_width)
    wi_ratio = mouse_end_x / css_width

    return mouse_data, duration_ms, wi_ratio


if __name__ == '__main__':
    # 测试: 目标缺口在 x=200 (图片坐标)
    target = 200
    data, dur, ratio = generate_mouse_data(target)
    print(f"目标: x={target}, 耗时: {dur}ms, wi比值: {ratio:.4f}")
    print(f"轨迹点数: {len(data)}")
    print(f"前3点: {data[:3]}")
    print(f"最后点: {data[-1]}")
