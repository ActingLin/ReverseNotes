# -*- coding: utf-8 -*-
"""
@File    : 2asyncio基本使用.py
@Author  : Elliot Lin
@Date    : 2026/2/26 21:54
@Project : AAA-Frida
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
import asyncio
import time


# ==========================================
# 1. 定义协程函数
# ==========================================
async def my_coroutine(x):
    """
    定义一个协程函数。
    :param x: 模拟等待的秒数
    :return: 返回结果字符串
    """
    print(f"⏳ [任务开始] 等待 {x} 秒...")

    # await 关键字：挂起当前协程，让出 CPU 给其他任务，直到 IO 操作完成
    # asyncio.sleep 是异步的，不会阻塞整个线程
    await asyncio.sleep(x)

    print(f"✅ [任务完成] 耗时 {x} 秒")
    return f"结果: 任务{x}已完成"


# ==========================================
# 2. 方式一：现代推荐写法 (Python 3.7+)
# ==========================================
def run_modern_way():
    """
    推荐使用 asyncio.run()
    它会自动：
    1. 创建一个新的事件循环
    2. 将协程放入循环运行
    3. 等待协程结束
    4. 关闭事件循环

    loop = asyncio.new_event_loop() (创建新循环)
    asyncio.set_event_loop(loop) (设置为当前循环)
    loop.run_until_complete(coro) (运行协程)
    loop.close() (清理资源)
    """
    print("\n--- 🌟 方式一：现代推荐写法 (asyncio.run) ---")
    result = asyncio.run(my_coroutine(2))
    print(f"📝 返回值: {result}")


# ==========================================
# 3. 方式二：传统写法 (了解即可，不推荐在新代码中使用)
# ==========================================
def run_legacy_way():
    """
    传统写法：手动获取事件循环。
    ⚠️ 注意：在 Python 3.10+ 中，如果没有当前循环，get_event_loop() 会发出 DeprecationWarning。
    """
    print("\n--- ⚠️ 方式二：传统写法 (手动管理循环) ---")

    # 显式创建一个新循环以避免警告（但在现代代码中依然不推荐）
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)

    try:
        coroutine = my_coroutine(2)
        # 运行直到协程完成
        result = loop.run_until_complete(coroutine)
        print(f"📝 返回值: {result}")
    finally:
        # 记得关闭循环
        loop.close()


# ==========================================
# 4. 进阶演示：并发执行多个任务
# ==========================================
async def main_concurrent():
    """演示如何同时运行多个协程"""
    print("\n--- 🚀 进阶：并发执行多个任务 ---")

    start_time = time.time()

    # 创建三个任务列表
    tasks = [
        my_coroutine(1),
        my_coroutine(2),
        my_coroutine(3)
    ]

    # asyncio.gather 会并发执行所有任务，并等待它们全部完成
    # 如果是同步执行，总耗时应该是 1+2+3=6秒
    # 因为是并发，总耗时取决于最慢的那个任务 (约3秒)
    results = await asyncio.gather(*tasks)

    end_time = time.time()

    print(f"\n📊 所有任务结果: {results}")
    print(f"⏱️ 总耗时: {end_time - start_time:.2f} 秒 (理论同步耗时应为6秒)")


if __name__ == '__main__':
    # 执行现代推荐写法
    run_modern_way()

    # 执行传统写法 (为了演示，实际开发请忽略此部分)
    # run_legacy_way()

    # 执行并发演示 (需要在另一个 event loop 中运行，因为上面已经跑过一个 run 了)
    # 注意：asyncio.run() 只能作为主入口调用一次，这里我们直接再调用一次来演示并发
    asyncio.run(main_concurrent())