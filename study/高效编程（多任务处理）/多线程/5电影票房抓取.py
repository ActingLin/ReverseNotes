# -*- coding: utf-8 -*-
"""
@File    : 电影票房抓取.py
@Author  : Elliot Lin
@Date    : 2026/2/26 16:48
@Project : AAA-Frida
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
# import requests
# from lxml import etree
# from concurrent.futures import ThreadPoolExecutor
#
#
# def get_page_source(url):
#     resp = requests.get(url)
#     resp.encoding = 'utf-8'
#     return resp.text
#
#
# def parse_html(html):
#     try:
#         tree = etree.HTML(html)
#         trs = tree.xpath("//table/tbody/tr")[1:]
#         result = []
#         for tr in trs:
#             year = tr.xpath("./td[2]//text()")
#             year = year[0] if year else ""
#             name = tr.xpath("./td[3]//text()")
#             name = name[0] if name else ""
#             money = tr.xpath("./td[4]//text()")
#             money = money[0] if money else ""
#             d = (year, name, money)
#             if any(d):
#                 result.append(d)
#         return result
#     except Exception as e:
#         print(e)  # 调bug专用
#
#
# def download_one(url, f):
#     page_source = get_page_source(url)
#     data = parse_html(page_source)
#     for item in data:
#         f.write(",".join(item))
#         f.write("\n")
#
#
# def main():
#     f = open("movie.csv", mode="w", encoding='utf-8')
#     lst = [str(i) for i in range(1994, 2022)]
#     with ThreadPoolExecutor(10) as t:
#         # 方案一
#         # for year in lst:
#         #     url = f"http://www.boxofficecn.com/boxoffice{year}"
#         #     # download_one(url, f)
#         #     t.submit(download_one, url, f)
#
#         # 方案二
#         t.map(download_one, (f"http://www.boxofficecn.com/boxoffice{year}" for year in lst), (f for i in range(len(lst))))
#
#
# if __name__ == '__main__':
#     main()

import requests
from lxml import etree
from concurrent.futures import ThreadPoolExecutor
import threading

# 创建一个全局锁，用于保护文件写入操作
# 原因：多线程同时调用 f.write() 可能会导致字符交错，造成 CSV 格式错乱
file_lock = threading.Lock()


def get_page_source(url):
    """
    获取网页源代码
    :param url: 目标网址
    :return: 网页文本内容
    """
    # 发送 GET 请求
    resp = requests.get(url)
    # 设置编码，防止中文乱码
    resp.encoding = 'utf-8'
    return resp.text


def parse_html(html):
    """
    解析 HTML 内容，提取电影数据
    :param html: 网页源代码
    :return: 包含 (年份, 电影名, 票房) 元组的列表
    """
    try:
        # 将 HTML 字符串转换为 Element 对象
        tree = etree.HTML(html)
        # 使用 XPath 定位表格中的行，[1:] 跳过表头
        trs = tree.xpath("//table/tbody/tr")[1:]
        result = []

        for tr in trs:
            # 提取年份 (第2列)
            year_list = tr.xpath("./td[2]//text()")
            year = year_list[0].strip() if year_list else ""

            # 提取电影名 (第3列)
            name_list = tr.xpath("./td[3]//text()")
            name = name_list[0].strip() if name_list else ""

            # 提取票房 (第4列)
            money_list = tr.xpath("./td[4]//text()")
            money = money_list[0].strip() if money_list else ""

            d = (year, name, money)

            # 如果任意一项有数据，则加入结果集 (过滤空行)
            if any(d):
                result.append(d)
        return result
    except Exception as e:
        # 捕获异常并打印，防止单个页面解析失败导致整个线程崩溃
        print(f"解析出错: {e}")
        return []


def download_one(url, filename):
    """
    单个线程执行的任务：下载、解析并写入文件
    :param url: 目标网址
    :param filename: 要写入的文件名 (传入文件名比传入文件对象更安全)
    """
    try:
        # 1. 下载网页
        page_source = get_page_source(url)
        # 2. 解析数据
        data = parse_html(page_source)

        if not data:
            return

        # 3. 写入文件 (加锁保护)
        # 注意：虽然每个线程处理不同年份，但写入同一个文件时需要锁，防止内容交错
        with file_lock:
            with open(filename, mode="a", encoding='utf-8') as f:
                for item in data:
                    # 将元组转换为 CSV 格式字符串
                    line = ",".join(item)
                    f.write(line + "\n")

        print(f"成功处理: {url}")

    except Exception as e:
        print(f"任务执行失败 {url}: {e}")


def main():
    # 定义要爬取的年份范围
    years = [str(i) for i in range(2020, 2026)]
    # 生成对应的 URL 列表
    urls = [f"http://www.boxofficecn.com/boxoffice{year}" for year in years]

    # 目标文件名
    target_file = "movie.csv"

    # 初始化文件 (清空旧内容，写入表头)
    with open(target_file, mode="w", encoding='utf-8') as f:
        f.write("年份,电影名,票房\n")

    print("开始多线程爬取...")

    # 创建线程池，最大工作线程数为 10
    with ThreadPoolExecutor(max_workers=10) as executor:
        # --- 方案选择 ---

        # 【推荐】方案一：使用 submit 提交任务
        # 优点：灵活，可以单独处理每个任务的返回值或异常
        for url in urls:
            # 提交任务：函数名, 参数1, 参数2...
            # 这里我们传递 URL 和 文件名，让每个线程自己打开/关闭文件（配合锁使用）
            executor.submit(download_one, url, target_file)

        # 【原代码修正版】方案二：使用 map 批量提交
        # 原代码错误点：(f for i in range(len(lst))) 只是生成了同一个文件对象的引用多次，
        # 且多线程共享一个打开的文件对象 f 是非常危险的。
        # 修正思路：map 适合传递简单的参数。如果必须用 map，我们可以只传 URL，
        # 然后在函数内部使用全局文件名，或者像上面 submit 那样处理。
        # 下面演示如果非要用 map 传两个参数该怎么写（利用 zip）：
        # executor.map(download_one, urls, [target_file] * len(urls))

    print("所有任务完成！")


if __name__ == '__main__':
    main()