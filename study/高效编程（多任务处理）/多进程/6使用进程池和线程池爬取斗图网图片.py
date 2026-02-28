# # -*- coding: utf-8 -*-
# """
# @File    : 使用进程池和线程池爬取斗图网图片.py
# @Author  : Elliot Lin
# @Date    : 2026/2/23 10:05
# @Project : AAA-Frida
# @Github  : https://github.com/ActingLin/ReverseNotes
# @Desc    :
# """
# import time
# from multiprocessing import Process, Queue
#
# import requests
# from lxml import etree
#
# headers = {
#     "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0"
# }
#
# url = "	https://www.doutupk.com/article/list/?page=2"
#
# def get_detail_url(url, q):
#     reap = requests.get(url, headers=headers)
#     data = reap.content.decode('utf-8')
#     # print(data)
#     tree = etree.HTML(data)
#     # 详情页url
#     detail_url = tree.xpath('//div[@class="col-sm-9 center-wrap"]/a/@href')
#     # print(detail_url)
#     for detail in detail_url:
#         q.put(detail.strip())
#     reap.close()
#
# def get_img_src(url, q):
#     reap = requests.get(url, headers=headers)
#     data = reap.content.decode('utf-8')
#     tree = etree.HTML(data)
#     srcs = tree.xpath('//div[@class="artile_des]/table/tbody/tr/td/a/img/@src')
#     for src in srcs:
#         q.put(src.strip())
#     reap.close()
#
# if __name__ == '__main__':
#     t1 = time.time()
#     qu_detail = Queue()    # 两个进程必须使用同一个队列. 否则数据传输不了
#     qu_img = Queue()
#     p_list = []
#     for i in range(4):
#         url = f"https://www.doutupk.com/article/list/?page={i}"
#         p = Process(target=get_detail_url, args=(url, qu_detail,))
#         p_list.append(p)
#
#     for p in p_list:
#         p.start()
#
#     for p in p_list:
#         p.join()
#
#     print(qu_detail.get())
#     print((time.time() - t1) / 60)


# -*- coding: utf-8 -*-
"""
@File    : 使用进程池和线程池爬取斗图网图片.py
@Author  : Elliot Lin
@Date    : 2026/2/23 10:05
@Project  : AAA-Frida
@Desc    : 使用进程池控制并发数
"""
import time
from multiprocessing import Pool, Manager, cpu_count
import requests
from lxml import etree

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0"
}

BASE_URL = "https://www.doutupk.com"


def get_detail_url_task(url):
    """任务1：抓取列表页，返回详情页URL列表"""
    try:
        resp = requests.get(url, headers=headers, timeout=10)
        resp.encoding = 'utf-8'
        tree = etree.HTML(resp.text)
        detail_urls = tree.xpath('//div[@class="col-sm-9 center-wrap"]/a/@href')
        resp.close()

        # 拼接完整URL
        result = []
        for d in detail_urls:
            full_url = d if d.startswith('http') else BASE_URL + d
            result.append(full_url.strip())

        print(f"[+] 列表页: {url} → 获取 {len(result)} 个详情页")
        return result
    except Exception as e:
        print(f"[-] 列表页失败: {url} - {e}")
        return []


def get_img_src_task(url):
    """任务2：抓取详情页，返回图片URL列表"""
    try:
        resp = requests.get(url, headers=headers, timeout=10)
        resp.encoding = 'utf-8'
        tree = etree.HTML(resp.text)

        srcs = tree.xpath('//div[@class="artile_des"]/table/tbody/tr/td/a/img/@src')
        resp.close()

        # 拼接完整URL
        result = []
        for s in srcs:
            full_src = s if s.startswith('http') else BASE_URL + s
            result.append(full_src.strip())

        print(f"[+] 详情页: {url} → 获取 {len(result)} 张图片")
        return result
    except Exception as e:
        print(f"[-] 详情页失败: {url} - {e}")
        return []


def flatten(nested_list):
    """展平嵌套列表"""
    return [item for sublist in nested_list for item in sublist]


if __name__ == '__main__':
    t1 = time.time()

    print("=" * 60)
    print("第一阶段：抓取列表页 → 获取详情页URL")
    print("=" * 60)

    # 列表页URL
    list_urls = [f"https://www.doutupk.com/article/list/?page={i}" for i in range(1, 5)]

    # 使用进程池（限制并发数 = CPU核心数）
    with Pool(cpu_count()) as pool:
        detail_results = pool.map(get_detail_url_task, list_urls)

    # 展平结果
    detail_urls = flatten(detail_results)
    print(f"\n[✓] 第一阶段完成！共获取 {len(detail_urls)} 个详情页\n")

    print("=" * 60)
    print("第二阶段：抓取详情页 → 获取图片URL")
    print("=" * 60)

    # 使用进程池（限制并发数 = CPU核心数）
    with Pool(cpu_count()) as pool:
        img_results = pool.map(get_img_src_task, detail_urls)

    # 展平结果
    img_urls = flatten(img_results)
    print(f"\n[✓] 第二阶段完成！共获取 {len(img_urls)} 张图片\n")

    print("=" * 60)
    print("第三阶段：下载图片")
    print("=" * 60)

    # 下载图片（用线程池，IO密集型）
    from concurrent.futures import ThreadPoolExecutor


    def download_img(img_url):
        try:
            resp = requests.get(img_url, headers=headers, timeout=10)
            filename = img_url.split('/')[-1].split('?')[0] or f"img_{int(time.time() * 1000)}.jpg"
            with open(f"images/{filename}", 'wb') as f:
                f.write(resp.content)
            print(f"[↓] {filename}")
            return True
        except Exception as e:
            print(f"[-] 下载失败: {img_url}")
            return False


    import os

    os.makedirs("images", exist_ok=True)

    with ThreadPoolExecutor(20) as executor:
        list(executor.map(download_img, img_urls))

    t2 = time.time()
    print(f"\n[✓] 全部完成！总耗时: {(t2 - t1) / 60:.2f} 分钟")