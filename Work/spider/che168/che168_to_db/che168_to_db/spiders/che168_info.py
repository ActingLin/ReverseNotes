"""车168 二手车列表爬虫（自动翻页 + 按价格分片）。

用法：

    scrapy crawl che168_info -a areapy=hefei                  # 爬合肥全部页
    scrapy crawl che168_info -a areapy=beijing                # 北京车多，会自动分片
    scrapy crawl che168_info -a areapy=china -a max_pages=2   # 限 2 页调试

areapy 取值见项目根目录 areas.json（如 hefei / anhui / china）。

工作流程：

    1. 先抓不限价的第 1 页，从「全部车源(N)」读出该地区车源总数。
    2. N ≤ 5600：直接翻页到最后一页。
       N > 5600：**站点只让翻 100 页**（实测第 101 页起固定返回第 100 页的内容，
       改页码拿不到更多数据），所以改为按价格档位各抓一遍，再把结果按主键去重。
    3. 每个价格档内部照常翻页。

关于 5600 这个数：100 页 × 每页 56 条。站点没有任何地方保证每页一定是 56 条，
所以阈值取的是「一整页都不浪费」的保守值；即便某页少几条，也只是多抓一个档位，不会漏数据。
"""
import re

import scrapy
from che168_to_db.items import Che168ToDbItem


class Che168InfoSpider(scrapy.Spider):
    name = "che168_info"
    allowed_domains = ["www.che168.com"]

    # 列表页 URL 模板：页码藏在路径的 csp{N} 里
    # 例 https://www.che168.com/hefei/a0_0msdgscncgpi1ltocsp3exx0/?pvareaid=102179
    LIST_URL_TPL = (
        "https://www.che168.com/{areapy}/a0_0msdgscncgpi1ltocsp{page}exx0/"
        "?pvareaid=102179"
    )
    # 带价格筛选的列表页：价格段插在地区后面
    # 例 https://www.che168.com/beijing/10_15/a0_0msdgscncgpi1ltocsp2exx0/?pvareaid=102179
    FILTERED_URL_TPL = (
        "https://www.che168.com/{areapy}/{lo}_{hi}/a0_0msdgscncgpi1ltocsp{page}exx0/"
        "?pvareaid=102179"
    )

    # 站点最多只让翻 100 页：实测第 101 页起会固定返回第 100 页的内容
    # （不是随机，是完全相同的一页），所以改页码拿不到更多数据。
    # 每页 56 条 -> 单个列表最多只能拿到 100 × 56 = 5600 台。
    MAX_PAGES = 100
    CARS_PER_PAGE = 56
    SPLIT_THRESHOLD = MAX_PAGES * CARS_PER_PAGE   # 超过这个数就必须按价格分片

    # 站点提供的全部价格档位，顺序即页面上「3万以下 … 100万+」，
    # 合起来覆盖全部价位。(下限, 上限)，上限 0 表示不封顶。
    PRICE_BUCKETS = [
        (0, 3), (3, 5), (5, 8), (8, 10), (10, 15),
        (15, 20), (20, 30), (30, 50), (50, 100), (100, 0),
    ]

    def __init__(self, areapy="hefei", max_pages=None, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.areapy = areapy
        # max_pages 只用于调试限量；不传则按页面给出的总页数全爬
        self.max_pages = int(max_pages) if max_pages else None
        self.start_urls = [self.page_url(1)]

    def page_url(self, page, bucket=None):
        """bucket 为 None 表示不限价格；否则是 (下限, 上限) 价格段。"""
        if bucket is None:
            return self.LIST_URL_TPL.format(areapy=self.areapy, page=page)
        lo, hi = bucket
        return self.FILTERED_URL_TPL.format(
            areapy=self.areapy, lo=lo, hi=hi, page=page)

    @staticmethod
    def bucket_label(bucket):
        if bucket is None:
            return "不限价"
        lo, hi = bucket
        return f"{lo}万以上" if hi == 0 else f"{lo}-{hi}万"

    def parse(self, response, **kwargs):
        page = response.meta.get("page", 1)
        bucket = response.meta.get("bucket")      # None = 不限价
        label = self.bucket_label(bucket)

        # 第 1 页先看车源总数，决定要不要按价格分片。
        # 单个列表最多只能翻 100 页（5600 台），超过就必须切小再爬。
        if page == 1 and bucket is None:
            total = self.parse_total_count(response)
            if total is not None and total > self.SPLIT_THRESHOLD:
                print(f"[{self.areapy}] 共 {total} 台，超过单个列表上限 "
                      f"{self.SPLIT_THRESHOLD}，改按价格分 {len(self.PRICE_BUCKETS)} 片")
                for b in self.PRICE_BUCKETS:
                    yield scrapy.Request(
                        self.page_url(1, b),
                        callback=self.parse,
                        meta={"page": 1, "bucket": b},
                    )
                return  # 本页数据不产出，交给各价格分片去抓（否则会和分片结果重复）

        # with open(f'debug_p{page}.html', 'w', encoding='utf-8') as f:
        #     f.write(response.text)

        # 获取所有车辆列表项
        li_list = response.xpath("//li[contains(@class,'cards-li')]")
        # settings 里 LOG_LEVEL=WARNING，用 print 才看得到
        print(f"[{self.areapy}][{label}] 第 {page} 页，抓到 {len(li_list)} 条")

        for li in li_list:
            item = Che168ToDbItem()

            # ---------- 基础信息 ----------
            item.info_id = li.xpath("./@infoid").get() or li.xpath("./@id").get()
            item.car_name = li.xpath("./@carname").get()
            item.specid = li.xpath("./@specid").get()

            # 列表里夹着不带任何车辆属性的广告位 <li class="cards-li">
            # （详情链接指向 topicm.che168.com 的商户注册 banner），跳过，
            # 否则会往库里写一条全空记录
            if not item.info_id and not item.car_name:
                continue

            # ---------- 价格信息 ----------
            price_str = li.xpath("./@price").get()
            if price_str:
                try:
                    item.price = float(price_str)
                except ValueError:
                    item.price = None

            # 指导价：从 <s> 标签提取
            guide_text = li.xpath('.//div[@class="cards-price-box"]/s/text()').get()
            if guide_text:
                # 去掉 "万" 并转为 float
                guide_clean = guide_text.replace('万', '').strip()
                try:
                    item.guide_price = float(guide_clean)
                except ValueError:
                    item.guide_price = None

            # ---------- 车况信息 ----------
            mileage_str = li.xpath("./@milage").get()
            if mileage_str:
                try:
                    item.mileage = float(mileage_str)
                except ValueError:
                    item.mileage = None

            item.reg_date = li.xpath("./@regdate").get()

            # ---------- 地理位置 ----------
            item.province_id = li.xpath("./@pid").get()
            item.city_id = li.xpath("./@cid").get()

            # 城市名称从 cards-unit 文本中提取（格式：里程／上牌／城市／会员）
            unit_text = li.xpath('.//p[@class="cards-unit"]/text()').get()
            if unit_text:
                parts = unit_text.split('／')
                if len(parts) >= 3:
                    item.city_name = parts[2].strip()
                # 同时保存完整文本
                item.car_unit = unit_text

            # ---------- 经销商 ----------
            item.dealer_id = li.xpath("./@dealerid").get()

            # ---------- 链接 & 图片 ----------
            detail_url = li.xpath('.//a/@href').get()
            if detail_url:
                item.detail_url = response.urljoin(detail_url)  # 补全完整URL

            img_src = li.xpath('.//img/@src').get()
            if img_src:
                if img_src.startswith('//'):
                    item.img_url = 'https:' + img_src
                else:
                    item.img_url = img_src

            # ---------- 状态标志 ----------
            def to_int(val):
                if val is None:
                    return None
                try:
                    return int(val)
                except ValueError:
                    return None

            item.is_newcar = to_int(li.xpath("./@isnewcar").get())
            item.is_credit = to_int(li.xpath("./@iscredit").get())
            item.is_cpl = to_int(li.xpath("./@iscpl").get())
            item.is_afteraudit = to_int(li.xpath("./@isafteraudit").get())
            item.is_recom = to_int(li.xpath("./@isrecom").get())

            # ---------- 发布 & 追踪 ----------
            item.public_date = li.xpath("./@publicdate").get()
            item.query_id = li.xpath("./@queryid").get()
            item.recom_id = li.xpath("./@recomid").get()

            # page 和 pos
            item.page = to_int(li.xpath("./@page").get())
            item.pos = to_int(li.xpath("./@pos").get())

            # 返回 Item
            yield item

        # ---------- 翻页 ----------
        # 只在第 1 页算一次总页数，然后把后续页一次性排进调度器。
        # （settings 里并发被限成 1、延迟 3 秒，所以实际仍是逐页串行，只是不用等
        #   上一页返回后再决定下一页，调度更直接。）
        if page == 1:
            pages = self.parse_total_pages(response)

            # 站点硬上限 100 页；即使页面写了更多，101 页起也只会重复第 100 页
            if pages > self.MAX_PAGES:
                print(f"[{self.areapy}][{label}] 站点显示 {pages} 页，"
                      f"按硬上限 {self.MAX_PAGES} 页处理")
                pages = self.MAX_PAGES

            # 分片之后单片仍然超上限：当前只有价格这一个维度，切不动了，明确报出来
            # 注意这里（以及所有 print）只能用 GBK 能编码的字符——控制台是 GBK，
            # emoji 会让 print 抛 UnicodeEncodeError，反而把请求搞挂
            count = self.parse_total_count(response)
            if bucket is not None and count is not None and count > self.SPLIT_THRESHOLD:
                print(f"[{self.areapy}][{label}] !! 警告：该价格档有 {count} 台，"
                      f"仍超过 {self.SPLIT_THRESHOLD}，只能抓到前 {self.MAX_PAGES} 页"
                      f"（约 {self.SPLIT_THRESHOLD} 台），会有遗漏")

            if self.max_pages is not None:
                pages = min(pages, self.max_pages)
            print(f"[{self.areapy}][{label}] 共 {pages} 页，开始翻页")
            for p in range(2, pages + 1):
                yield scrapy.Request(
                    self.page_url(p, bucket),
                    callback=self.parse,
                    meta={"page": p, "bucket": bucket},
                )

    @staticmethod
    def parse_total_count(response):
        """取「全部车源(N)」里的车源总数，这是当前筛选条件下的真实总量。

        列表页顶部形如：<a href="/beijing/list/#pvareaid=108337">全部车源(7594)</a>
        取不到就返回 None（调用方会退回「不细分、直接翻页」的老行为）。
        """
        for text in response.xpath('//a[contains(text(), "全部车源(")]/text()').getall():
            m = re.search(r'全部车源\((\d+)\)', text)
            if m:
                return int(m.group(1))
        return None

    @staticmethod
    def parse_total_pages(response):
        """从分页容器取总页数。

        容器形如：[1] 2 3 4 5 6 ... 80 [下一页]
        最后一个数字链接就是总页数（中间那个 "..." 是 <span>，不会被选中）。
        上一页/下一页虽然也是 <a>，但 href 指向相邻页，必须排除。
        """
        nums = response.xpath(
            '//div[@id="listpagination"]/a'
            '[not(contains(@class, "page-item-next")) '
            'and not(contains(@class, "page-item-prev"))]/text()'
        ).getall()
        pages = [int(t.strip()) for t in nums if t.strip().isdigit()]
        return max(pages) if pages else 1
