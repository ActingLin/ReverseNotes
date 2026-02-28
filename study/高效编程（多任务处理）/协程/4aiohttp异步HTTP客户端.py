# -*- coding: utf-8 -*-
"""
@File    : 4aiohttp异步HTTP客户端.py
@Author  : Elliot Lin
@Date    : 2026/2/26 23:26
@Project : AAA-Frida
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
# import aiohttp
# import asyncio
#
# async def fetch_data():
#     async with aiohttp.ClientSession() as session:
#         async with session.get('https://httpbin.org/get') as response:
#             return await response.text()
#
# async def main():
#     print(await fetch_data())
#
# asyncio.run(main())

import aiohttp
import asyncio
import json


async def fetch_data(url, params):
    async with aiohttp.ClientSession() as session:
        async with session.get(url, params=params) as response:
            # 确保请求成功 (状态码 200-299)
            if response.status == 200:
                # 获取文本
                text_data = await response.text()
                print(text_data)
                # 或者获取 JSON (如果返回的是 JSON)
                json_data = await response.json()
                return text_data
            else:
                return f"Error: {response.status}"


async def main():
    url = 'https://httpbin.org/get'
    params = {'key1': 'value1', 'key2': 'value2'}

    print("正在请求数据...")

    # 【关键】await 协程调用，将返回值赋给 variable
    html_content = await fetch_data(url, params)
    print("\n✅ 数据获取成功:\n",html_content)

    # 尝试解析 JSON (因为 httpbin 返回的是 JSON)
    try:
        data_dict = json.loads(html_content)
        print("\n📊 解析后的参数部分:")
        print(data_dict.get('args'))
    except json.JSONDecodeError:
        print("返回的不是 JSON 格式")


if __name__ == '__main__':
    asyncio.run(main())