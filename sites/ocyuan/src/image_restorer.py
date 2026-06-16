"""
涂鸦验证码图片还原脚本
根据 shuffle 数组还原被切割打乱的背景图
"""

import cv2
import numpy as np
import requests
from PIL import Image
import io


class ImageRestorer:
    """验证码图片还原器"""
    
    def __init__(self):
        self.static_server = "https://images.tuyacn.com/"
    
    def download_image(self, url: str) -> np.ndarray:
        """下载图片"""
        full_url = f"{self.static_server}{url}" if not url.startswith('http') else url
        print(f"    下载: {full_url}")
        
        resp = requests.get(full_url)
        if resp.status_code == 200:
            img_array = np.array(Image.open(io.BytesIO(resp.content)))
            print(f"    ✓ 图片尺寸: {img_array.shape}")
            return img_array
        else:
            raise Exception(f"下载失败: {resp.status_code}")
    
    def restore_bg_image(self, bg_url: str, shuffle: list, 
                         rows: int = 4, cols: int = 13) -> np.ndarray:
        """
        还原背景图
        
        涂鸦验证码将图片切割成 rows x cols 的小块，然后根据 shuffle 数组打乱顺序
        需要根据 shuffle 数组还原原始顺序
        
        Args:
            bg_url: 背景图 URL
            shuffle: 打乱顺序数组
            rows: 行数（通常4行）
            cols: 列数（通常13列）
        
        Returns:
            还原后的图片
        """
        print(f"\n[1] 下载并还原背景图...")
        print(f"    shuffle 数组长度: {len(shuffle)}")
        print(f"    网格: {rows}行 x {cols}列")
        
        # 下载图片
        bg_img = self.download_image(bg_url)
        height, width = bg_img.shape[:2]
        
        # 计算每个小块的大小
        block_height = height // rows
        block_width = width // cols
        
        print(f"    图片尺寸: {width}x{height}")
        print(f"    小块尺寸: {block_width}x{block_height}")
        
        # 创建还原后的图片
        restored = np.zeros_like(bg_img)
        
        # 根据 shuffle 数组还原
        # shuffle[i] 表示第 i 个位置应该放置原始图片的第 shuffle[i] 块
        for i in range(len(shuffle)):
            # 计算当前块在还原后的位置
            dst_row = i // cols
            dst_col = i % cols
            
            # shuffle[i] 是原始图片中的块索引
            src_idx = shuffle[i]
            src_row = src_idx // cols
            src_col = src_idx % cols
            
            # 提取源块
            y1, y2 = src_row * block_height, (src_row + 1) * block_height
            x1, x2 = src_col * block_width, (src_col + 1) * block_width
            block = bg_img[y1:y2, x1:x2]
            
            # 放置到目标位置
            dst_y1, dst_y2 = dst_row * block_height, (dst_row + 1) * block_height
            dst_x1, dst_x2 = dst_col * block_width, (dst_col + 1) * block_width
            restored[dst_y1:dst_y2, dst_x1:dst_x2] = block
        
        print(f"    ✓ 图片还原完成")
        return restored
    
    def save_images(self, bg_restored: np.ndarray, slice_img: np.ndarray, 
                   bg_url: str, slice_url: str):
        """保存图片"""
        print(f"\n[2] 保存图片...")
        
        # 保存还原后的背景图
        bg_filename = f"bg_restored_{bg_url.split('/')[-1].split('.')[0]}.png"
        cv2.imwrite(bg_filename, cv2.cvtColor(bg_restored, cv2.COLOR_RGB2BGR))
        print(f"    ✓ 还原背景图: {bg_filename}")
        
        # 保存滑块图
        slice_filename = f"slice_{slice_url.split('/')[-1].split('.')[0]}.png"
        cv2.imwrite(slice_filename, cv2.cvtColor(slice_img, cv2.COLOR_RGB2BGR))
        print(f"    ✓ 滑块图: {slice_filename}")
        
        return bg_filename, slice_filename
    
    def restore_and_detect(self, bg_url: str, slice_url: str, 
                          shuffle: list) -> dict:
        """
        还原图片并检测缺口位置
        
        Args:
            bg_url: 背景图 URL
            slice_url: 滑块图 URL  
            shuffle: 打乱顺序数组
        
        Returns:
            包含还原图片和缺口位置的字典
        """
        # 1. 还原背景图
        bg_restored = self.restore_bg_image(bg_url, shuffle)
        
        # 2. 下载滑块图
        print(f"\n[2] 下载滑块图...")
        slice_img = self.download_image(slice_url)
        
        # 3. 保存图片
        bg_file, slice_file = self.save_images(bg_restored, slice_img, bg_url, slice_url)
        
        # 4. 检测缺口位置
        print(f"\n[3] 检测缺口位置...")
        gap_x = self.detect_gap(bg_restored, slice_img)
        
        return {
            "bg_restored": bg_restored,
            "slice_img": slice_img,
            "bg_file": bg_file,
            "slice_file": slice_file,
            "gap_x": gap_x
        }
    
    def detect_gap(self, bg_img: np.ndarray, slice_img: np.ndarray) -> int:
        """
        检测缺口位置（简化版）
        
        注意: 这只是一个基础实现，实际可能需要更复杂的算法
        """
        # 转换为灰度图
        bg_gray = cv2.cvtColor(bg_img, cv2.COLOR_RGB2GRAY)
        slice_gray = cv2.cvtColor(slice_img, cv2.COLOR_RGB2GRAY)
        
        # 使用模板匹配
        result = cv2.matchTemplate(bg_gray, slice_gray, cv2.TM_CCOEFF_NORMED)
        _, max_val, _, max_loc = cv2.minMaxLoc(result)
        
        gap_x = max_loc[0]
        print(f"    缺口位置: x={gap_x}, 匹配度={max_val:.3f}")
        
        return gap_x


def main():
    """测试图片还原"""
    restorer = ImageRestorer()
    
    # 从 getQuestion 响应中获取的数据
    bg_url = "yrule/images/bg/260/160/ojz1PNsninC1KN7uzIdZy02Q9vpL4JTv.webp"
    slice_url = "yrule/images/slice/260/160/ojz1PNsninC1KN7uzIdZy02Q9vpL4JTv.png"
    shuffle = [17, 35, 7, 1, 9, 42, 5, 46, 13, 11, 39, 37, 45, 15, 25, 29, 
               10, 32, 6, 49, 20, 16, 51, 23, 41, 18, 2, 0, 48, 21, 22, 33, 
               30, 24, 26, 36, 47, 3, 19, 40, 14, 28, 44, 27, 8, 4, 34, 12, 
               38, 43, 50, 31]
    
    print("="*60)
    print("涂鸦验证码图片还原")
    print("="*60)
    
    result = restorer.restore_and_detect(bg_url, slice_url, shuffle)
    
    print("\n" + "="*60)
    print("还原完成")
    print("="*60)
    print(f"还原背景图: {result['bg_file']}")
    print(f"滑块图: {result['slice_file']}")
    print(f"缺口位置: x={result['gap_x']}")


if __name__ == "__main__":
    main()
