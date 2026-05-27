# -*- coding: utf-8 -*-
"""
@File    : 1string.py
@Author  : Elliot Lin
@Date    : 2026/3/13 19:05
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
import redis

r = redis.StrictRedis(host='localhost', port=6379, password='123456', db=0, decode_responses=True)
# print(r)  # 测试链接

# 批量设置
print(r.mset({'name':'Elliot-Lin', 'age':18}))
print(r.mget(['name','age']))

print(r.getset('name','Lin'))