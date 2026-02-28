# -*- coding: utf-8 -*-
"""
@File    : temp.py
@Author  : Elliot Lin
@Date    : 2026/2/26 23:13
@Project : AAA-Frida
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
import asyncio
import arrow


def current_time():
    '''
    获取当前时间
    :return:
    '''
    cur_time = arrow.now().to('Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss')
    return cur_time


async def func(sleep_time):
    func_name_suffix = sleep_time  # 使用 sleep_time (函数 I/O 等待时长)作为函数名后缀，以区分任务对象
    print(f"[{current_time()}] 执行异步函数 {func.__name__}-{func_name_suffix}")
    await asyncio.sleep(sleep_time)
    print(f"[{current_time()}]函数{func.__name__}-{func_name_suffix} 执行完毕")
    return f"【[{current_time()}] 得到函数 {func.__name__}-{func_name_suffix} 执行结果】"


async def run():
    task_list = []
    for i in range(5):
        task = asyncio.create_task(func(i))
        task_list.append(task)

    # done 为已完成的协程Task ， pending 为超时未完成的协程Task
    done, pending = await asyncio.wait(task_list)
    for done_task in done:
        print(f"[{current_time()}]得到执行结果 {done_task.result()}")


def main():
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(run())
    loop.close()


if __name__ == '__main__':
    main()