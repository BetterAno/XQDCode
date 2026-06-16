import re
import threading
import time
from queue import Queue

import execjs
import pymysql
import requests
from dbutils.pooled_db import PooledDB
from lxml import etree


class LZJD:
    def __init__(self):
        self.cookies = {}
        self.headers = {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Pragma": "no-cache",
            "Referer": "https://zbzx.lzjtu.edu.cn/zbxx/hwl.htm",
            "Sec-Fetch-Dest": "document",
            "Sec-Fetch-Mode": "navigate",
            "Sec-Fetch-Site": "same-origin",
            "Sec-Fetch-User": "?1",
            "Upgrade-Insecure-Requests": "1",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36",
            "sec-ch-ua": "\"Chromium\";v=\"142\", \"Google Chrome\";v=\"142\", \"Not_A Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\""
        }
        self.url_list = [
            'https://zbzx.lzjtu.edu.cn/zbxx/hwl.htm',  # /hwl/1.htm /hwl/2.htm
            'https://zbzx.lzjtu.edu.cn/zbxx/gcl.htm',
            'https://zbzx.lzjtu.edu.cn/zbxx/fwl.htm'
        ]
        self.pool = PooledDB(
            creator=pymysql,  # 使用链接数据库的模块
            maxconnections=6,  # 连接池允许的最大连接数, 0和None表示不限制
            mincached=3,  # 初始化时, 连接池中至少创建的空闲的连接
            maxcached=5,  # 连接池中最多闲置的连接, 0和None不限制
            maxshared=3,  # 设置线程之间的共享连接
            blocking=True,  # 连接耗尽则等待直至有可用的连接为止
            maxusage=None,  # 一个连接最多被重复使用的次数, None表示无限制
            setsession=[],  # 开始会话前执行的命令列表
            ping=0,
            host='localhost',
            port=3306,
            user='root',
            password='123456',
            database='py_spider',
            charset='utf8'
        )
        self.url_queue = Queue()
        self.text_queue = Queue()
        self.dict_queue = Queue()

    def get_cookie(self):
        response = requests.get('https://zbzx.lzjtu.edu.cn/zbxx/hwl.htm', headers=self.headers)
        encrypt_code = re.findall(r"type=\"text/javascript\" r='m'>(.*?)</script><script", response.text)[0]
        with open('兰州交大瑞数6.js', 'r', encoding='utf-8') as f:
            js_code = f.read().replace('encrypt_js_code', encrypt_code)
        evbSrBv8QGpBP = execjs.compile(js_code).call('get_cookie').split('evbSrBv8QGpBP=')[1]
        evbSrBv8QGpBO = response.cookies.get('evbSrBv8QGpBO')
        cookies = {
            'evbSrBv8QGpBP': evbSrBv8QGpBP,
            'evbSrBv8QGpBO': evbSrBv8QGpBO
        }
        self.cookies = cookies

    def get_url(self):
        for url in self.url_list:
            if url == 'https://zbzx.lzjtu.edu.cn/zbxx/hwl.htm':
                self.url_queue.put(url)
                for page in range(1, 3):
                    self.url_queue.put(url.replace('hwl.htm', f'hwl/{page}.htm'))
            elif url == 'https://zbzx.lzjtu.edu.cn/zbxx/gcl.htm':
                self.url_queue.put(url)
            elif url == 'https://zbzx.lzjtu.edu.cn/zbxx/fwl.htm':
                self.url_queue.put(url)
                for page in range(1, 29):
                    self.url_queue.put(url.replace('fwl.htm', f'fwl/{page}.htm'))

    def req_data(self):
        while True:
            url = self.url_queue.get()
            self.url_queue.task_done()
            response = requests.get(url, headers=self.headers, cookies=self.cookies)
            response.encoding = 'utf-8'
            print(response.status_code)
            self.text_queue.put(response.text)

    def parse_data(self):
        while True:
            tree = etree.HTML(self.text_queue.get())
            self.text_queue.task_done()
            sort = tree.xpath('//div[@class="weizhi"]/span/text()')[0]
            title_list = tree.xpath('//div[@class="listmain"]/ul/li/a/text()')
            date_list = [x[1:-1] for x in tree.xpath('//div[@class="listmain"]/ul/li/p/text()')]
            dict_info = {'sort': sort, 'title_list': title_list, 'date_list': date_list}
            self.dict_queue.put(dict_info)

    def create_table(self):
        with self.pool.connection() as db:
            with db.cursor() as cursor:
                try:
                    # 创建表的SQL语句
                    create_table_query = """
                            CREATE TABLE IF NOT EXISTS lzjd (
                                id INT AUTO_INCREMENT PRIMARY KEY,
                                sort VARCHAR(50) NOT NULL,
                                title VARCHAR(500) NOT NULL,
                                date VARCHAR(20) NOT NULL
                            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
                            """
                    # 执行创建表操作
                    cursor.execute(create_table_query)
                    print("表创建成功...")
                except Exception as e:
                    print(f"创建表出错: {e}")

    def save_data(self):
        while True:
            with self.pool.connection() as db:
                with db.cursor() as cursor:
                    dict_info = self.dict_queue.get()
                    self.dict_queue.task_done()
                    for title, date in zip(dict_info['title_list'], dict_info['date_list']):
                        value = (dict_info['sort'], title, date)
                        sql = """
                    insert into lzjd(sort, title, date) values (%s, %s, %s);
                    """
                        try:
                            cursor.execute(sql, value)
                            db.commit()
                            print('保存数据成功:', dict_info['sort'], title, date)
                        except Exception as e:
                            print('保存数据失败:', e)
                            db.rollback()

    def main(self):
        start = time.time()
        self.get_cookie()
        self.create_table()

        # 初始化线程对象列表
        thread_obj_list = list()

        # 有限循环任务无需使用守护线程, 直接启动即可
        get_url_thread = threading.Thread(target=self.get_url)
        get_url_thread.start()
        get_url_thread.join()

        # 创建发送请求的对象并加入到线程对象列表中
        for _ in range(3):
            req_data_thread = threading.Thread(target=self.req_data)
            thread_obj_list.append(req_data_thread)

        # 创建数据解析的对象并加入到线程对象列表中
        for _ in range(3):
            parse_data_thread = threading.Thread(target=self.parse_data)
            thread_obj_list.append(parse_data_thread)

        # 创建数据保存的对象并加入到线程对象列表中
        for _ in range(3):
            save_data_thread = threading.Thread(target=self.save_data)
            thread_obj_list.append(save_data_thread)

        # 循环线程列表, 设置线程为守护线程并启动
        for thread_obj in thread_obj_list:
            thread_obj.daemon = True
            thread_obj.start()

        # 判断所有队列中的计数器是否为零, 如果为零则结束程序, 否则让主线程阻塞
        for q in [self.url_queue, self.text_queue, self.dict_queue]:
            q.join()

        print('主线程结束...')

        end = time.time()
        print('总耗时:', end - start)


if __name__ == '__main__':
    lzjd = LZJD()
    lzjd.main()
