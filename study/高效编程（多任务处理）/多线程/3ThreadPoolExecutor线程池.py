# -*- coding: utf-8 -*-
"""
@File    : ThreadPoolExecutor线程池.py
@Author  : Elliot Lin
@Date    : 2026/2/26 12:34
@Project : AAA-Frida
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
from concurrent.futures import ThreadPoolExecutor
import time


# import threadpool
# 线程池 统一管理 线程

def go(str):
    print("hello", str)
    time.sleep(2)


name_list = ["lucky", "卢yuan凯", "姚青", "刘佳俊", "何必喆"]
pool = ThreadPoolExecutor(5)  # 控制线程的并发数

# 线程池运行的方式
# 方式一：逐一传参扔进线程池
for i in name_list:
    pool.submit(go, i)

# 简写
# all_task = [pool.submit(go, i) for i in name_list]

# 方式二：统一放入进程池使用
pool.map(go, name_list)
# 多个参数
# pool.map(go, name_list1, name_list2...)