# -*- coding: utf-8 -*-
"""
@File    : main.py
@Author  : Elliot Lin
@Date    : 2026/8/8 21:21
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
import execjs
import loguru
import requests
import json


headers = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Content-Type": "application/json;charset=UTF-8",
    "Origin": "https://www.swguancha.com",
    "Pragma": "no-cache",
    "Referer": "https://www.swguancha.com/",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-site",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
    "deviceType": "1",
    "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\""
}
url = "https://app.swguancha.com/client/v1/article/client/page"
data = {
    "queryType": 3,
    "current": 2,
    "size": 20
}
data = json.dumps(data, separators=(',', ':'))
response = requests.post(url, headers=headers, data=data)

# print(response.text)
# print(response)

loguru.logger.success(response)

ctx = execjs.compile(open('./swgc.js', 'r', encoding='utf-8').read())
decode_resp = ctx.call('f', response.text)

loguru.logger.debug(decode_resp)
