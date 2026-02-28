# -*- coding: utf-8 -*-
"""
@File    : 进程间通信.py
@Author  : Elliot Lin
@Date    : 2026/2/22 17:53
@Project : AAA-Frida
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
from multiprocessing import Queue, Process, Manager


# 队列共享 - 先进先出
def ipc_queue(my_queue):
    print(f"[子进程] 队列地址: {id(my_queue)}")
    my_queue.put([1, 'a', False])
    print(f"[子进程] 已放入数据")


# 字典共享
def ipc_dict(my_dict):
    my_dict['x'] = 'x'
    my_dict['y'] = 'y'
    my_dict['z'] = 'z'
    print(f"[子进程] 字典: {my_dict}")


# 列表共享
def ipc_list(my_list):
    """使用 append 而不是索引赋值"""
    my_list.append('y')
    my_list.append('z')
    print(f"[子进程] 列表: {my_list}")


def ipc_model_switch(ipc_model):
    match ipc_model:
        case 1:
            # 队列通信
            que = Queue()
            que.put([1, 2, 3, 4, 5])
            p = Process(target=ipc_queue, args=(que,))
            p.start()
            p.join()
            print(f"[主进程] 获取: {que.get()}")  # [1, 2, 3, 4, 5]
            print(f"[主进程] 获取: {que.get()}")  # [1, 'a', False]

        case 2:
            # 字典通信
            mydict = Manager().dict()
            mydict['a'] = 'a'
            p = Process(target=ipc_dict, args=(mydict,))
            p.start()
            p.join()
            print(f"[主进程] 字典: {mydict}")

        case 3:
            # 列表通信
            myList = Manager().list()
            myList.append('x')  # 初始值
            p = Process(target=ipc_list, args=(myList,))
            p.start()
            p.join()
            print(f"[主进程] 列表: {myList}")  # ['x', 'y', 'z']


if __name__ == '__main__':
    print("进程间通信模式:\n\t1 队列通信\n\t2 字典通信\n\t3 列表通信\n")
    ipc_model = int(input("请输入IPC模式:"))
    ipc_model_switch(ipc_model)