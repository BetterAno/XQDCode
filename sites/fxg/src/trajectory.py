"""
滑块轨迹生成模块
生成符合字节跳动验证码规律的滑动轨迹
"""
import random
import math
import time


class TrajectoryGenerator:
    """滑块轨迹生成器"""
    
    def __init__(self):
        pass
    
    def generate(self, distance, tip_y=68):
        """
        生成滑动轨迹
        :param distance: 滑动距离(像素)
        :param tip_y: 滑块Y坐标
        :return: 轨迹列表 [(x, y, timestamp), ...]
        """
        trajectory = []
        
        # 总时长 1.2-2.5秒
        total_time = random.randint(1200, 2500)
        
        # 轨迹点数 60-80个
        num_points = random.randint(60, 80)
        
        # 起始位置
        start_x = 0
        start_y = tip_y
        
        # 生成轨迹
        current_x = 0
        current_y = start_y
        current_time = 0
        
        for i in range(num_points):
            # 进度比例
            progress = i / (num_points - 1)
            
            # 使用缓动函数模拟自然滑动
            # 先加速后减速
            if progress < 0.3:
                # 加速阶段
                ease_progress = self._ease_in_quad(progress / 0.3) * 0.3
            elif progress < 0.8:
                # 匀速阶段
                ease_progress = 0.3 + (progress - 0.3) * 0.7
            else:
                # 减速阶段
                ease_progress = 0.3 + 0.7 * self._ease_out_quad((progress - 0.8) / 0.2)
            
            # 计算X坐标
            target_x = distance * ease_progress
            current_x = int(target_x + random.uniform(-1, 1))
            
            # Y坐标微调(模拟人手抖动)
            y_offset = random.uniform(-2, 2)
            current_y = int(start_y + y_offset)
            
            # 时间戳
            time_progress = self._ease_in_out_quad(progress)
            current_time = int(total_time * time_progress)
            
            trajectory.append([current_x, current_y, current_time])
        
        # 确保最后一点到达目标位置
        trajectory[-1] = [distance, start_y, total_time]
        
        return trajectory
    
    def _ease_in_quad(self, t):
        """加速缓动"""
        return t * t
    
    def _ease_out_quad(self, t):
        """减速缓动"""
        return 1 - (1 - t) * (1 - t)
    
    def _ease_in_out_quad(self, t):
        """先加速后减速"""
        if t < 0.5:
            return 2 * t * t
        return 1 - math.pow(-2 * t + 2, 2) / 2
    
    def to_captcha_format(self, trajectory):
        """
        转换为验证码格式
        :param trajectory: 轨迹列表
        :return: 格式化后的轨迹数据
        """
        # 字节跳动验证码轨迹格式
        # [[x1, y1, t1], [x2, y2, t2], ...]
        return trajectory


# 测试
if __name__ == "__main__":
    generator = TrajectoryGenerator()
    
    # 测试生成200px距离的轨迹
    distance = 200
    trajectory = generator.generate(distance)
    
    print(f"轨迹点数: {len(trajectory)}")
    print(f"总时长: {trajectory[-1][2]}ms")
    print(f"起点: {trajectory[0]}")
    print(f"终点: {trajectory[-1]}")
    print(f"\n前5个点:")
    for i, point in enumerate(trajectory[:5]):
        print(f"  {i}: x={point[0]}, y={point[1]}, t={point[2]}ms")
