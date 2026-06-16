import scrapy
from scrapy.http import HtmlResponse


class YShangSpider(scrapy.Spider):
    name = 'YShang'
    # allowed_domains = ['www,baidu.com']
    # start_urls = ['http://www,baidu.com/']

    def parse(self, response: HtmlResponse, **kwargs):
        pass
