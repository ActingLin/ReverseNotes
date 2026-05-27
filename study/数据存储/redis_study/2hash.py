# -*- coding: utf-8 -*-
"""
@File    : 2hash.py
@Author  : Elliot Lin
@Date    : 2026/3/13 19:17
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
import redis

r = redis.StrictRedis(password='123456',  decode_responses=True)

print(r.hset("hash", "name", "Elliot-Lin"))
print(r.hget("hash", "name"))
print(r.hgetall("hash"))

print(r.hmset("myhash", {"name":"Elliot-Lin", "age": 18}))
print(r.hkeys("myhash"))
print(r.hvals("myhash"))
print(r.type("myhash"))