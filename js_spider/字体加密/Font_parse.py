import matplotlib

matplotlib.use('TkAgg')  # 或 'Qt5Agg'，具体取决于您安装的支持包

import ddddocr
import matplotlib.pyplot as plt
# 处理字体文件库
from fontTools.ttLib import TTFont
# # 加载字体文件
from lxml import etree


class TTFont_parse():
    def __init__(self, woff):
        self.font = TTFont(woff)
        self.font.saveXML('file1.xml')

    def paint(self, xy_list, TTGlyph_name):
        plt.figure(figsize=(10, 10))
        # 遍历每个图案
        for shape in xy_list:
            # 提取 x 和 y 坐标
            x, y = zip(*[(int(point[0]), int(point[1])) for point in shape])

            # 绘制多边形
            plt.plot(x, y, marker='o')  # 连接点的多边形
            plt.fill(x, y, alpha=0.3)  # 填充多边形
        plt.xticks([])  # 隐藏x轴刻度标签
        plt.yticks([])
        # 设置绘图属性
        plt.axis('equal')  # 坐标轴比例一致
        plt.grid(True)
        # plt.show()
        plt.savefig("图片/" + TTGlyph_name[0] + ".png")

    def pic_ocr(self, TTGlyph_name):
        ocr = ddddocr.DdddOcr(show_ad=False)

        with open("图片/" + TTGlyph_name[0] + ".png", 'rb') as f:
            image = f.read()

        res = 0 if ocr.classification(image) == "D" else ocr.classification(image)
        return res

    def parse_font(self, tt):
        if tt.xpath('./contour[1]'):
            xy_list = []
            TTGlyph_name = tt.xpath('./@name')
            # TTGlyph_xy = [(x,y) for x,y in zip(tt.xpath('./contour/pt/@x'), tt.xpath('./contour/pt/@y'))]
            contour_list = tt.xpath('./contour')
            for contour in contour_list:
                TTGlyph_xy = [(x, y) for x, y in zip(contour.xpath('./pt/@x'), contour.xpath('./pt/@y'))]
                TTGlyph_xy.append(TTGlyph_xy[0])
                xy_list.append(TTGlyph_xy)

            self.paint(xy_list, TTGlyph_name)
            res = self.pic_ocr(TTGlyph_name)

            # print(res)
            # print(for i in xy_list)
            # print(xy_list)
            return (TTGlyph_name[0], res)

    def main(self):
        ziti = {}
        # 由于 lxml 解析的 XML 数据中包含了编码声明（如 <?xml version="1.0" encoding="UTF-8"?>）时，直接传递字符串而不是字节流引发的。
        xml_data = open('file1.xml').read().encode('utf-8')
        # 解析 XML 数据
        root = etree.fromstring(xml_data)
        TTGlyph_list = root.xpath('//glyf/TTGlyph')
        for tt in TTGlyph_list[1:-1]:
            key, value = self.parse_font(tt)
            ziti[key] = int(value)
        return ziti


if __name__ == '__main__':
    zt = TTFont_parse('猫眼字体.woff')
    print(zt.main())
