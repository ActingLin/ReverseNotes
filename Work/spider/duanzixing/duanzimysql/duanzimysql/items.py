# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class DuanzimysqlItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    # 定义了要存储的字段，存其他字段则报错
    title = scrapy.Field()
    content = scrapy.Field()
