# -*- coding: utf-8 -*-
"""
@File    : baogang.py
@Author  : Elliot Lin
@Date    : 2026/7/13 23:46
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
import requests
import json
import execjs

ctx = execjs.compile(open("baogang.js", encoding='utf-8').read())


for pageNum in range(1, 5):
    x_headers_info = ctx.call("x_headers_info", pageNum)
    print(x_headers_info)

    headers = {
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Content-Md5": x_headers_info["Content-Md5"],
        "Content-Type": "application/json;charset=UTF-8",
        "Origin": "https://www.baosteel.com",
        "Pragma": "no-cache",
        "Referer": "https://www.baosteel.com/",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
        "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "x-date": str(x_headers_info["x-date"]),
        "x-nonce": x_headers_info["x-nonce"],
        "x-signature": x_headers_info["x-signature"],
        "x-user": x_headers_info["x-user"]
    }
    url = "https://cmsauth.baowugroup.com/v1/web/api/content/list"
    params = {
        "domainId": "12"
    }
    data = {
        "pageNo": pageNum,
        "pageSize": 12,
        "condition": {
            "nodeId": 436
        }
    }
    data = json.dumps(data, separators=(',', ':'))
    response = requests.post(url, headers=headers, params=params, data=data)

    print(response.json())
    print('-' * 50)