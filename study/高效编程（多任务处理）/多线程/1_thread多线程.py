# -*- coding: utf-8 -*-
"""
@File    : _thread多线程.py
@Author  : Elliot Lin
@Date    : 2026/2/26 11:51
@Project : AAA-Frida
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
import _thread
import time


# 定义线程要执行的函数
def print_time(thread_name, delay, counter):
    while counter:
        time.sleep(delay)
        print(f"{thread_name}: {time.ctime(time.time())}")
        counter -= 1


# 主程序
if __name__ == "__main__":
    try:
        # 创建两个新线程
        # 参数: (目标函数, 参数元组)
        # 两个线程交替输出时间，Thread-1 每 2 秒输出一次，Thread-2 每 4 秒输出一次，各自输出 5 次。
        _thread.start_new_thread(print_time, ("Thread-1", 2, 5))
        _thread.start_new_thread(print_time, ("Thread-2", 4, 5))

        print("线程已启动，主线程正在等待...")

        # 注意：_thread 模块没有提供直接的 join() 方法。
        # 如果主线程直接结束，所有子线程会被强制杀死。
        # 因此，我们需要一个简单的循环让主线程保持运行，直到子线程完成。
        # 在实际复杂场景中，通常需要使用 threading.Event 或其他同步机制。
        # 这里为了演示简单，我们让主线程休眠足够长的时间。
        time.sleep(25)

        print("主程序结束。")

    except Exception as e:
        print(f"错误: 无法启动线程 - {e}")