# Scrapy settings for che168_to_db project
#
# For simplicity, this file contains only settings considered important or
# commonly used. You can find more settings consulting the documentation:
#
#     https://docs.scrapy.org/en/latest/topics/settings.html
#     https://docs.scrapy.org/en/latest/topics/downloader-middleware.html
#     https://docs.scrapy.org/en/latest/topics/spider-middleware.html

import os

BOT_NAME = "che168_to_db"

SPIDER_MODULES = ["che168_to_db.spiders"]
NEWSPIDER_MODULE = "che168_to_db.spiders"

ADDONS = {}

LOG_LEVEL = "WARNING"

DB_CONFIG = {
    'host': '127.0.0.1',   # 服务器地址（MySQL 跑在 Docker 里，映射到本机端口）
    'port': 3307,          # 本机 3306 被原生 MySQL 服务占用，见 compose.yaml 的 ports
    'user': 'scrapy_user',  # 对应 compose.yaml 的 MYSQL_USER
    'password': 'actlin',#os.environ.get('CHE168_DB_PASSWORD', ''),  # 从环境变量取，避免密码进仓库
    'db': 'scrapy_data',   # 对应 compose.yaml 的 MYSQL_DATABASE
    'charset': 'utf8mb4',  # 车型名有生僻字，别用 utf8
}


# Crawl responsibly by identifying yourself (and your website) on the user-agent
#USER_AGENT = "che168_to_db (+http://www.yourdomain.com)"

# Obey robots.txt rules
ROBOTSTXT_OBEY = False

# Concurrency and throttling settings
#CONCURRENT_REQUESTS = 16
CONCURRENT_REQUESTS_PER_DOMAIN = 1
DOWNLOAD_DELAY = 3

# 代理。留空 = 直连。
# Clash 的混合端口一般是 127.0.0.1:7890。
#
# 重要：光在这里配没用。Clash 默认是 rule 模式，che168.com 属于国内域名会被
# **直连**，出口 IP 根本没变（实测：直连和走 7890 返回的拦截页完全一样）。
# 必须在 Clash 侧先让 che168.com 走节点：
#   - 简单：Clash Verge 里切到「全局」模式，选一个节点（用完记得切回来）
#   - 规范：在配置里加规则 DOMAIN-SUFFIX,che168.com,<代理组>
CHE168_PROXY = "http://127.0.0.1:7890"

# 被封时自动换 Clash 节点。
# che168 的风控是按 IP 记的：一个 IP 撑不了多少请求就会被标记成 RISK 页，
# 之后持续返回验证码页。实测换一个出口 IP 就能恢复，但要试几个才碰得上能用的
# （同一时刻测 5 个：3 个被 EdgeOne 挡、1 个被车168 挡、1 个可用）。
CHE168_ROTATE_NODE = True
# 换哪个组取决于 Clash 的模式：
#   全局模式 -> "GLOBAL"      ；规则模式 -> "节点选择"
# 实测全局模式下切「节点选择」出口 IP 不变，流量走的是 GLOBAL 组。
CHE168_CLASH_GROUP = "GLOBAL"

# Disable cookies (enabled by default)
#COOKIES_ENABLED = False

# Disable Telnet Console (enabled by default)
#TELNETCONSOLE_ENABLED = False

# Override the default request headers:
DEFAULT_REQUEST_HEADERS = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:148.0) Gecko/20100101 Firefox/148.0"
}

# Enable or disable spider middlewares
# See https://docs.scrapy.org/en/latest/topics/spider-middleware.html
#SPIDER_MIDDLEWARES = {
#    "che168_to_db.middlewares.Che168ToDbSpiderMiddleware": 543,
#}

# Enable or disable downloader middlewares
# See https://docs.scrapy.org/en/latest/topics/downloader-middleware.html
DOWNLOADER_MIDDLEWARES = {
    # "che168_to_db.middlewares.Che168ToDbDownloaderMiddleware": 543,
}

# 整个换掉传输层：EdgeOne 卡 TLS 指纹，Twisted 自带客户端过不去。
# 必须用 DownloadHandler 而不是 downloader middleware —— 后者会短路掉
# 承载限速与并发记账的 _enqueue_request，见 che168_to_db/handler.py 的说明。
DOWNLOAD_HANDLERS = {
    "http": "che168_to_db.handler.EdgeOneDownloadHandler",
    "https": "che168_to_db.handler.EdgeOneDownloadHandler",
}

# Enable or disable extensions
# See https://docs.scrapy.org/en/latest/topics/extensions.html
#EXTENSIONS = {
#    "scrapy.extensions.telnet.TelnetConsole": None,
#}

# Configure item pipelines
# See https://docs.scrapy.org/en/latest/topics/item-pipeline.html
ITEM_PIPELINES = {
   "che168_to_db.pipelines.Che168ToDbPipeline": 300,
}

# Enable and configure the AutoThrottle extension (disabled by default)
# See https://docs.scrapy.org/en/latest/topics/autothrottle.html
#AUTOTHROTTLE_ENABLED = True
# The initial download delay
#AUTOTHROTTLE_START_DELAY = 5
# The maximum download delay to be set in case of high latencies
#AUTOTHROTTLE_MAX_DELAY = 60
# The average number of requests Scrapy should be sending in parallel to
# each remote server
#AUTOTHROTTLE_TARGET_CONCURRENCY = 1.0
# Enable showing throttling stats for every response received:
#AUTOTHROTTLE_DEBUG = False

# Enable and configure HTTP caching (disabled by default)
# See https://docs.scrapy.org/en/latest/topics/downloader-middleware.html#httpcache-middleware-settings
#HTTPCACHE_ENABLED = True
#HTTPCACHE_EXPIRATION_SECS = 0
#HTTPCACHE_DIR = "httpcache"
#HTTPCACHE_IGNORE_HTTP_CODES = []
#HTTPCACHE_STORAGE = "scrapy.extensions.httpcache.FilesystemCacheStorage"

# Set settings whose default value is deprecated to a future-proof value
FEED_EXPORT_ENCODING = "utf-8"
