# -*- coding: utf-8 -*-
"""
@File    : 线程锁Lock.py
@Author  : Elliot Lin
@Date    : 2026/2/26 16:12
@Project : AAA-Frida
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""

# 案例一:
# import threading
#
# # 创建一个Lock对象
# lock = threading.Lock()
# # 初始化共享资源
# abc = 0
#
#
# def sumOne():
#     global abc
#     lock.acquire()  # 锁定共享资源
#     abc = abc + 1
#     lock.release()  # 释放共享资源
#
#
# def sumTwo():
#     global abc
#     lock.acquire()  # 锁定共享资源
#     abc = abc + 2
#     lock.release()  # 释放共享资源
#
#
# # 调用函数
# sumOne()
# sumTwo()
# print(abc)


# 案例二:
# import threading
#
# Lock = threading.Lock()
# i = 1
#
#
# def fun1():
#     global i
#     if Lock.acquire():  # 判断是否上锁  锁定成功
#         for x in range(1000000):
#             i += x
#             i -= x
#         Lock.release()
#     print('fun1----', i)
#
#
# def fun2():
#     global i
#     if Lock.acquire():  # 判断是否上锁  锁定成功
#         for x in range(1000000):
#             i += x
#             i -= x
#         Lock.release()
#     print('fun2----', i)
#
#
# t1 = threading.Thread(target=fun1)
# t2 = threading.Thread(target=fun2)
# t1.start()
# t2.start()
# t1.join()
# t2.join()
# print('mian----', i)


# 线程锁的简写

import threading

i = 0
lock = threading.Lock()

def sum1():
    global i
    with lock:
        for x in range(1000000):
            i += x
            i -= x
    print('sum1', i)

def sum2():
    global i
    with lock:
        for x in range(1000000):
            i += x
            i -= x
    print('sum2', i)

if __name__ == '__main__':
    thr1 = threading.Thread(target=sum1)
    thr2 = threading.Thread(target=sum2)
    thr1.start()
    thr2.start()
    thr1.join()
    thr2.join()
    print('over')