import re
import subprocess
from functools import partial
subprocess.Popen = partial(subprocess.Popen, encoding="utf-8")
import execjs


import requests
from lxml import etree


class Qikan:
    def __init__(self):
        self.headers = {
            "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
            "accept-language": "zh-CN,zh;q=0.9",
            "cache-control": "no-cache",
            "pragma": "no-cache",
            "priority": "u=0, i",
            "referer": "https://qikan.cqvip.com/Qikan/Journal/JournalGuid?from=index",
            "sec-ch-ua": "\"Chromium\";v=\"146\", \"Not-A.Brand\";v=\"24\", \"Google Chrome\";v=\"146\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "document",
            "sec-fetch-mode": "navigate",
            "sec-fetch-site": "same-origin",
            "upgrade-insecure-requests": "1",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36"
        }
        self.index_url = "https://qikan.cqvip.com/Qikan/Journal/JournalGuid"
        self.params = {
            "from": "index"
        }
        self.ctx = None
        self.session = requests.session()

    def request_index(self):
        response = self.session.get(url=self.index_url, headers=self.headers, params=self.params)
        print('第一次请求:', response)
        encrypt_js_code = re.findall(r"type=\"text/javascript\" r='m'>(.*?)</script><script type=", response.text)[0]
        with open('encrypt_js_code.js', 'w', encoding='utf-8') as f:
            f.write(encrypt_js_code)
        self.ctx = execjs.compile(open('main.js', encoding="utf-8").read())
        HZbKHDjIEcgT = re.findall("6HZbKHDjIEcgT=(.*?); path=/;", self.ctx.call('get_cookie'))[0]
        self.session.cookies.set('6HZbKHDjIEcgT', HZbKHDjIEcgT)

    def get_data(self):
        url = "https://qikan.cqvip.com/Search/SearchList"
        # data变化的参数有
        # \"ClusterFilter\":\"ZY=320#产业经济\"
        # \"PageNum\":1
        # 这里只关心ZY=320#产业经济的数据, 改变PageNum页数即可
        data = {
            "searchParamModel": "{\"ObjectType\":7,\"SearchKeyList\":[],\"SearchExpression\":null,\"BeginYear\":null,\"EndYear\":null,\"UpdateTimeType\":null,\"JournalRange\":null,\"DomainRange\":null,\"ClusterFilter\":\"ZY=320#产业经济\",\"ClusterLimit\":0,\"ClusterUseType\":\"Article\",\"UrlParam\":\"\",\"Sort\":\"1\",\"SortField\":null,\"UserID\":\"13363468\",\"PageNum\":1,\"PageSize\":20,\"SType\":null,\"StrIds\":null,\"IsRefOrBy\":0,\"ShowRules\":\"\",\"IsNoteHistory\":0,\"AdvShowTitle\":null,\"ObjectId\":null,\"ObjectSearchType\":0,\"ChineseEnglishExtend\":0,\"SynonymExtend\":0,\"ShowTotalCount\":0,\"AdvTabGuid\":\"\"}"
        }
        response = self.session.post(url, headers=self.headers, data=data)
        print('请求数据:', response)
        html_text = response.text
        # 使用etree 和 xpath提取 gch字段
        html = etree.HTML(html_text)
        # 提取所有 href 中的 gch 参数
        gch_list = html.xpath('//td[@class="title"]//a/@href')
        print(f"\n共找到 {len(gch_list)} 个gch字段:")
        return gch_list

    # 先要获取期刊概要, 得到detail的id
    def get_summary(self, gch):
        url = "https://qikan.cqvip.com/Qikan/Journal/Summary"
        params = {
            "kind": '1',    # 所有期刊都是固定的为1
            "gch": gch  # 唯一书籍Id
        }
        print('params: ', params)
        response = self.session.get(url, headers=self.headers, params=params)
        html = etree.HTML(response.text)
        id_ = html.xpath('//div[@class="object-op"]//a[@class="attentionobjects"]/@data-journalid')[0]
        return id_

    # 根据id. 获取期刊详情信息
    def get_detail(self, id):
        url = "https://qikan.cqvip.com/Qikan/journal/Detail"
        params = {
            "kind": "0",    # 所有期刊都是固定的为0
            "id": id,  # 唯一书籍Id
            "from": "Qikan_Journal_Summary"
        }
        response = self.session.get(url, headers=self.headers, params=params)
        qk_name = etree.HTML(response.text).xpath('//div[@class="object-cover"]/img/@alt')[0]
        editor = etree.HTML(response.text).xpath('//span[text()="主编"]/following-sibling::text()')[0]
        phone_number = etree.HTML(response.text).xpath('//span[text()="电话"]/following-sibling::text()')[0]
        email = etree.HTML(response.text).xpath(
            '//span[@class="label" and text()="电子邮件"]/following-sibling::a/span/text()')[0]
        address = etree.HTML(response.text).xpath('//span[text()="地址"]/following-sibling::text()')[0]
        description = ''.join(etree.HTML(response.text).xpath('//div[@class="info-content"]/p/text()')).strip()
        print(f"期刊名称: {qk_name}", f"作者: {editor}", f"电话: {phone_number}", f"邮箱: {email}", f"地址: {address}",
              f"简介: {description}")

    def main(self):
        self.request_index()
        gch_list = self.get_data()
        for gch in gch_list:
            print(f"开始处理: {gch.split('gch=')[1]}")
            id_ = self.get_summary(gch.split('gch=')[1])
            self.get_detail(id_)
            return


if __name__ == '__main__':
    qikan = Qikan()
    qikan.main()
