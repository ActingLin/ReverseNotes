# -*- coding: utf-8 -*-
"""
@File    : as_completed获取线程返回结果.py
@Author  : Elliot Lin
@Date    : 2026/2/26 17:01
@Project : AAA-Frida
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
from concurrent.futures import ThreadPoolExecutor, as_completed


def task(n):
    return n * n


# 所有操作必须在线程池关闭前完成（即在 with 块内部）
with ThreadPoolExecutor(max_workers=5) as executor:
    # 方式一：submit (提交单个任务)
    future = executor.submit(task, 10)
    print(f"单个任务结果: {future.result()}")  # 输出: 100

    # 方式二：map (批量提交)
    results = executor.map(task, [1, 2, 3, 4, 5])
    print(f"Map任务结果: {list(results)}")  # 输出: [1, 4, 9, 16, 25]

    # 方式三：as_completed (谁先做完谁先返回)
    """
    当子线程中的任务执行完后，使用 result() 获取返回结果
    该方法是一个生成器，在没有任务完成的时候，会一直阻塞，除非设置了 timeout。 
    当有某个任务完成的时候，会yield这个任务，就能执行for循环下面的语句，然后继续阻塞住，循环到所有任务结束，
    同时，先完成的任务会先返回给主线程
    """
    futures = [executor.submit(task, i) for i in range(5)]

    print("\n开始处理 as_completed 任务:")
    for future in as_completed(futures):
        print(f"任务完成，结果: {future.result()}")

# 退出 with 块后，线程池自动关闭，程序正常结束
print("\n所有任务已完成，线程池已关闭。")
