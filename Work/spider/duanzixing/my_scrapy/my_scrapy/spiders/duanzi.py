import scrapy
from my_scrapy.items import MyScrapyItem

class DuanziSpider(scrapy.Spider):
    # 实例化item
    item = MyScrapyItem()
    # 爬虫名字
    name = "duanzi"
    # 允许爬取的范围，防止爬虫爬到别的网站
    allowed_domains = ['duanzixing.com']
    # 开始爬取的url地址
    start_urls = ['http://duanzixing.com/']

    # 数据提取的方法，接受下载中间件传过来的response 是重写父类中的parse方法
    def parse(self, response, **kwargs):
        # print(response.text)
        article_list = response.xpath('//article[@class="excerpt"]')

        for article in article_list:
            dit_data = {}
            # 获取标题
            title = article.xpath('./header/h2/a/text()').extract_first()
            # 获取内容
            content = article.xpath('./p[@class="note"]//text()').extract_first()
            # print(content)

            item['title'] = title
            item['content'] = content
            yield dit_data