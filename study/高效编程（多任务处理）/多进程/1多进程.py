# -*- coding: utf-8 -*-
"""
@File    : 多进程.py
@Author  : Elliot Lin
@Date    : 2026/2/21 23:59
@Project : AAA-Frida
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""

import os
import time
import multiprocessing
from multiprocessing import Process


def run1():
    for i in range(7):
        print("lucky is a good man")
        time.sleep(1)


def run2(name, word):
    for i in range(5):
        print("%s is a %s man" % (name, word))
        print()
        time.sleep(1)


# 全局变量在多进程中不能共享
num = 10


def run3():
    print("我是子进程run3的开始")
    global num
    num += 1
    print(num)
    print("我是子进程run3的结束")


mylist = []


def run4():
    print("我是子进程run4的开始")
    global mylist
    mylist.append(1)
    mylist.append(2)
    mylist.append(3)
    print("我是子进程run4的结束")


if __name__ == "__main__":
    # 程序启动时的进程称为主进程(父进程)
    # 主进程主要做的是调度相关的工作，一般不负责具体业务逻辑

    t1 = time.time()

    # 创建子进程并启动
    p1 = Process(target=run1)
    p2 = Process(target=run2, args=("Elliot", "Lin"), name="run2")
    p3 = Process(target=run3, name="run3")
    p4 = Process(target=run4, name="run4")

    # 启动两个进程
    p1.start()
    p2.start()
    p3.start()
    p4.start()

    # 获取进程信息
    print(os.getpid())  # 获取当前进程id
    print(os.getppid())  # 获取当前进程的父进程id
    print(multiprocessing.current_process().name)  # 获取当前进程名称

    # 主进程的结束不能影响子进程，所以可以等待子进程的结束再结束主进程
    # 等待子进程结束，才能继续运行主进程
    p1.join()
    p2.join()
    p3.join()
    p4.join()

    print(num)
    print(mylist)

    # 查看耗时
    t2 = time.time()
    print("耗时：%.2f" % (t2 - t1))
