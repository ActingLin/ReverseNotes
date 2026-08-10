"""
数据库配置文件
填入你的远程 MySQL 连接信息即可
"""

DB_CONFIG = {
    "host": "xxx.xxx.xxx.xxx",          # TODO: 替换为远程数据库 IP
    "port": 3306,                 # 端口
    "user": "spider_demo",               # TODO: 替换为用户名
    "password": "spider_demo",  # TODO: 替换为密码
    "database": "flight_monitor", # 数据库名（需要提前创建）
    "charset": "utf8mb4",
    "connect_timeout": 10,
}
