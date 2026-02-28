# -*- coding: utf-8 -*-
"""
@File    : 进程池.py
@Author  : Elliot Lin
@Date    : 2026/2/22 00:31
@Project : AAA-Frida
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
import os
import time
import random
import multiprocessing
from multiprocessing import Pool

import requests
from requests.exceptions import ConnectionError as RequestsConnectionError

def run(index):
    # 获取主机CPU核心数
    print('[+]CPU number:' + str(multiprocessing.cpu_count()) + ' ' + str(os.process_cpu_count()))
    print("[*]子进程 %d 启动" % index)
    t1 = time.time()
    time.sleep(random.random() * 5 + 2)
    t2 = time.time()
    print(("[*]子进程 %d 结束，耗时：%.2f" % (index, t2 - t1)))

"""
如果你现在有一堆数据要处理，每一项都需要经过一个方法来处理，那么map非常适合
比如现在你有一个数组，包含了所有的URL，而现在已经有了一个方法用来抓取每个URL内容并解析，
那么可以直接在map的第一个参数传入方法名，第二个参数传入URL数组。
map函数可以遍历每个URL，然后对其分别执行scrape方法。
"""
def scrape(url):
    try:
        print(requests.get(url))
    except RequestsConnectionError as e:
        print(f'[-]Error Occurred {url}: {e}')
    finally:
        print('[+]URL', url, ' Scraped')


if __name__ == '__main__':
    print("[*]启动主进程")

    # 创建进程池对象
    # 由于pool的默认值为CPU的核心数，假设有4核心，至少需要5个子进程才能看到效果
    # Pool()中的值表示可以同时执行进程的数量
    pool = Pool(3)
    urls = [
        'https://www.baidu.com',
        'http://www.meituan.com/',
        'http://blog.csdn.net/',
        'http://xxxyxxx.net'
    ]
    pool.map(scrape, urls)

    for i in range(1, 5):
        # 创建子进程，并将子进程放到进程池中统一管理
        pool.apply_async(run, args=(i,))    # 非阻塞模式(并发执行) args参数 可以为元组()或是列表[]

    # 等待子进程结束
    # 关闭进程池：在关闭后就不能再向进程池中添加进程了
    # 进程池对象在调用join之前必须先关闭进程池
    pool.close()
    # pool对象调用join，主进程会等待进程池中的所有子进程结束才会继续执行主进程
    pool.join()

    print("[*]结束主进程")