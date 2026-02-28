# -*- coding: utf-8 -*-
"""
@File    : 1同步vs异步.py
@Author  : Elliot Lin
@Date    : 2026/2/26 17:31
@Project : AAA-Frida
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
# import time
#
# # 同步：顺序执行，等待前一个任务完成再执行下一个
# def run(index):
#     print(f"start {index}")
#     time.sleep(2)  # 模拟IO等待
#     print(f"over {index}")
#
# for i in range(1, 5):
#     run(i)
# # 总耗时约8秒（4个任务×2秒）

import asyncio
import time

# 异步：不等待任务完成，立即执行下一个任务
async def run(i):
    print(f"start {i}")
    await asyncio.sleep(2)  # 模拟IO等待（非阻塞）
    print(f"over {i}")

async def main():
    tasks = [run(i) for i in range(1, 5)]
    await asyncio.gather(*tasks)

start = time.time()
asyncio.run(main())
print(f"总耗时：{time.time() - start:.2f}秒")  # 总耗时约2秒
