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

        return self.det.slide_match(target_bytes, background_bytes)

    def test(self):
        print(self.base_slider())


if __name__ == '__main__':
    coor = CoordinateGenerator('./image/13db0858ce0d4ae5b966ac03a01a75b2.png', './image/8d6112e9b2f84f039a967eb8a787a719.png')
    coor.test()
