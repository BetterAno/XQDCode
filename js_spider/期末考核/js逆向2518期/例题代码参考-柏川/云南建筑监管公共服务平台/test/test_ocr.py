'''
    根据背景图和小图，生成滑块坐标
'''

import ddddocr


class CoordinateGenerator:
    def __init__(self, bg, font):
        self.bg = bg
        self.font = font
        self.det = ddddocr.DdddOcr(det=False, ocr=False)

    def base_slider(self):
        with open(self.font, 'rb') as f:
            target_bytes = f.read()

        with open(self.bg, 'rb') as f:
            background_bytes = f.read()

        return self.det.slide_match(target_bytes, background_bytes, simple_target=True)

    def test(self):
        print(self.base_slider())


if __name__ == '__main__':
    coor = CoordinateGenerator('bg.jpeg', 'front.jpeg')
    coor.test()
