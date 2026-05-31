# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter
import pymysql

class DuanzimysqlPipeline:
    def __init__(self):
        self.cursor = None
        self.db = None

    # 开启爬虫的时候执行一次
    def open_spider(self, spider):
        # 数据库的连接
        self.db = pymysql.connect(
            host='127.0.0.1',
            port=3306,
            db='duanzi',
            user='root',
            password='改成自己的mysql密码',
            charset='utf8'
        )
        # 创建游标对象
        self.cursor = self.db.cursor()

    # 实现对item数据的处理
    def process_item(self, item, spider):
        # 取出item对象中的数据
        try:
            # 拼接sql
            sql = f'insert into duanzi(title,content) values("{item["title"]}","{item["content"]}")'
            # 执行sql语句
            self.cursor.execute(sql)
            # 提交事务
            self.db.commit()
        except Exception as e:
            print(e, sql)
            # 失败就回滚
            self.db.rollback()
        return item

    # 关闭爬虫的时候执行一次
    def close_spider(self, spider):
        self.db.close()
