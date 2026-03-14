# -*- coding: utf-8 -*-
"""
@File    : proxy_redis.py
@Author  : Elliot Lin
@Date    : 2026/3/13 21:43
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 存储和处理当前的ip
"""
import redis
import random
from settings import *
from loguru import logger


class ProxyRedis:
    def __init__(self):
        self.r = redis.Redis(host=HOST, port=PORT, db=DB, password=PASSWORD, decode_responses=True)

    # 添加ip并添加初始权重SCORE
    def zset_zadd(self, ip):
        self.r.zadd(ZSET_NAME, {ip: SCORE})

    # 降低权重
    def zset_zincrby(self, ip):
        # 查权重
        score = self.r.zscore(ZSET_NAME, ip)
        # 判断是否小于最小权重
        if score > MIN_SCORE:
            self.r.zincrby(ZSET_NAME, -1, ip)
        else:
            # 删除ip
            # print('ip', ip)
            logger.debug(f"ip:{ip}低于最低权重，删除")
            self.r.zrem(ZSET_NAME, ip)

    # 返回高权重的ip
    def get_ip(self):
        ip = self.r.zrangebyscore(ZSET_NAME, SCORE, SCORE, 0, -1)
        if ip:
            # 随机返回一个ip
            return random.choice(ip)
        else:
            ip = self.r.zrangebyscore(ZSET_NAME, 98, SCORE, 0, -1)
            if ip:
                # 随机返回一个ip
                return random.choice(ip)
            else:
                logger.error("都不可用！！！")
                return None

    def zset_zrange(self):
        return self.r.zrange(ZSET_NAME, 0, -1)