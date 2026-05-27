# -*- coding: utf-8 -*-
"""
@File    : 7协程爬取m3u8视频.py
@Author  : Elliot Lin
@Date    : 2026/3/13 13:42
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
import requests
from urllib.parse import urljoin

# 从html页面获取m3u8视频链接
def get_m3u8_url():
    pass

# 第一次请求m3u8获
def get_m3u8_one(url, headers):
    # url = "https://hn.bfvvs.com/play/penrOoYe/index.m3u8"
    response = requests.get(url, headers=headers)
    save_m3u8_info('m3u8_one.m3u8', response.text)
    domain = url.rsplit('/', 3)[0]
    part_url2 = (response.text.split('/', 2)[-1]).strip()

    return urljoin(domain, part_url2)


def get_m3u8_two(url, headers):
    response = requests.get(url, headers=headers)


def save_m3u8_info(filename, text):
    with open(f'{filename}.txt', 'w', encoding='utf-8')  as f:
        f.write(text)

def get_ts_list():
    f = open('m3u8_two.txt', 'r')


if __name__ == '__main__':
    headers = {
        "accept": "*/*",
        "accept-language": "zh-CN,zh;q=0.9",
        "cache-control": "no-cache",
        "origin": "https://yhyz.hfcms.cc",
        "pragma": "no-cache",
        "priority": "u=1, i",
        "referer": "https://yhyz.hfcms.cc/",
        "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36"
    }
    # m3u8_url = get_m3u8_url()
    m3u8_url = 'https://hn.bfvvs.com/play/penrOoYe/index.m3u8'
    url_one = get_m3u8_one(m3u8_url, headers)
    get_ts_list()

# https://hn.bfvvs.com/play/penrOoYe/index.m3u8
# https://hn.bfvvs.com/play/penrOoYe/index.m3u8

# #EXTM3U
# #EXT-X-STREAM-INF:PROGRAM-ID=1,BANDWIDTH=4096000,RESOLUTION=1920x1080
# /play/hls/penrOoYe/index.m3u8

#                     /play/hls/penrOoYe/index.m3u8
# https://hn.bfvvs.com/play/hls/penrOoYe/index.m3u8