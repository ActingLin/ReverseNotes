# -*- coding: utf-8 -*-
"""
@File    : 3await(推荐)vs回调函数.py
@Author  : Elliot Lin
@Date    : 2026/2/26 22:32
@Project : AAA-Frida
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    :
"""
# import asyncio
# import time
#
#
# # 1. 定义协程任务
# async def fetch_data(site_name, delay):
#     print(f"🚀 [{site_name}] 开始请求数据...")
#     await asyncio.sleep(delay)  # 模拟网络延迟
#     result = f"{site_name} 的数据 (耗时{delay}秒)"
#     print(f"✅ [{site_name}] 数据获取完毕")
#     return result
#
#
# # 2. 定义回调函数
# # 回调函数通常用于：记录日志、更新UI、保存文件、触发下一个任务
# def on_task_completed(future):
#     try:
#         # 获取协程的返回值
#         result = future.result()
#         print(f"📢 [回调通知] 收到结果 -> {result}")
#
#         # 在这里可以继续处理数据，例如写入数据库
#         # save_to_db(result)
#     except Exception as e:
#         # 如果协程内部报错，future.result() 会抛出异常，必须在这里捕获
#         print(f"❌ [回调错误] 任务执行失败: {e}")
#
#
# async def main():
#     print("--- 开始并发任务 ---")
#     start_time = time.time()
#
#     # 创建三个不同耗时的任务
#     tasks = [
#         asyncio.create_task(fetch_data("百度", 3)),
#         asyncio.create_task(fetch_data("谷歌", 1)),  # 谷歌最快
#         asyncio.create_task(fetch_data("必应", 2))
#     ]
#
#     # 为每个任务单独绑定回调函数
#     for task in tasks:
#         task.add_done_callback(on_task_completed)
#
#     # 等待所有任务完成
#     # 注意：add_done_callback 是在任务完成瞬间自动触发的，
#     # 而 gather 是主程序用来等待所有任务结束的。
#     await asyncio.gather(*tasks)
#
#     end_time = time.time()
#     print(f"\n🏁 所有任务及回调执行完毕，总耗时: {end_time - start_time:.2f}秒")
#     print("💡 观察输出顺序：谷歌(1s)的回调会最先打印，尽管它在列表中不是第一个。")
#
#
# if __name__ == '__main__':
#     # 现代写法：直接使用 asyncio.run
#     asyncio.run(main())

# ==========================================
# 旧写法：使用回调 (逻辑分散)
# ==========================================
# import asyncio
#
#
# async def fetch(site, delay):
#     await asyncio.sleep(delay)
#     return f"{site}数据"
#
#
# # 1. 定义回调：逻辑在这里，和主流程分离
# def on_done(future):
#     try:
#         res = future.result()
#         print(f"✅ [回调] 收到: {res}")
#     except Exception as e:
#         print(f"❌ [回调] 出错: {e}")
#
#
# async def main_callback():
#     # 2. 创建任务
#     t1 = asyncio.create_task(fetch("百度", 2))
#     t2 = asyncio.create_task(fetch("谷歌", 1))
#
#     # 3. 注册回调
#     t1.add_done_callback(on_done)
#     t2.add_done_callback(on_done)
#
#     # 4. 等待所有结束（主程序不知道具体结果，只知道结束了）
#     await asyncio.gather(t1, t2)
#     print("--- 主流程结束 ---")
#
# asyncio.run(main_callback())


# ==========================================
# 新写法：使用 Await (逻辑线性，推荐)
# ==========================================
import asyncio
import time


async def fetch(site, delay):
    await asyncio.sleep(delay)
    return f"{site}数据(耗时{delay}s)"


async def main_gather():
    start = time.time()

    # 1. 批量创建任务
    tasks = [
        asyncio.create_task(fetch("百度", 3)),
        asyncio.create_task(fetch("谷歌", 1)),
        asyncio.create_task(fetch("必应", 2))
    ]

    # 2. 【核心】一次性等待所有任务完成
    # gather 会并发运行所有任务，并返回一个结果列表
    # 结果的顺序与 tasks 列表的顺序一致（而不是完成时间的顺序）
    print("⏳ 同时等待所有任务完成...")
    results = await asyncio.gather(*tasks)

    # 3. 线性处理结果
    end = time.time()
    print(f"\n📊 最终结果列表: {results}")
    print(f"⏱️ 总耗时: {end - start:.2f}秒 (约等于最慢的任务时间)")

    # 你可以在这里统一处理所有结果，逻辑非常清晰
    for site, data in zip(["百度", "谷歌", "必应"], results):
        print(f"💾 正在保存 {site} 的数据到数据库...")


if __name__ == '__main__':
    asyncio.run(main_gather())
