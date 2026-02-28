# -*- coding: utf-8 -*-
"""
@File    : 6异步爬虫.py
@Author  : Elliot Lin
@Date    : 2026/2/26 23:50
@Project : AAA-Frida
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 原来的脚本不能用了，被 Cloudflare 拦截，使用curl_cffi绕过检测，后面协程也改为线程池了，顺便改bs4为xpath
"""
import asyncio
import os
import aiofiles
from lxml import etree
# import requests
# 替换原来的 import requests
from curl_cffi import requests as curl_requests
from concurrent.futures import ThreadPoolExecutor


def get_page_source(web):
    headers = {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    }
    try:
        print(f"🚀 正在使用 curl_cffi 请求: {web}")
        # impersonate 参数是关键，它模拟 Chrome 浏览器的指纹
        response = curl_requests.get(web, headers=headers, impersonate="chrome120", timeout=10)
        response.encoding = 'utf-8'

        # 简单检查是否成功绕过
        if "Just a moment" in response.text:
            print("❌ 警告：仍然被 Cloudflare 拦截！")
            return ""

        return response.text
    except Exception as e:
        print(f"❌ 请求失败: {e}")
        return ""


# def get_page_source(web):
#     headers = {
#         "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:147.0) Gecko/20100101 Firefox/147.0"
#     }
#     response = requests.get(web, headers=headers)
#     response.encoding = 'utf-8'
#     return response.text


def parse_page_source(html):
    book_list = []

    # soup = BeautifulSoup(html, 'html.parser')
    # a_list = soup.find_all('div', attrs={'class': 'mulu-list quanji'})
    # for a in a_list:
    #     a_list = a.find_all('a')
    #     for href in a_list:
    #         chapter_url = href['href']
    #         book_list.append(chapter_url)

    tree = etree.HTML(html)
    a_list = tree.xpath('//div[@class="mulu-list quanji"]/ul/li/a')
    for href in a_list:
        chapter_url = href.xpath('./@href')[0]
        book_list.append(chapter_url)
    return book_list


def get_book_name(book_page):
    book_number = book_page.split('/')[-1].split('.')[0]
    book_chapter_name = book_page.split('/')[-2]
    return book_number, book_chapter_name


# async def aio_download_one(chapter_url, signal):
#     number, c_name = get_book_name(chapter_url)
#     for c in range(10):
#         try:
#             async with signal:
#                 async with aiohttp.ClientSession() as session:
#                     async with session.get(chapter_url) as resp:
#                         page_source = await resp.text()
#
#                         # soup = BeautifulSoup(page_source, 'html.parser')
#                         # chapter_name = soup.find('h1').text
#                         # p_content = soup.find('div', attrs={'class': 'neirong'}).find_all('p')
#                         # content = [p.text + '\n' for p in p_content]
#                         # chapter_content = '\n'.join(content)
#
#                         tree = etree.HTML(page_source)
#                         chapter_name = tree.xpath('//div[@class="content book-content"]/h1/text()')[0]
#                         p_list = tree.xpath('//div[@class="neirong"]/p')
#                         content = [p.xpath('./text()')[0] + '\n' for p in p_list]
#                         chapter_content = '\n'.join(content)
#
#                         if not os.path.exists(f'{book_name}/{c_name}'):
#                             os.makedirs(f'{book_name}/{c_name}')
#                         async with aiofiles.open(f'{book_name}/{c_name}/{number}_{chapter_name}.txt', mode="w",
#                                                  encoding='utf-8') as f:
#                             await f.write(chapter_content)
#                         print(chapter_url, "下载完毕!")
#                         return ""
#         except Exception as e:
#             print(e)
#             print(chapter_url, "下载失败!, 重新下载. ")
#     return chapter_url


# 定义一个同步的请求函数，供线程池调用
def fetch_html_sync(url):
    headers = {
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    }
    try:
        # 这里使用和你测试成功的代码完全一样的逻辑
        response = curl_requests.get(url, headers=headers, impersonate="chrome120", timeout=15)
        response.encoding = 'utf-8'

        # 双重检查：如果拿到的是拦截页，直接抛出异常，触发重试
        if "Just a moment" in response.text or "cf_chl_opt" in response.text:
            raise Exception("被 Cloudflare 拦截")

        return response.text
    except Exception as e:
        # 把异常抛出去，让外层捕获
        raise e


async def aio_download_one(chapter_url, signal):
    number, c_name = get_book_name(chapter_url)

    # 重试机制
    for c in range(5):  # 增加重试次数
        try:
            async with signal:
                loop = asyncio.get_event_loop()

                # 【核心修改】在线程池中运行同步请求
                # 这样既用了 curl_cffi 的绕过能力，又不会阻塞主线程
                with ThreadPoolExecutor(max_workers=1) as executor:
                    page_source = await loop.run_in_executor(executor, fetch_html_sync, chapter_url)

                # --- 解析逻辑 (保持你测试成功的逻辑) ---
                tree = etree.HTML(page_source)

                # 1. 获取标题 (增加安全检查，防止再次报错)
                title_list = tree.xpath('//div[@class="content book-content"]/h1/text()')
                if not title_list:
                    raise Exception("无法找到标题 (XPath 返回空)")

                chapter_name = title_list[0].strip()
                # 清理文件名非法字符
                safe_chapter_name = "".join(c for c in chapter_name if c not in r'\/:*?"<>|')

                # 2. 获取内容
                p_list = tree.xpath('//div[@class="neirong"]/p')
                if not p_list:
                    raise Exception("无法找到正文内容 (XPath 返回空)")

                # 提取文本，过滤空行
                content = []
                for p in p_list:
                    texts = p.xpath('./text()')
                    if texts:
                        text = "".join(texts).strip()
                        if text:
                            content.append(text + '\n')

                if not content:
                    raise Exception("提取到的内容为空")

                chapter_content = '\n'.join(content)
                # --------------------------------------

                # 保存文件
                save_dir = f'{book_name}/{c_name}'
                if not os.path.exists(save_dir):
                    os.makedirs(save_dir)

                filename = f'{save_dir}/{number}_{safe_chapter_name}.txt'
                async with aiofiles.open(filename, mode="w", encoding='utf-8') as f:
                    await f.write(chapter_content)

                print(f"✅ [{number}] {chapter_name} 下载完毕!")
                return ""

        except Exception as e:
            err_msg = str(e)
            # 如果是被拦截，打印具体提示
            if "拦截" in err_msg:
                print(f"⚠️ [{number}] 被 Cloudflare 拦截 (尝试 {c + 1}/5)...")
            else:
                print(f"❌ [{number}] 下载失败: {e} (尝试 {c + 1}/5)")

            if c < 4:
                await asyncio.sleep(2)  # 重试前等待
            else:
                print(f"💀 [{number}] 最终失败，跳过。")
                return chapter_url
    return ""


async def aio_download(url_list):
    tasks = []
    semaphore = asyncio.Semaphore(5)
    for h in url_list:
        tasks.append(asyncio.create_task(aio_download_one(h, semaphore)))
    await asyncio.wait(tasks)


if __name__ == '__main__':
    url = 'https://www.51shucheng.net/daomu/guichuideng'
    book_name = '鬼吹灯'
    if not os.path.exists(book_name):
        os.makedirs(book_name)
    source = get_page_source(url)
    # print(source)
    # 小说章节url
    href_list = parse_page_source(source)
    # print(href_list)

    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    loop.run_until_complete(aio_download(href_list))
    loop.close()
