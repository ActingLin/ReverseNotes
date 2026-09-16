# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html

import datetime

import pymysql

# useful for handling different item types with a single interface
from itemadapter import ItemAdapter

# 源站的 public_date 是 UTC 时间（形如 2026-09-07T15:32:09Z，结尾带 Z），
# 入库时统一转成北京时间。想改成存 UTC 的话，把这里改成 0 即可。
PUBLIC_DATE_UTC_OFFSET_HOURS = 8


class Che168ToDbPipeline:
    """把车辆数据写入 Docker 里的 MySQL（库/表见 sql/create_table.sql）。

    两个要点：

    1. 去重靠主键 `info_id`。同一辆车会出现在多个地区的列表里（比如合肥列表里
       混着武汉的车源），这是正常的，不在爬取阶段过滤 —— 用
       `INSERT ... ON DUPLICATE KEY UPDATE` 让重复爬到的车刷新信息，
       既不报错也不会产生重复行。

    2. 攒够 BATCH_SIZE 条才写一次库。一条一条 execute 加 commit 会慢到无法接受，
       executemany 批量提交快得多。

    注意：本管道用 `getattr(item, 列名)` 取值，所以**表列名必须和
    items.py 的字段名保持一致**。改表结构时两边要一起改。
    """

    # 每攒够多少条写一次库
    BATCH_SIZE = 200

    # 与 car_info 表的业务列一一对应（created_at / updated_at 由数据库自动维护，不在此列）
    COLUMNS = [
        'info_id', 'car_name', 'specid', 'price', 'guide_price', 'mileage',
        'reg_date', 'province_id', 'city_id', 'city_name', 'dealer_id',
        'detail_url', 'img_url', 'is_newcar', 'is_credit', 'is_cpl',
        'is_afteraudit', 'is_recom', 'public_date', 'query_id', 'recom_id',
        'page', 'pos', 'car_unit',
    ]

    def __init__(self, db_config):
        self.db_config = db_config
        self.crawler = None
        self.conn = None
        self.cursor = None
        self.buffer = []
        self.insert_sql = None
        self.item_count = 0

    @classmethod
    def from_crawler(cls, crawler):
        pipeline = cls(crawler.settings.getdict('DB_CONFIG'))
        # Scrapy 2.18 起这三个钩子不再接收 spider 参数，要自己从 crawler 取
        pipeline.crawler = crawler
        return pipeline

    @property
    def spider(self):
        return self.crawler.spider

    # ------------------------------------------------------------------ 生命周期
    def open_spider(self):
        cfg = dict(self.db_config)
        if not cfg.get('password'):
            raise RuntimeError(
                "DB_CONFIG['password'] 是空的。它取自环境变量 CHE168_DB_PASSWORD，"
                "运行爬虫前先设置，例如：\n"
                "    CHE168_DB_PASSWORD=你的密码 scrapy crawl che168_info -a areapy=hefei"
            )

        self.conn = pymysql.connect(**cfg)
        self.cursor = self.conn.cursor()

        cols = ','.join(f'`{c}`' for c in self.COLUMNS)
        holders = ','.join(['%s'] * len(self.COLUMNS))
        updates = ','.join(f'`{c}`=VALUES(`{c}`)' for c in self.COLUMNS if c != 'info_id')
        self.insert_sql = (
            f'INSERT INTO car_info ({cols}) VALUES ({holders}) '
            f'ON DUPLICATE KEY UPDATE {updates}'
        )

        self.spider.logger.warning(
            "已连接 MySQL %s:%s/%s，写入表 car_info",
            cfg.get('host'), cfg.get('port'), cfg.get('db'),
        )

    def close_spider(self):
        try:
            self._flush()
        finally:
            if self.cursor:
                self.cursor.close()
            if self.conn:
                self.conn.close()
        self.spider.logger.warning("本次共写入/更新 %d 条", self.item_count)

    # ------------------------------------------------------------------ 处理每条
    def process_item(self, item):
        self.buffer.append(self._to_row(item))
        if len(self.buffer) >= self.BATCH_SIZE:
            self._flush()
        return item

    # ------------------------------------------------------------------ 内部方法
    def _to_row(self, item):
        """按 COLUMNS 顺序把 item 转成参数元组。

        列名和 items.py 的字段名同名，所以直接 getattr 取；只有 public_date
        需要额外把 UTC 字符串转成 datetime。
        """
        row = []
        for col in self.COLUMNS:
            value = getattr(item, col, None)
            if col == 'public_date':
                value = self._parse_public_date(value)
            row.append(value)
        return tuple(row)

    @staticmethod
    def _parse_public_date(value):
        """'2026-09-07T15:32:09Z' -> 北京时间 datetime。

        源数据是 UTC，直接塞进 DATETIME 列会差 8 小时。解析失败返回 None，
        不让一条脏数据把整批写库搞挂。
        """
        if not value:
            return None
        try:
            utc = datetime.datetime.strptime(value, '%Y-%m-%dT%H:%M:%SZ')
        except (ValueError, TypeError):
            return None
        return utc + datetime.timedelta(hours=PUBLIC_DATE_UTC_OFFSET_HOURS)

    def _flush(self):
        if not self.buffer:
            return
        count = len(self.buffer)
        try:
            self.cursor.executemany(self.insert_sql, self.buffer)
            self.conn.commit()
        except Exception:
            # 回滚后抛出去：宁可让爬虫报错停下，也不要静默丢数据
            self.conn.rollback()
            self.spider.logger.error("批量写入失败（%d 条），最后一条的 info_id=%s",
                                     count, self.buffer[-1][0])
            raise
        self.item_count += count
        self.buffer.clear()


# ============================================================================
# 以下是原来写 CSV 的版本，保留备查。想临时切回 CSV 输出的话，
# 把 ITEM_PIPELINES 指向 Che168ToDbCsvPipeline 即可。
# ============================================================================
#
# class Che168ToDbCsvPipeline:
#     """把车辆数据写进 car_info_b.csv（调试用）。
#
#     注意：文件以 'w' 模式打开，每次运行都会**覆盖**上一次的内容。
#     """
#
#     def __init__(self):
#         self.f = None
#         self.csv_writer = None
#
#     @classmethod
#     def from_crawler(cls, crawler):
#         pipeline = cls()
#         pipeline.crawler = crawler  # 保存 crawler，之后可通过 crawler.spider 访问
#         return pipeline
#
#     # 开启爬虫的时候执行一次
#     def open_spider(self):
#         # 创建文件对象
#         self.f = open('car_info_b.csv', 'w', encoding='utf-8', newline='')
#         # 以字典形式写入
#         self.csv_writer = csv.DictWriter(self.f, fieldnames=[
#             "信息ID",
#             "车辆完整名称",
#             "规格配置ID",
#             "当前售价",
#             "新车指导价",
#             "行驶里程",
#             "上牌日期",
#             "省份ID",
#             "城市ID",
#             "城市名称",
#             "经销商ID",
#             "详情页相对路径",
#             "缩略图URL",
#             "是否新车",
#             "是否支持贷款",
#             "是否已售",
#             "审核状态码",
#             "推荐级别",
#             "发布日期时间",
#             "查询会话ID",
#             "推荐ID",
#             "当前页码",
#             "在列表中的位置"
#         ])
#         # 写入表头
#         self.csv_writer.writeheader()
#
#     # 实现对item数据的处理
#     def process_item(self, item):
#         # 取出item对象中的数据
#         # self.f.write(item.infoid + '\n')
#         # self.f.write(item.car_name + '\n')
#         # self.f.write(item.specid + '\n')
#
#         dic = {
#             "信息ID": item.info_id,
#             "车辆完整名称": item.car_name,
#             "规格配置ID": item.specid,
#             "当前售价": item.price,
#             "新车指导价": item.guide_price,
#             "行驶里程": item.mileage,
#             "上牌日期": item.reg_date,
#             "省份ID": item.province_id,
#             "城市ID": item.city_id,
#             "城市名称": item.city_name,
#             "经销商ID": item.dealer_id,
#             "详情页相对路径": item.detail_url,
#             "缩略图URL": item.img_url,
#             "是否新车": item.is_newcar,
#             "是否支持贷款": item.is_credit,
#             "是否已售": item.is_cpl,
#             "审核状态码": item.is_afteraudit,
#             "推荐级别": item.is_recom,
#             "发布日期时间": item.public_date,
#             "查询会话ID": item.query_id,
#             "推荐ID": item.recom_id,
#             "当前页码": item.page,
#             "在列表中的位置": item.pos
#         }
#         self.csv_writer.writerow(dic)
#
#         return item
#
#     # 关闭爬虫的时候执行一次
#     def close_spider(self):
#         self.f.close()
