import numpy as np
from matplotlib import pyplot as plt


class Simulator:
    @staticmethod
    def second_order_system_simulator(
            x_target: float,
            zeta: float = 0.3,
            omega_n: float = 0.05,
            dt: float = 1,
            duration: float = 330
    ) -> list:
        """
        二阶系统时域响应仿真器

        参数：
        x_target - 目标位置（阶跃输入幅度）
        zeta - 阻尼比（默认0.5）
        omega_n - 自然频率 rad/s（默认1.0）
        dt - 采样时间间隔（秒）（默认0.1）
        duration - 总持续时间（秒）（默认5.0）

        返回：
        包含系统位置响应的列表（相对于时间的采样）
        """
        t = np.arange(0, duration, dt)

        if zeta < 0:
            raise ValueError("阻尼比不能为负数")

        # 分四种情况计算系统响应
        if zeta == 0:  # 无阻尼
            response = x_target * (1 - np.cos(omega_n * t))

        elif 0 < zeta < 1:  # 欠阻尼
            omega_d = omega_n * np.sqrt(1 - zeta ** 2)
            phi = np.arccos(zeta)
            exponent = np.exp(-zeta * omega_n * t)
            response = x_target * (1 - exponent / np.sqrt(1 - zeta ** 2) * np.sin(omega_d * t + phi))

        elif zeta == 1:  # 临界阻尼
            exponent = np.exp(-omega_n * t)
            response = x_target * (1 - (1 + omega_n * t) * exponent)

        else:  # 过阻尼
            sqrt_term = np.sqrt(zeta ** 2 - 1)
            s1 = (-zeta + sqrt_term) * omega_n
            s2 = (-zeta - sqrt_term) * omega_n
            c1 = s2 / (s2 - s1)
            c2 = s1 / (s1 - s2)
            response = x_target * (1 - c1 * np.exp(s1 * t) - c2 * np.exp(s2 * t))

        return response.tolist()

    @staticmethod
    def draw_fun(t, output):
        plt.plot(t, output)
        plt.xlabel('Time (s)')
        plt.ylabel('Position')
        plt.title('Second Order System Response')
        plt.grid(True)
        plt.show()

    def test(self):
        output = self.second_order_system_simulator(190)
        print(output)
        t = np.arange(0, 330, 1)
        self.draw_fun(t, output)


if __name__ == '__main__':
    simulator = Simulator()
    simulator.test()
