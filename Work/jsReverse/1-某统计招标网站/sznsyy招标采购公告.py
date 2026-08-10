# -*- coding: utf-8 -*-
"""
@File    : sznsyy招标采购公告.py
@Author  : Elliot Lin
@Date    : 2026/2/3 22:36
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 采集招标公告PDF文件
"""

import subprocess
from functools import partial
subprocess.Popen = partial(subprocess.Popen, encoding='utf-8')

import execjs
import requests

# 编译js代码
js_code = execjs.compile(open('cg.js', 'r', encoding='utf-8').read())
headers = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Connection": "keep-alive",
    "Referer": "https://zbcg.sznsyy.cn/noticeDetail/18599/1/6",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
    "aesKey": "AUuNmaKnW+pLgPuPA0hyxX0uFa5aOank3uj9UkfMuCr/PVRGxtpHdj1CDAYgvYxOcK11IDHLm7bmlHs+Ab7QlmpT53kEEqqwUcGnJSUj3gBRbc2AfrQk1RUscmFMppYflq++kmfzZ//mwsfbYiO9B3iIzUZcSyoKQwevIF+f7rY=",
    "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\""
}

# 获取fileKey
def get_fileKey(e):
    # 公告ID
    # e = 'noticeType=1&middleId=18601'
    # 第一次请求的网站
    url = "https://zbcg.sznsyy.cn/sz/purchaser/public/getBulletinDetailInfo"
    # 获取加密参数epcos
    result = js_code.call("get_data", e)
    params = {
        "epcos": result['epcos']
    }
    # 更新请求头headers中的aesKey
    headers["aesKey"] = result['aesKey']
    # 发送请求，获取json数据
    response = requests.get(url, headers=headers, params=params)
    js_data = response.json()
    print(js_data)

    # 解密得到基本信息
    info_data = js_code.call("m", js_data)
    print(info_data)
    # 提取fileKey
    fileKey = info_data['data']['announcementKey']
    # 提取公告标题
    title = info_data['data']['bulletinName']

    return fileKey, title


def download_file(fileKey, title):
    download_e = "fileKey=" + fileKey
    # 获取加密参数
    download_result = js_code.call("get_data", download_e)
    # 更新请求头headers中的aesKey
    headers["aesKey"] = download_result['aesKey']
    # PDF下载地址
    download_url = 'https://zbcg.sznsyy.cn/sz/file/download?epcos=' + download_result['epcos']
    # 发送请求，获取PDF二进制数据
    content = requests.get(download_url, headers=headers).content
    # 保存PDF数据
    with open('pdf\\' + title + '.pdf', 'wb') as f:
        # 写入数据
        f.write(content)


if __name__ == '__main__':
    e = 'noticeType=1&middleId=18601'
    fileKey, title = get_fileKey(e)
    download_file(fileKey, title)
