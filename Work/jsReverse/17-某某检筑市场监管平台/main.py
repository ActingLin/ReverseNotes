# -*- coding: utf-8 -*-
"""
@File    : main.py
@Author  : Elliot Lin
@Date    : 2026/8/8 10:38
@Project : ReverseNotes
@Github  : https://github.com/ActingLin/ReverseNotes
@Desc    : 
"""
import requests
import loguru
import execjs

headers = {
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "zh-CN,zh;q=0.9",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Pragma": "no-cache",
    "Referer": "https://jzsc.mohurd.gov.cn/data/company",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "same-origin",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
    "accessToken;": "",
    "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\", \"Google Chrome\";v=\"138\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "timeout": "30000",
    "v": "231012"
}
url = "https://jzsc.mohurd.gov.cn/APi/webApi/dataservice/query/comp/list"
params = {
    "pg": "3",
    "pgsz": "15",
    "total": "450"
}
response = requests.get(url, headers=headers, params=params)

# print(response.text)
# print(response)
loguru.logger.success(response)

ctx = execjs.compile(open('./jzsc_aes.js', 'r', encoding='utf-8').read())
decode_resp = ctx.call('decode_resp', response.text)

loguru.logger.debug(decode_resp)