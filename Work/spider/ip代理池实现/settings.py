# -*- coding: utf-8 -*-
"""
@File    : settings.py
@Author  : Elliot Lin
@Date    : 2026/3/13 21:43
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 全局的配置文件
"""
HOST='localhost'
PORT=6379
DB=0
PASSWORD='123456'
SCORE = 100     # 默认最高权重100
MIN_SCORE=50    # 最低权重
ZSET_NAME = 'proxy_redis'