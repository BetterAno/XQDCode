"""
目标： 兰州交通大学招标信息采集
url： https://zbzx.lzjtu.edu.cn/zbxx/hwl.htm https://zbzx.lzjtu.edu.cn/zbxx/gcl.htm https://zbzx.lzjtu.edu.cn/zbxx/fwl.htm
特点： 瑞数
数据要求： 标题、日期，存于MySQL
"""
import re

import requests
from parsel import Selector
import pymysql

class LzjtuSpider:
    def __init__(self):
        self.headers = {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "Accept-Language": "zh-TW,zh;q=0.9",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "DNT": "1",
            "Pragma": "no-cache",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "none",
            "Sec-Fetch-User": "?1",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36",
            "sec-ch-ua": "\"Google Chrome\";v=\"135\", \"Not-A.Brand\";v=\"8\", \"Chromium\";v=\"135\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\""
        }
        self.url = "https://zbzx.lzjtu.edu.cn/zbxx/"
        self.session = requests.Session()
        import subprocess
        from functools import partial
        subprocess.Popen = partial(subprocess.Popen, encoding="utf-8")
        import execjs
        self.execjs = execjs
        # self.conn = pymysql.connect(host='localhost', user='root', password='root', db='spiders_test')

    def set_cookies(self):
        url = self.url + 'hwl.htm'
        response = self.session.get(url, headers=self.headers)

        selector = Selector(text=response.text)
        script = selector.css("script::text").get()
        content = selector.css("meta::attr(content)").extract()[1]
        with open('gen_cookie.js', 'r', encoding='utf-8') as f:
            js_code = f.read().replace('!"ts_flag";', script)
        with open('tmp.js', 'w', encoding='utf-8') as f:
            f.write(js_code)
        with open('./env/document_model.js', 'r', encoding='utf-8') as f:
            js_code = f.read().replace('!content_flag', content)
        with open('./env/document.js', 'w', encoding='utf-8') as f:
            f.write(js_code)

        js = self.execjs.compile(open('tmp.js', 'r', encoding='utf-8').read())
        new_cookie = js.call("gen_cookie")
        self.session.cookies.update({new_cookie['name']: new_cookie['value']})

    def send_req(self, url):
        response = self.session.get(url, headers=self.headers)
        response.encoding = 'utf-8'
        return response.text

    def parse(self, html, href):
        selector = Selector(text=html)
        data_list = selector.css('.listmain ul li')
        result = []
        for data in data_list:
            item = dict()
            item['title'] = data.css('a::attr(title)').get()
            item['date'] = re.findall(r"\[(.*?)\]", data.css('p::text').get())[0]
            result.append(item)
        print(result)
        # self.save_data(result)
        # next_page = selector.css('a.Next::attr(href)').get()
        # if next_page:
        #     if '/' not in next_page:
        #         if '/' in href:
        #             next_href = href.split('/')[0] + '/' + next_page
        #         else:
        #             next_href = href.split('.')[0] + '/' + next_page
        #     else:
        #         next_href = next_page
        #     self.get_page(next_href)

    def save_data(self, result):
        for item in result:
            with self.conn.cursor() as cursor:
                sql_insert = """
                             INSERT INTO `lzjtu`(title, \
                                                  date) \
                             VALUES (%s, %s); \
                             """
                try:
                    cursor.execute(sql_insert, tuple(item.values()))
                    self.conn.commit()
                except Exception as e:
                    self.conn.rollback()
                    print('数据插入失败：', tuple(item.values()), '错误信息：', e)

    def get_page(self, href):
        html = self.send_req(self.url + href)
        self.parse(html, href)

    def main(self):
        self.set_cookies()
        href_list = ['hwl.htm', 'gcl.htm', 'fwl.htm']
        for href in href_list:
            self.get_page(href)


if __name__ == '__main__':
    spider = LzjtuSpider()
    spider.main()
