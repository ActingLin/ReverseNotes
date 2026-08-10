# -*- coding: utf-8 -*-
"""
@File    : search.py
@Author  : Elliot Lin
@Date    : 2026/8/9 13:50
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
import requests
import loguru
import execjs


with open('./encode.js', 'r', encoding='utf-8') as f:
    js_code = f.read()
ctx = execjs.compile(js_code)

for page in range(1, 11):

    limit = 20
    # page = 2
    result = ctx.call("beforeSend", limit, page)
    loguru.logger.debug(result)

    headers = {
        "Accept": "application/json, text/javascript, */*; q=0.01",
        "Accept-Language": "zh-CN,zh;q=0.9",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Origin": "https://www.birdreport.cn",
        "Pragma": "no-cache",
        "Referer": "https://www.birdreport.cn/",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "same-site",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
        "requestId": result['requestId'],
        "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sign": result['sign'],
        "timestamp": str(result['timestamp'])
    }
    url = "https://api.birdreport.cn/front/activity/search"
    data = result['encrypt_data']

    response = requests.post(url, headers=headers, data=data)

    # print(response.json())
    # print(response)

    decode_resp = ctx.call("aes_decrypt", response.json().get('data'))
    loguru.logger.debug(decode_resp)